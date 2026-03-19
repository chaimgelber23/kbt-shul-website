import { unstable_cache } from "next/cache";
import { getAdminFirestore } from "./firebaseAdmin";

interface EnhancedMapping {
  originalUrl: string;
  enhancedUrl: string;
  title: string;
  processedAt: string;
}

/**
 * Fetch the full enhanced shiurim mapping from Firestore.
 * Cached for 1 hour via Next.js unstable_cache.
 */
async function fetchEnhancedMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  try {
    const db = getAdminFirestore();
    if (!db) return map;

    const snapshot = await db.collection("enhancedShiurim").get();
    snapshot.forEach((doc) => {
      const data = doc.data() as EnhancedMapping;
      if (data.originalUrl && data.enhancedUrl) {
        map.set(data.originalUrl, data.enhancedUrl);
      }
    });
  } catch (err) {
    console.error("Failed to fetch enhanced audio map:", err);
  }

  return map;
}

// Cache the mapping for 1 hour
const getCachedEnhancedMap = unstable_cache(
  async () => {
    const map = await fetchEnhancedMap();
    // Convert Map to plain object for serialization
    return Object.fromEntries(map);
  },
  ["enhanced-audio-map"],
  { revalidate: 3600 }
);

/**
 * Given an original audio URL, return the enhanced URL if available.
 * Falls back to the original URL if no enhanced version exists.
 */
export async function resolveAudioUrl(originalUrl: string): Promise<string> {
  const mapping = await getCachedEnhancedMap();
  return mapping[originalUrl] || originalUrl;
}

/**
 * Swap enhanced URLs into an array of shiurim.
 * Used in shiurim.ts after fetching from all sources.
 */
export async function applyEnhancedUrls<T extends { audioUrl: string }>(
  shiurim: T[]
): Promise<T[]> {
  const mapping = await getCachedEnhancedMap();
  if (Object.keys(mapping).length === 0) return shiurim;

  return shiurim.map((shiur) => {
    const enhanced = mapping[shiur.audioUrl];
    if (enhanced) {
      return { ...shiur, audioUrl: enhanced };
    }
    return shiur;
  });
}
