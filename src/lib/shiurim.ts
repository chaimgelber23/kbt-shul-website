import { readFileSync } from "fs";
import { join } from "path";
import { fetchFromRss } from "./rss";
import { fetchFromPodcastIndex } from "./podcastIndex";
import { categorizeTitle } from "./categories";
import { applyEnhancedUrls } from "./enhancedAudio";
import type { Shiur } from "./types";

interface ArchiveEpisode {
  title: string;
  audioUrl: string;
  pubDate: string;
  durationSeconds: number;
}

interface ArchiveData {
  episodes: ArchiveEpisode[];
}

function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function archiveEpisodeToShiur(ep: ArchiveEpisode, index: number): Shiur {
  const title = ep.title || "";
  const { categoryId, subLevel1, subLevel2 } = categorizeTitle(title);

  return {
    id: `archive-${index}`,
    title,
    audioUrl: ep.audioUrl || "",
    duration: formatDuration(ep.durationSeconds || 0),
    durationSeconds: ep.durationSeconds || 0,
    pubDate: ep.pubDate ? new Date(ep.pubDate).toISOString() : "",
    description: "",
    link: "",
    categoryId,
    subLevel1,
    subLevel2,
  };
}

function loadArchive(): Shiur[] {
  try {
    const filePath = join(process.cwd(), "src/data/archive.json");
    const raw = readFileSync(filePath, "utf-8");
    const data: ArchiveData = JSON.parse(raw);
    return (data.episodes || []).map(archiveEpisodeToShiur);
  } catch {
    return [];
  }
}

/**
 * Normalize title for deduplication.
 * Lowercase, collapse whitespace, trim.
 */
function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Fetch all shiurim from all sources, merge, and deduplicate.
 * Priority: RSS (highest) > Podcast Index > Archive (lowest).
 * Deduplicates by normalized title since IDs differ across sources.
 */
export async function fetchAllShiurim(): Promise<Shiur[]> {
  // Fetch live sources in parallel
  const [rssShiurim, piShiurim] = await Promise.all([
    fetchFromRss(),
    fetchFromPodcastIndex(),
  ]);

  // Load static archive (bundled at build time)
  const archiveShiurim = loadArchive();

  // Merge by title: archive first (lowest priority), then PI, then RSS (highest)
  const byTitle = new Map<string, Shiur>();

  for (const shiur of archiveShiurim) {
    const key = normalizeTitle(shiur.title);
    if (key) byTitle.set(key, shiur);
  }

  for (const shiur of piShiurim) {
    const key = normalizeTitle(shiur.title);
    if (key) byTitle.set(key, shiur);
  }

  for (const shiur of rssShiurim) {
    const key = normalizeTitle(shiur.title);
    if (key) byTitle.set(key, shiur);
  }

  // Sort by date, newest first
  const merged = Array.from(byTitle.values());
  merged.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  // Swap in enhanced audio URLs where available
  const enhanced = await applyEnhancedUrls(merged);

  return enhanced;
}
