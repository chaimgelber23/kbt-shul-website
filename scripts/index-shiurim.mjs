#!/usr/bin/env node
// Index every shiur and show how each maps to a parsha — the verification tool
// for "This Week's Parsha". Uses the SAME canonicalization/matching the site
// uses (src/lib/parsha-map.mjs), so what you see here is what the site sees.
//
// Usage:
//   node scripts/index-shiurim.mjs            # full index + coverage + unknowns
//   node scripts/index-shiurim.mjs Behar      # also list shiurim for one parsha
//
// Writes scripts/temp/shiurim-index.json for programmatic use.

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  PARSHIYOS_BY_SEFER,
  canonicalParsha,
  extractParshaFromTitle,
  shiurBelongsToParsha,
} from "../src/lib/parsha-map.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const KNOWN = new Set();
const READING_ORDER = [];
for (const list of Object.values(PARSHIYOS_BY_SEFER)) {
  for (const p of list) {
    KNOWN.add(p);
    READING_ORDER.push(p);
  }
}

function loadEpisodes() {
  const raw = readFileSync(join(ROOT, "src/data/archive.json"), "utf8");
  return JSON.parse(raw).episodes || [];
}

function main() {
  const episodes = loadEpisodes();
  const parshaShiurim = []; // { title, raw, canonical, known }
  const nonParsha = [];

  for (const ep of episodes) {
    const title = ep.title || "";
    if (!/^\s*parsh/i.test(title)) {
      nonParsha.push(title);
      continue;
    }
    const raw = extractParshaFromTitle(title);
    const canonical = raw ? canonicalParsha(raw) : "";
    const known = canonical
      ? canonical.split(/\s+-\s+/).every((part) => KNOWN.has(part))
      : false;
    parshaShiurim.push({ title, raw, canonical, known });
  }

  // Group recognized parsha shiurim by each constituent canonical parsha.
  const byParsha = {};
  for (const p of READING_ORDER) byParsha[p] = [];
  for (const s of parshaShiurim) {
    if (!s.known) continue;
    for (const part of s.canonical.split(/\s+-\s+/)) {
      if (byParsha[part]) byParsha[part].push(s.title);
    }
  }

  const unknown = parshaShiurim.filter((s) => !s.known);

  // ---- human-readable report ----
  console.log("=".repeat(70));
  console.log("SHIURIM INDEX");
  console.log("=".repeat(70));
  console.log(`Total shiurim (archive):     ${episodes.length}`);
  console.log(`Parsha shiurim:              ${parshaShiurim.length}`);
  console.log(`  recognized parsha:         ${parshaShiurim.length - unknown.length}`);
  console.log(`  UNRECOGNIZED spelling:     ${unknown.length}`);
  console.log(`Non-parsha shiurim:          ${nonParsha.length}`);

  console.log("\n--- Parsha coverage (reading order) ---");
  const gaps = [];
  for (const p of READING_ORDER) {
    const n = byParsha[p].length;
    if (n === 0) gaps.push(p);
    console.log(`  ${String(n).padStart(3)}  ${p}`);
  }
  console.log(`\nParshiyos with NO shiurim (${gaps.length}): ${gaps.join(", ") || "none"}`);

  if (unknown.length) {
    console.log("\n--- UNRECOGNIZED parsha spellings (add these to parsha-map.mjs VARIANTS) ---");
    for (const s of unknown) {
      console.log(`  raw=${JSON.stringify(s.raw)}  ->  ${JSON.stringify(s.canonical)}   | ${s.title}`);
    }
  }

  // Optional: list every shiur for a specific parsha passed on the CLI.
  const arg = process.argv.slice(2).join(" ").trim();
  if (arg) {
    const canon = canonicalParsha(arg);
    const matches = episodes.filter((ep) => shiurBelongsToParsha(ep, canon));
    console.log(`\n--- Shiurim matching "${arg}" -> "${canon}" (${matches.length}) ---`);
    for (const ep of matches) console.log(`  ${ep.title}`);
  }

  // ---- machine-readable output ----
  const outDir = join(ROOT, "scripts/temp");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "shiurim-index.json");
  writeFileSync(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totals: {
          all: episodes.length,
          parsha: parshaShiurim.length,
          recognized: parshaShiurim.length - unknown.length,
          unrecognized: unknown.length,
          nonParsha: nonParsha.length,
        },
        coverage: Object.fromEntries(READING_ORDER.map((p) => [p, byParsha[p].length])),
        gaps,
        unknown,
        byParsha,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`\nWrote ${outPath}`);
}

main();
