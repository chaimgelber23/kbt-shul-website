#!/usr/bin/env node
/**
 * Shiurim Audio Enhancement Pipeline
 *
 * Downloads shiurim from jewishpodcasts.fm, enhances with DeepFilterNet (AI noise removal)
 * + FFmpeg loudnorm (volume normalization), uploads to Firebase Storage,
 * and records the mapping in Firestore.
 *
 * Usage:
 *   node scripts/enhance-shiurim.mjs                  # Process all unenhanced shiurim
 *   node scripts/enhance-shiurim.mjs --limit 10       # Process up to 10 shiurim
 *   node scripts/enhance-shiurim.mjs --url <url>      # Process a single shiur by URL
 *   node scripts/enhance-shiurim.mjs --recent 20      # Process the 20 most recent unenhanced
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { readFileSync, existsSync, mkdirSync, unlinkSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execFileSync, spawnSync } from "child_process";
import { createHash } from "crypto";
import { XMLParser } from "fast-xml-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "..");
const TEMP_DIR = join(__dirname, "temp");
const DEEP_FILTER_BIN = existsSync(join(__dirname, "bin", "deep-filter.exe"))
  ? join(__dirname, "bin", "deep-filter.exe")
  : join(__dirname, "bin", "deep-filter");
const SERVICE_ACCOUNT_PATH = join(PROJECT_ROOT, "service-account-key.json");

// --- Configuration ---
const RSS_URL = "https://rss.jewishpodcasts.fm/rss/256";
const STORAGE_BUCKET = "kbt-shul-website.firebasestorage.app";
const FIRESTORE_COLLECTION = "enhancedShiurim";

// --- Parse CLI args ---
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}
const LIMIT = parseInt(getArg("limit") || "0", 10);
const SINGLE_URL = getArg("url");
const RECENT = parseInt(getArg("recent") || "0", 10);

// --- Initialize Firebase Admin ---
if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error("❌ Missing service-account-key.json in project root.");
  console.error("   Generate one from Firebase Console > Project Settings > Service Accounts");
  process.exit(1);
}

const app = initializeApp({
  credential: cert(JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf-8"))),
  storageBucket: STORAGE_BUCKET,
});
const db = getFirestore(app);
const bucket = getStorage(app).bucket();

// --- Helpers ---
function hashUrl(url) {
  return createHash("md5").update(url).digest("hex");
}

function ensureTempDir() {
  if (!existsSync(TEMP_DIR)) mkdirSync(TEMP_DIR, { recursive: true });
}

function cleanTempDir() {
  if (existsSync(TEMP_DIR)) {
    for (const f of readdirSync(TEMP_DIR)) {
      try { unlinkSync(join(TEMP_DIR, f)); } catch {}
    }
  }
}

async function fetchRssFeed() {
  console.log("📡 Fetching RSS feed...");
  const res = await fetch(RSS_URL);
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const feed = parser.parse(xml);
  const items = feed?.rss?.channel?.item || [];
  return (Array.isArray(items) ? items : [items]).map((item) => ({
    title: item.title || "",
    audioUrl: item.enclosure?.["@_url"] || "",
    pubDate: item.pubDate || "",
  })).filter((s) => s.audioUrl);
}

function loadArchive() {
  const archivePath = join(PROJECT_ROOT, "src/data/archive.json");
  if (!existsSync(archivePath)) return [];
  const data = JSON.parse(readFileSync(archivePath, "utf-8"));
  return (data.episodes || []).filter((e) => e.audioUrl);
}

async function getAlreadyEnhanced() {
  console.log("🔍 Checking Firestore for already-enhanced shiurim...");
  const snapshot = await db.collection(FIRESTORE_COLLECTION).get();
  const enhanced = new Set();
  snapshot.forEach((doc) => {
    enhanced.add(doc.data().originalUrl);
  });
  console.log(`   Found ${enhanced.size} already enhanced.`);
  return enhanced;
}

function downloadAudio(url, outputPath) {
  console.log(`   ⬇️  Downloading audio...`);
  execFileSync("curl", ["-L", "-o", outputPath, "--max-time", "300", url], {
    stdio: "pipe",
  });
}

function convertToWav48k(inputMp3, outputWav) {
  console.log(`   🔄 Converting to WAV 48kHz...`);
  execFileSync("ffmpeg", [
    "-y", "-i", inputMp3,
    "-ar", "48000", "-ac", "1",
    outputWav,
  ], { stdio: "pipe" });
}

function runDeepFilter(inputWav, outputDir) {
  console.log(`   🧠 Running DeepFilterNet AI enhancement...`);
  const enhancedDir = join(outputDir, "enhanced");
  if (!existsSync(enhancedDir)) mkdirSync(enhancedDir, { recursive: true });
  execFileSync(DEEP_FILTER_BIN, [
    inputWav,
    "-o", enhancedDir,
    "--pf",  // enable post-filter for extra noise reduction
  ], { stdio: "pipe", timeout: 1800000 }); // 30 min timeout for longer shiurim
  return enhancedDir;
}

function normalizeAndConvertToMp3(inputWav, outputMp3) {
  console.log(`   📊 Normalizing loudness & converting to MP3...`);

  // Pass 1: measure loudness (FFmpeg outputs stats to stderr)
  let measuredI = "-24", measuredTP = "-2", measuredLRA = "7", measuredThresh = "-34";
  const nullDev = process.platform === "win32" ? "NUL" : "/dev/null";
  const result = spawnSync("ffmpeg", [
    "-y", "-i", inputWav,
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json",
    "-f", "null", nullDev,
  ], { stdio: ["pipe", "pipe", "pipe"], timeout: 300000 });

  const stderr = result.stderr?.toString() || "";
  try {
    const jsonMatch = stderr.match(/\{[\s\S]*"input_i"[\s\S]*\}/);
    if (jsonMatch) {
      const measured = JSON.parse(jsonMatch[0]);
      measuredI = measured.input_i;
      measuredTP = measured.input_tp;
      measuredLRA = measured.input_lra;
      measuredThresh = measured.input_thresh;
    }
  } catch {}

  // Pass 2: apply normalization with measured values
  execFileSync("ffmpeg", [
    "-y", "-i", inputWav,
    "-af", `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${measuredI}:measured_TP=${measuredTP}:measured_LRA=${measuredLRA}:measured_thresh=${measuredThresh}:linear=true`,
    "-ar", "48000",
    "-b:a", "128k",
    outputMp3,
  ], { stdio: "pipe" });
}

async function uploadToStorage(localPath, storagePath) {
  console.log(`   ☁️  Uploading to Firebase Storage...`);
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType: "audio/mpeg",
      cacheControl: "public, max-age=31536000", // Cache for 1 year
    },
  });
  // Make publicly readable
  await bucket.file(storagePath).makePublic();
  const publicUrl = `https://storage.googleapis.com/${STORAGE_BUCKET}/${storagePath}`;
  return publicUrl;
}

async function recordInFirestore(originalUrl, enhancedUrl, title) {
  const docId = hashUrl(originalUrl);
  await db.collection(FIRESTORE_COLLECTION).doc(docId).set({
    originalUrl,
    enhancedUrl,
    title,
    processedAt: new Date().toISOString(),
  });
}

async function enhanceShiur(shiur) {
  const { title, audioUrl } = shiur;
  const hash = hashUrl(audioUrl);

  const mp3Input = join(TEMP_DIR, `${hash}-input.mp3`);
  const wavInput = join(TEMP_DIR, `${hash}-input.wav`);
  const mp3Output = join(TEMP_DIR, `${hash}-enhanced.mp3`);
  const storagePath = `enhanced-shiurim/${hash}.mp3`;

  try {
    // Step 1: Download
    downloadAudio(audioUrl, mp3Input);

    // Step 2: Convert to WAV 48kHz (required by DeepFilterNet)
    convertToWav48k(mp3Input, wavInput);

    // Step 3: AI noise removal with DeepFilterNet
    const enhancedDir = runDeepFilter(wavInput, TEMP_DIR);
    const wavEnhanced = join(enhancedDir, `${hash}-input.wav`); // Same filename in enhanced/ subdir

    // Step 4: Loudness normalization + convert back to MP3
    normalizeAndConvertToMp3(wavEnhanced, mp3Output);

    // Step 5: Upload to Firebase Storage
    const enhancedUrl = await uploadToStorage(mp3Output, storagePath);

    // Step 6: Record mapping in Firestore
    await recordInFirestore(audioUrl, enhancedUrl, title);

    console.log(`   ✅ Done: ${title.substring(0, 60)}`);
    return true;
  } catch (err) {
    console.error(`   ❌ Failed: ${title.substring(0, 60)} - ${err.message}`);
    return false;
  } finally {
    // Clean up temp files for this shiur
    const enhancedDir = join(TEMP_DIR, "enhanced");
    const wavEnhanced = join(enhancedDir, `${hash}-input.wav`);
    for (const f of [mp3Input, wavInput, wavEnhanced, mp3Output]) {
      try { if (existsSync(f)) unlinkSync(f); } catch {}
    }
  }
}

// --- Main ---
async function main() {
  console.log("🎙️  KBT Shiurim Audio Enhancement Pipeline");
  console.log("==========================================\n");

  // Verify DeepFilterNet binary exists
  if (!existsSync(DEEP_FILTER_BIN)) {
    console.error(`❌ DeepFilterNet binary not found at: ${DEEP_FILTER_BIN}`);
    console.error("   Download from: https://github.com/Rikorose/DeepFilterNet/releases");
    process.exit(1);
  }

  ensureTempDir();

  // Gather all shiurim from RSS + archive
  let allShiurim = [];

  if (SINGLE_URL) {
    allShiurim = [{ title: "Manual", audioUrl: SINGLE_URL, pubDate: "" }];
  } else {
    const [rssShiurim, archiveShiurim] = await Promise.all([
      fetchRssFeed().catch(() => []),
      Promise.resolve(loadArchive()),
    ]);

    // Deduplicate by URL
    const byUrl = new Map();
    for (const s of archiveShiurim) byUrl.set(s.audioUrl, s);
    for (const s of rssShiurim) byUrl.set(s.audioUrl, s); // RSS takes priority
    allShiurim = Array.from(byUrl.values());

    // Sort newest first
    allShiurim.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    console.log(`📚 Found ${allShiurim.length} total shiurim across all sources.`);
  }

  // Filter out already-enhanced
  const alreadyEnhanced = await getAlreadyEnhanced();
  let toProcess = allShiurim.filter((s) => !alreadyEnhanced.has(s.audioUrl));
  console.log(`🆕 ${toProcess.length} shiurim need enhancement.\n`);

  if (toProcess.length === 0) {
    console.log("✨ All shiurim are already enhanced! Nothing to do.");
    return;
  }

  // Apply limits
  if (RECENT > 0) toProcess = toProcess.slice(0, RECENT);
  if (LIMIT > 0) toProcess = toProcess.slice(0, LIMIT);

  console.log(`🔧 Processing ${toProcess.length} shiurim...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const shiur = toProcess[i];
    console.log(`\n[${i + 1}/${toProcess.length}] "${shiur.title.substring(0, 70)}"`);

    const ok = await enhanceShiur(shiur);
    if (ok) success++;
    else failed++;

    // Small delay between shiurim to be nice to the source server
    if (i < toProcess.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  cleanTempDir();

  console.log("\n==========================================");
  console.log(`🎉 Enhancement complete!`);
  console.log(`   ✅ Success: ${success}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Total enhanced: ${alreadyEnhanced.size + success}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
