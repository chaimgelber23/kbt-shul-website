/**
 * One-time scrape of all shiurim from jewishpodcasts.fm.
 * Cycles through each category to capture episodes that only appear
 * under specific category filters.
 * Run with: node scripts/scrape-archive.mjs
 */

import { chromium } from "playwright";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../src/data/archive.json");
const PAGE_URL = "https://listen.jewishpodcasts.fm/rabbisteinhauer";

async function scrape() {
  // Load existing archive to build on top of it
  const allEpisodes = new Map();
  if (existsSync(OUTPUT_PATH)) {
    try {
      const existing = JSON.parse(readFileSync(OUTPUT_PATH, "utf-8"));
      for (const ep of existing.episodes || []) {
        if (ep.title) allEpisodes.set(ep.title, ep);
      }
      console.log(`Loaded ${allEpisodes.size} existing episodes from archive`);
    } catch (e) {
      console.log("No valid existing archive, starting fresh");
    }
  }

  console.log("Launching browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Capture episode data from network responses
  page.on("response", async (response) => {
    try {
      const text = await response.text().catch(() => "");
      if (!text || text.length < 50) return;

      const titleRegex = /"title"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
      const storageRegex = /"storageUrl"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
      const dateRegex = /"publishDate"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
      const durationRegex = /"duration"\s*:\s*"?(\d+)"?/g;

      const titles = [...text.matchAll(titleRegex)].map(m => m[1]);
      const urls = [...text.matchAll(storageRegex)].map(m => m[1]);
      const dates = [...text.matchAll(dateRegex)].map(m => m[1]);
      const durations = [...text.matchAll(durationRegex)].map(m => parseInt(m[1]));

      if (titles.length > 0 && urls.length > 0) {
        const count = Math.min(titles.length, urls.length);
        for (let i = 0; i < count; i++) {
          const title = titles[i];
          if (!title || allEpisodes.has(title)) continue;
          allEpisodes.set(title, {
            title,
            audioUrl: urls[i] || "",
            pubDate: dates[i] || "",
            durationSeconds: durations[i] || 0,
          });
        }
      }
    } catch (e) {}
  });

  console.log("Loading page...");
  await page.goto(PAGE_URL, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(8000);
  console.log(`Initial load: ${allEpisodes.size} episodes`);

  // Step 1: Load all episodes in the default "All" view
  await loadAllInCurrentView(page, allEpisodes, "All");

  // Step 2: Find all category filter buttons
  const categoryButtons = await page.locator('button').all();
  const categories = [];
  for (const btn of categoryButtons) {
    const text = await btn.textContent().catch(() => "");
    // Category buttons are typically short text, not "Load More", "Download", etc.
    if (
      text &&
      text.trim().length > 1 &&
      text.trim().length < 50 &&
      !text.match(/load more|download|play|pause|share|subscribe|follow/i) &&
      !text.match(/^\d+$/) &&
      !text.match(/^[x×✕]$/i)
    ) {
      categories.push({ element: btn, name: text.trim() });
    }
  }

  // Deduplicate category names
  const seenCats = new Set(["All"]);
  const uniqueCategories = [];
  for (const cat of categories) {
    if (!seenCats.has(cat.name)) {
      seenCats.add(cat.name);
      uniqueCategories.push(cat);
    }
  }

  console.log(`\nFound ${uniqueCategories.length} category buttons: ${uniqueCategories.map(c => c.name).join(", ")}`);

  // Step 3: Click each category and load all episodes within it
  for (let i = 0; i < uniqueCategories.length; i++) {
    const cat = uniqueCategories[i];
    const beforeCount = allEpisodes.size;
    console.log(`\n[${i + 1}/${uniqueCategories.length}] Category: "${cat.name}" (${allEpisodes.size} total so far)`);

    try {
      // Re-find the button (DOM may have changed)
      const btn = page.locator(`button:has-text("${cat.name}")`).first();
      const isVis = await btn.isVisible().catch(() => false);
      if (!isVis) {
        // Scroll up to find category buttons
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(1000);
      }

      await btn.click();
      await page.waitForTimeout(3000);

      // Load all episodes in this category
      await loadAllInCurrentView(page, allEpisodes, cat.name);

      const gained = allEpisodes.size - beforeCount;
      if (gained > 0) {
        console.log(`  +${gained} new episodes from "${cat.name}"`);
      }
    } catch (e) {
      console.log(`  Error with category "${cat.name}": ${e.message}`);
    }

    // Save intermediate progress every 5 categories
    if ((i + 1) % 5 === 0) {
      saveArchive(allEpisodes);
      console.log(`  [Saved intermediate progress: ${allEpisodes.size} episodes]`);
    }
  }

  console.log(`\nDone! Total unique episodes: ${allEpisodes.size}`);
  await browser.close();

  saveArchive(allEpisodes);
}

/**
 * In the current view (category), keep clicking "Load More" until no new data appears.
 */
async function loadAllInCurrentView(page, allEpisodes, viewName) {
  let noNewRounds = 0;
  let lastCount = allEpisodes.size;
  let round = 0;

  while (noNewRounds < 5 && round < 500) {
    round++;

    try {
      const loadMoreBtn = page.locator('button:has-text("Load More")').first();
      const isVisible = await loadMoreBtn.isVisible().catch(() => false);

      if (isVisible) {
        await loadMoreBtn.click();
        await page.waitForTimeout(2000);
      } else {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(1500);
      }
    } catch (e) {
      await page.waitForTimeout(1500);
    }

    if (allEpisodes.size > lastCount) {
      noNewRounds = 0;
    } else {
      noNewRounds++;
    }
    lastCount = allEpisodes.size;
  }
}

function saveArchive(allEpisodes) {
  const episodes = Array.from(allEpisodes.values());
  const archive = {
    scrapedAt: new Date().toISOString(),
    source: PAGE_URL,
    count: episodes.length,
    episodes,
  };
  writeFileSync(OUTPUT_PATH, JSON.stringify(archive, null, 2));
  console.log(`Saved ${episodes.length} episodes to ${OUTPUT_PATH}`);
}

scrape().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
