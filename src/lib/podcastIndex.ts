import { createHash } from "crypto";
import type { Shiur } from "./types";
import { categorizeTitle } from "./categories";

const FEED_URL = "https://rss.jewishpodcasts.fm:443/rss/256";
const API_BASE = "https://api.podcastindex.org/api/1.0";

interface PodcastIndexEpisode {
  id: number;
  title: string;
  link: string;
  enclosureUrl: string;
  enclosureLength: number;
  enclosureType: string;
  duration: number; // seconds
  datePublished: number; // unix timestamp
  description: string;
  feedId: number;
}

function getAuthHeaders(): Record<string, string> | null {
  const apiKey = process.env.PODCAST_INDEX_API_KEY;
  const apiSecret = process.env.PODCAST_INDEX_API_SECRET;

  if (!apiKey || !apiSecret) return null;

  const now = Math.floor(Date.now() / 1000);
  const hash = createHash("sha1")
    .update(apiKey + apiSecret + now)
    .digest("hex");

  return {
    "X-Auth-Key": apiKey,
    "X-Auth-Date": String(now),
    Authorization: hash,
    "User-Agent": "KBT-Shul-Website/1.0",
  };
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

function piEpisodeToShiur(ep: PodcastIndexEpisode): Shiur {
  const title = ep.title || "";
  const { categoryId, subLevel1, subLevel2 } = categorizeTitle(title);

  return {
    id: String(ep.id),
    title,
    audioUrl: ep.enclosureUrl || "",
    duration: formatDuration(ep.duration || 0),
    durationSeconds: ep.duration || 0,
    pubDate: new Date(ep.datePublished * 1000).toISOString(),
    description: ep.description || "",
    link: ep.link || "",
    categoryId,
    subLevel1,
    subLevel2,
  };
}

/**
 * Fetch episodes from the Podcast Index API.
 * Returns up to 1000 episodes (the API max per request).
 * Returns empty array if API keys are not configured.
 */
export async function fetchFromPodcastIndex(): Promise<Shiur[]> {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const url = `${API_BASE}/episodes/byfeedurl?url=${encodeURIComponent(FEED_URL)}&max=1000`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      console.error(`Podcast Index API error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const items: PodcastIndexEpisode[] = data.items || [];
    return items.map(piEpisodeToShiur);
  } catch (err) {
    console.error("Podcast Index fetch error:", err);
    return [];
  }
}
