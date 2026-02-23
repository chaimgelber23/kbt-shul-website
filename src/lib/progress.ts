import type { Shiur } from "./types";

export interface ShiurProgress {
  shiurId: string;
  seriesSlug?: string;
  currentTime: number;
  duration: number;
  lastListened: string; // ISO date
  completed: boolean;
}

export interface SeriesProgress {
  seriesSlug: string;
  lastShiurId: string;
  lastListened: string; // ISO date
  totalListened: number;
}

const PROGRESS_KEY = "kbt-shiurim-progress";
const SERIES_PROGRESS_KEY = "kbt-series-progress";

export function getShiurProgress(shiurId: string): ShiurProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (!data) return null;
    const progress: Record<string, ShiurProgress> = JSON.parse(data);
    return progress[shiurId] || null;
  } catch {
    return null;
  }
}

export function saveShiurProgress(progress: ShiurProgress): void {
  if (typeof window === "undefined") return;
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    const allProgress: Record<string, ShiurProgress> = data ? JSON.parse(data) : {};
    allProgress[progress.shiurId] = {
      ...progress,
      lastListened: new Date().toISOString(),
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (e) {
    console.error("Failed to save shiur progress:", e);
  }
}

export function getSeriesProgress(seriesSlug: string): SeriesProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(SERIES_PROGRESS_KEY);
    if (!data) return null;
    const progress: Record<string, SeriesProgress> = JSON.parse(data);
    return progress[seriesSlug] || null;
  } catch {
    return null;
  }
}

export function saveSeriesProgress(seriesSlug: string, shiurId: string): void {
  if (typeof window === "undefined") return;
  try {
    const data = localStorage.getItem(SERIES_PROGRESS_KEY);
    const allProgress: Record<string, SeriesProgress> = data ? JSON.parse(data) : {};
    const current = allProgress[seriesSlug];
    allProgress[seriesSlug] = {
      seriesSlug,
      lastShiurId: shiurId,
      lastListened: new Date().toISOString(),
      totalListened: current ? current.totalListened + 1 : 1,
    };
    localStorage.setItem(SERIES_PROGRESS_KEY, JSON.stringify(allProgress));
  } catch (e) {
    console.error("Failed to save series progress:", e);
  }
}

export function getAllProgress(): Record<string, ShiurProgress> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(PROGRESS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function getRecentShiurim(limit = 10): ShiurProgress[] {
  const allProgress = getAllProgress();
  return Object.values(allProgress)
    .sort((a, b) => new Date(b.lastListened).getTime() - new Date(a.lastListened).getTime())
    .slice(0, limit);
}

/**
 * Check if a shiur has been started (listened to for more than 10 seconds)
 */
export function hasStarted(shiurId: string): boolean {
  const progress = getShiurProgress(shiurId);
  return progress ? progress.currentTime > 10 : false;
}

/**
 * Check if a shiur is in progress (started but not completed)
 */
export function isInProgress(shiurId: string): boolean {
  const progress = getShiurProgress(shiurId);
  if (!progress) return false;
  return progress.currentTime > 10 && !progress.completed;
}

/**
 * Get the next shiur in a series based on progress
 */
export function getNextShiur(shiurim: Shiur[], currentShiurId: string): Shiur | null {
  const currentIndex = shiurim.findIndex((s) => s.id === currentShiurId);
  if (currentIndex === -1 || currentIndex === shiurim.length - 1) return null;
  return shiurim[currentIndex + 1];
}

/**
 * Get recommended shiur for a series (resume from last, or start from beginning)
 * Returns { shiur, shouldResume, isLatest }
 */
export function getRecommendedShiur(seriesSlug: string, shiurim: Shiur[]): {
  shiur: Shiur | null;
  shouldResume: boolean;
  isLatest: boolean;
  lastListenedShiur: Shiur | null;
} {
  if (shiurim.length === 0) {
    return { shiur: null, shouldResume: false, isLatest: false, lastListenedShiur: null };
  }

  // Get series progress
  const seriesProgress = getSeriesProgress(seriesSlug);

  if (seriesProgress) {
    // Find the last listened shiur
    const lastShiur = shiurim.find((s) => s.id === seriesProgress.lastShiurId);

    if (lastShiur) {
      const shiurProgress = getShiurProgress(lastShiur.id);

      // If the last shiur is in progress (not completed), resume it
      if (shiurProgress && !shiurProgress.completed && shiurProgress.currentTime > 10) {
        return {
          shiur: lastShiur,
          shouldResume: true,
          isLatest: false,
          lastListenedShiur: lastShiur,
        };
      }

      // If the last shiur was completed, get the next one
      if (shiurProgress?.completed) {
        const nextShiur = getNextShiur(shiurim, lastShiur.id);
        if (nextShiur) {
          return {
            shiur: nextShiur,
            shouldResume: false,
            isLatest: false,
            lastListenedShiur: lastShiur,
          };
        }
      }

      // Otherwise, return the last listened shiur
      return {
        shiur: lastShiur,
        shouldResume: false,
        isLatest: false,
        lastListenedShiur: lastShiur,
      };
    }
  }

  // No progress found - start from the first shiur (oldest)
  // Sort by date to get the oldest (first in series)
  const sortedShiurim = [...shiurim].sort(
    (a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime()
  );

  return {
    shiur: sortedShiurim[0],
    shouldResume: false,
    isLatest: false,
    lastListenedShiur: null,
  };
}

/**
 * Get progress percentage for a shiur (0-100)
 */
export function getProgressPercentage(shiurId: string): number {
  const progress = getShiurProgress(shiurId);
  if (!progress || progress.duration === 0) return 0;
  return Math.min(100, Math.round((progress.currentTime / progress.duration) * 100));
}
