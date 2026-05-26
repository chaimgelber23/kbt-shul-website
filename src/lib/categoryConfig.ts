import type { CategoryDef } from "./types";
// Parsha canonicalization + matching live in ONE place (parsha-map.mjs) so the
// app and the offline audit (scripts/index-shiurim.mjs) can't drift apart.
import {
  PARSHIYOS_BY_SEFER,
  canonicalParsha,
  splitParshaNames,
  getParshaVariants,
  shiurBelongsToParsha,
  lookupSefer,
  extractParshaFromTitle,
} from "./parsha-map.mjs";

export {
  PARSHIYOS_BY_SEFER,
  canonicalParsha,
  splitParshaNames,
  getParshaVariants,
  shiurBelongsToParsha,
};

function extractParshaLevels(title: string): [string | undefined, string | undefined] {
  const parshaRaw = extractParshaFromTitle(title);
  if (!parshaRaw) return [undefined, undefined];
  const sefer = lookupSefer(parshaRaw);
  const parsha = canonicalParsha(parshaRaw);
  return [sefer, parsha];
}

function extractSeferPerekLevels(title: string): [string | undefined, string | undefined] {
  // Match "Melachim I, perek 2" or "Melachim I 2.3" or "Shir Hashirim 4.16"
  const match = title.match(/^([A-Za-z ]+?)(?:\s*,?\s*(?:perek\s*)?(\d+))?(?:[.,:]|\s|$)/i);
  if (!match) return [undefined, undefined];
  const sefer = match[1].trim();
  const perek = match[2] || undefined;
  return [sefer, perek ? `Perek ${perek}` : undefined];
}

function extractTopicLevels(title: string): [string | undefined, string | undefined] {
  // Match "Hilchos talmud Torah" → topic = "Talmud Torah"
  const match = title.match(/^(?:Hilchos|Halachos|Halacha\s+series[:\s]*)\s*(.+?)(?:\s+part\s+\d+|\s+\d+)?$/i);
  if (!match) return [undefined, undefined];
  const topic = match[1].trim();
  // Title case the topic
  const formatted = topic.replace(/\b\w/g, (c) => c.toUpperCase());
  return [formatted, undefined];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "parsha",
    label: "Parsha",
    description: "Weekly Torah portion",
    patterns: [/^Parshas?\s/i],
    drillDown: "parsha",
    extractLevels: extractParshaLevels,
  },
  {
    id: "navi",
    label: "Navi",
    description: "Prophets",
    patterns: [/^Melachim/i, /^Yehoshua/i, /^Shoftim\s+\d/i, /^Shmuel/i, /^Yeshaya/i, /^Yirmiya/i, /^Yechezkel/i],
    drillDown: "sefer-perek",
    extractLevels: extractSeferPerekLevels,
  },
  {
    id: "shir-hashirim",
    label: "Shir Hashirim",
    description: "Song of Songs",
    patterns: [/^Shir Hashirim/i, /^Shir hashirim/i],
    drillDown: "sefer-perek",
    extractLevels: extractSeferPerekLevels,
  },
  {
    id: "halacha",
    label: "Halacha",
    description: "Jewish law",
    patterns: [/^Hilchos\s/i, /^Halachos\s/i, /^Halacha\s+series/i],
    drillDown: "topic",
    extractLevels: extractTopicLevels,
  },
  {
    id: "machshava",
    label: "Machshava",
    description: "Jewish thought & philosophy",
    patterns: [/^Machshava/i],
    drillDown: null,
  },
  {
    id: "kuzari",
    label: "Kuzari",
    description: "Sefer HaKuzari",
    patterns: [/^Kuzari/i],
    drillDown: null,
  },
  {
    id: "mesilas-yesharim",
    label: "Mesilas Yesharim",
    description: "Path of the Just",
    patterns: [/^Mesilas\s+[Yy]esho?rim/i, /^Mesillas\s+[Yy]esho?rim/i],
    drillDown: null,
  },
  {
    id: "nefesh-hachaim",
    label: "Nefesh HaChaim",
    description: "By Rav Chaim Volozhiner",
    patterns: [/^Nefesh\s+[Hh]a[Cc]hayim/i, /^Nefesh\s+[Hh]a[Cc]haim/i],
    drillDown: null,
  },
  {
    id: "pirkei-avos",
    label: "Pirkei Avos",
    description: "Ethics of the Fathers",
    patterns: [/^Pirkei\s+[Aa]vos/i, /^Pirkei\s+[Aa]vot/i, /^Ruach\s+[Cc]haim/i],
    drillDown: null,
  },
  {
    id: "chinuch",
    label: "Chinuch",
    description: "Education & child-rearing",
    patterns: [/^Chinuch/i],
    drillDown: null,
  },
  {
    id: "emunah",
    label: "Emunah",
    description: "Faith & belief",
    patterns: [/^Emunah/i, /^Emuna\s/i],
    drillDown: null,
  },
  {
    id: "mussar",
    label: "Mussar",
    description: "Ethics & self-improvement",
    patterns: [/^Mussar/i, /^Musar/i],
    drillDown: null,
  },
  {
    id: "tefillah",
    label: "Tefillah",
    description: "Prayer",
    patterns: [/^Tefill?ah/i, /^T'fillah/i],
    drillDown: null,
  },
  {
    id: "general",
    label: "General",
    description: "Other shiurim",
    patterns: [], // catch-all — matches everything not matched above
    drillDown: null,
  },
];
