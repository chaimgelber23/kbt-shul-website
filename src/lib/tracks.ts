import { SERIES } from "./seriesConfig";
import type { SeriesGroup } from "./types";

/**
 * A "track" is an ordered sequence of series learned in a fixed seder
 * (e.g., the Neviim in Tanach order). The order is taken from each series'
 * `displayOrder` field in seriesConfig — so adding/reordering a sefer is a
 * data change, not a code change.
 *
 * This powers the "continue in the seder" journey: when a listener finishes
 * Shmuel I, the next shiur is the first of Shmuel II, then Melachim, etc.
 */
export interface TrackMeta {
  group: NonNullable<SeriesGroup>;
  label: string;
  description: string;
}

// Only Navi is a continuous Tanach journey. Halacha series stay independent.
export const TRACKS: TrackMeta[] = [
  {
    group: "navi",
    label: "Your Tanach Journey",
    description:
      "Journey through the Neviim in their order — Yehoshua, Shoftim, Shmuel, and Melachim — one sefer flowing into the next.",
  },
];

/** Ordered series slugs for a group (by displayOrder asc, then config order). */
export function getOrderedSlugsForGroup(group: NonNullable<SeriesGroup>): string[] {
  return SERIES.filter((s) => s.group === group)
    .slice()
    .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
    .map((s) => s.slug);
}

/** The track metadata for a group, or null if the group isn't a track. */
export function getTrackMeta(group: SeriesGroup): TrackMeta | null {
  if (!group) return null;
  return TRACKS.find((t) => t.group === group) ?? null;
}

/**
 * If a series belongs to an ordered track, return the track meta plus the
 * full ordered slug list. Returns null for standalone series.
 */
export function getTrackForSeries(
  slug: string
): { meta: TrackMeta; slugs: string[] } | null {
  const series = SERIES.find((s) => s.slug === slug);
  if (!series?.group) return null;
  const meta = getTrackMeta(series.group);
  if (!meta) return null;
  const slugs = getOrderedSlugsForGroup(series.group);
  if (slugs.length < 2) return null;
  return { meta, slugs };
}

/** The slug of the series that follows `slug` in its track, or null. */
export function getNextSeriesSlug(slug: string): string | null {
  const track = getTrackForSeries(slug);
  if (!track) return null;
  const i = track.slugs.indexOf(slug);
  if (i < 0 || i + 1 >= track.slugs.length) return null;
  return track.slugs[i + 1];
}
