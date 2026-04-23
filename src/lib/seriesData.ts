import { fetchAllShiurim } from "./shiurim";
import { SERIES, SERIES_GROUPS, classifyYomTovTopic, matchTitleToSeries } from "./seriesConfig";
import { PARSHIYOS_BY_SEFER } from "./categoryConfig";
import type { Shiur, SeriesStats, SeriesDef } from "./types";

/**
 * Series that are dedicated study tracks (a sefer, a Rambam, a navi).
 * Their shiurim should NOT be cross-pulled into yamim-tovim even if a
 * title happens to mention a Yom Tov keyword — otherwise the entire
 * Hilchos Teshuva Rambam series would flood the "Teshuva" chip.
 */
const STRUCTURED_SERIES_SLUGS = new Set([
  "yehoshua",
  "shoftim",
  "shmuel",
  "melachim",
  "hilchos-teshuva",
  "hilchos-yesodei-hatorah",
  "hilchos-talmud-torah",
  "hilchos-deos",
  "hilchos-shabbos",
  "kuzari",
  "mesilas-yesharim",
  "nefesh-hachaim",
  "shir-hashirim",
  "shemone-perakim",
  "pirkei-avos",
  "ruach-chaim",
  "taryag-mitzvos",
  "taamei-hamitzvos",
  "yamim-tovim",
]);

/**
 * Match all shiurim that belong to a series.
 * Uses pattern matching, plus a special case for yamim-tovim that
 * also pulls in any shiur classified as a Yom Tov topic by content
 * (e.g., "Halacha series: selling chametz" → Pesach), regardless of
 * which series the title's primary pattern matched.
 */
function filterSeriesShiurim(series: SeriesDef, allShiurim: Shiur[]): Shiur[] {
  // "Other" is a true catch-all: only shiurim that no specific series claims.
  // Without this, the catch-all pattern /.+/ matches every title and floods the card.
  if (series.slug === "other") {
    const claimed = new Set<string>();
    for (const other of SERIES) {
      if (other.slug === "other") continue;
      for (const shiur of allShiurim) {
        if (other.patterns.some((p) => p.test(shiur.title))) claimed.add(shiur.id);
      }
    }
    // Also treat yamim-tovim cross-pulls (e.g., "Halacha series: selling chametz")
    // as claimed, so they don't double-count in Other.
    for (const shiur of allShiurim) {
      if (claimed.has(shiur.id)) continue;
      if (classifyYomTovTopic(shiur.title.toLowerCase()) === null) continue;
      const primary = matchTitleToSeries(shiur.title);
      if (primary && STRUCTURED_SERIES_SLUGS.has(primary.slug)) continue;
      claimed.add(shiur.id);
    }
    return allShiurim.filter((s) => !claimed.has(s.id));
  }

  const matched = allShiurim.filter((shiur) =>
    series.patterns.some((p) => p.test(shiur.title))
  );

  if (series.slug !== "yamim-tovim") return matched;

  const seen = new Set(matched.map((s) => s.id));
  for (const shiur of allShiurim) {
    if (seen.has(shiur.id)) continue;
    if (classifyYomTovTopic(shiur.title.toLowerCase()) === null) continue;
    // Skip shiurim whose primary series is a dedicated study track —
    // we don't want to flood yamim-tovim with e.g. all of Hilchos Teshuva.
    const primary = matchTitleToSeries(shiur.title);
    if (primary && STRUCTURED_SERIES_SLUGS.has(primary.slug)) continue;
    matched.push(shiur);
    seen.add(shiur.id);
  }
  return matched;
}

/**
 * Get all shiurim for a specific series, filtered by pattern matching.
 */
export async function getSeriesShiurim(slug: string): Promise<Shiur[]> {
  const series = SERIES.find((s) => s.slug === slug);
  if (!series) return [];

  const allShiurim = await fetchAllShiurim();
  return filterSeriesShiurim(series, allShiurim);
}

/**
 * Build a map from shiur.id → section name for a topic-type series.
 * The client uses this for filtering by topic chips, so that shiurim
 * whose section name doesn't appear verbatim in the title (e.g., a
 * "Shabbos Hagadol" shiur belongs to "Pesach") still get matched.
 */
export async function getSeriesSectionMap(slug: string): Promise<Record<string, string>> {
  const series = SERIES.find((s) => s.slug === slug);
  if (!series?.extractNav || series.navType !== "topic") return {};

  const shiurim = await getSeriesShiurim(slug);
  const map: Record<string, string> = {};
  for (const shiur of shiurim) {
    const nav = series.extractNav(shiur.title);
    if (nav.section) map[shiur.id] = nav.section;
  }
  return map;
}

/**
 * Get stats for all series — used by the landing page.
 * Returns { ungrouped, groups } so the landing page can render
 * individual cards + grouped sections separately.
 */
export async function getLandingData(): Promise<{
  ungrouped: SeriesStats[];
  groups: { id: string; label: string; description: string; series: SeriesStats[] }[];
  totalCount: number;
  latestShiurim: Shiur[];
}> {
  const allShiurim = await fetchAllShiurim();

  // Build stats for each series
  const allStats: SeriesStats[] = [];

  for (const series of SERIES) {
    const matching = filterSeriesShiurim(series, allShiurim);

    if (matching.length > 0) {
      const latestDate = matching.reduce(
        (latest, s) => (s.pubDate > latest ? s.pubDate : latest),
        matching[0].pubDate
      );

      allStats.push({
        slug: series.slug,
        name: series.name,
        description: series.description,
        group: series.group,
        episodeCount: matching.length,
        latestDate,
        displayOrder: series.displayOrder,
      });
    }
  }

  // Split into ungrouped and grouped
  const ungrouped = allStats
    .filter((s) => s.group === null)
    .sort((a, b) => b.episodeCount - a.episodeCount);

  const groups = (Object.entries(SERIES_GROUPS) as [string, { label: string; description: string }][])
    .map(([id, meta]) => ({
      id,
      label: meta.label,
      description: meta.description,
      series: allStats
        .filter((s) => s.group === id)
        .sort((a, b) => {
          // Sort by displayOrder if available (e.g., Tanach order for Navi)
          if (a.displayOrder != null && b.displayOrder != null)
            return a.displayOrder - b.displayOrder;
          if (a.displayOrder != null) return -1;
          if (b.displayOrder != null) return 1;
          return b.episodeCount - a.episodeCount;
        }),
    }))
    .filter((g) => g.series.length > 0);

  return {
    ungrouped,
    groups,
    totalCount: allShiurim.length,
    latestShiurim: allShiurim.slice(0, 6),
  };
}

/**
 * Get navigation sections for a series (perek list, topic list, etc.)
 * Returns sections in a sensible order (numeric for pereks, alphabetical for topics).
 */
export async function getSeriesNavSections(slug: string): Promise<string[]> {
  const series = SERIES.find((s) => s.slug === slug);
  if (!series?.extractNav) return [];

  // For parsha, return the sefer names in canonical order
  if (series.navType === "parsha") {
    return Object.keys(PARSHIYOS_BY_SEFER);
  }

  const shiurim = await getSeriesShiurim(slug);
  const sections = new Set<string>();

  for (const shiur of shiurim) {
    const nav = series.extractNav(shiur.title);
    if (nav.section) sections.add(nav.section);
  }

  return Array.from(sections).sort((a, b) => {
    // Sort numerically if perek-style
    const numA = parseInt(a.replace(/\D/g, ""));
    const numB = parseInt(b.replace(/\D/g, ""));
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });
}

/**
 * For parsha series: get the parshiyos within a sefer that have shiurim.
 */
export async function getParshaSubSections(sefer: string): Promise<string[]> {
  const allShiurim = await getSeriesShiurim("parsha");
  const parshaSeries = SERIES.find((s) => s.slug === "parsha");
  if (!parshaSeries?.extractNav) return [];

  const canonicalParshiyos = PARSHIYOS_BY_SEFER[sefer] || [];
  const available = new Set<string>();

  for (const shiur of allShiurim) {
    const nav = parshaSeries.extractNav(shiur.title);
    if (nav.section) {
      // Check if this parsha belongs to the given sefer
      const lower = nav.section.toLowerCase();
      for (const canonical of canonicalParshiyos) {
        if (canonical.toLowerCase().startsWith(lower.slice(0, 3))) {
          available.add(canonical);
        }
      }
    }
  }

  // Return in canonical order, filtered to those with shiurim
  return canonicalParshiyos.filter((p) => available.has(p));
}
