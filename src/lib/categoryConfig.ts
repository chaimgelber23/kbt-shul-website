import type { CategoryDef } from "./types";

// Parsha to Sefer lookup — handles common transliteration variants
const PARSHA_TO_SEFER: Record<string, string> = {
  // Bereishis
  bereishis: "Bereishis", bereshis: "Bereishis", beresheet: "Bereishis",
  noach: "Bereishis", noah: "Bereishis",
  "lech lecha": "Bereishis", "lech l'cha": "Bereishis",
  vayeira: "Bereishis", vayera: "Bereishis",
  "chayei sarah": "Bereishis", "chayei sara": "Bereishis",
  toldos: "Bereishis", toledot: "Bereishis", toldot: "Bereishis",
  vayeitzei: "Bereishis", vayetzei: "Bereishis", vayetze: "Bereishis",
  vayishlach: "Bereishis", vayishlah: "Bereishis",
  vayeishev: "Bereishis", vayeshev: "Bereishis",
  mikeitz: "Bereishis", miketz: "Bereishis",
  vayigash: "Bereishis",
  vayechi: "Bereishis", vaychi: "Bereishis",
  // Shemos
  shemos: "Shemos", shemot: "Shemos",
  "va'eira": "Shemos", vaeira: "Shemos", vaera: "Shemos",
  bo: "Shemos",
  beshalach: "Shemos", "b'shalach": "Shemos", bshalach: "Shemos",
  yisro: "Shemos", yitro: "Shemos", yisroe: "Shemos",
  mishpatim: "Shemos",
  terumah: "Shemos", trumah: "Shemos",
  tetzaveh: "Shemos", tetzave: "Shemos",
  "ki sisa": "Shemos", "ki tisa": "Shemos", "ki sissa": "Shemos",
  vayakhel: "Shemos", vayakheil: "Shemos",
  pekudei: "Shemos", pikudei: "Shemos",
  // Vayikra
  vayikra: "Vayikra",
  tzav: "Vayikra",
  shemini: "Vayikra", shmini: "Vayikra",
  tazria: "Vayikra",
  metzora: "Vayikra",
  "acharei mos": "Vayikra", "acharei mot": "Vayikra", "achrei mos": "Vayikra", "achrei mot": "Vayikra",
  kedoshim: "Vayikra",
  emor: "Vayikra",
  behar: "Vayikra",
  bechukosai: "Vayikra", bechukotai: "Vayikra", "b'chukosai": "Vayikra",
  // Bamidbar
  bamidbar: "Bamidbar",
  naso: "Bamidbar", nasso: "Bamidbar",
  "beha'aloscha": "Bamidbar", behaaloscha: "Bamidbar", "beha'alotcha": "Bamidbar", behaalotcha: "Bamidbar",
  shelach: "Bamidbar", shlach: "Bamidbar",
  korach: "Bamidbar",
  chukas: "Bamidbar", chukat: "Bamidbar",
  balak: "Bamidbar",
  pinchas: "Bamidbar", pinchos: "Bamidbar",
  mattos: "Bamidbar", mattot: "Bamidbar", matos: "Bamidbar", matot: "Bamidbar",
  masei: "Bamidbar", massei: "Bamidbar",
  // Devarim
  devarim: "Devarim",
  "va'eschanan": "Devarim", vaeschanan: "Devarim", vaetchanan: "Devarim",
  eikev: "Devarim", ekev: "Devarim",
  "re'eh": "Devarim", reeh: "Devarim",
  shoftim: "Devarim",
  "ki seitzei": "Devarim", "ki tetze": "Devarim", "ki teitzei": "Devarim", "ki setzei": "Devarim",
  "ki savo": "Devarim", "ki tavo": "Devarim",
  nitzavim: "Devarim",
  vayeilech: "Devarim", vayelech: "Devarim",
  "ha'azinu": "Devarim", haazinu: "Devarim",
  "v'zos habracha": "Devarim", "vzos habracha": "Devarim", "vezot haberachah": "Devarim",
};

// Canonical parsha names in order, for display
export const PARSHIYOS_BY_SEFER: Record<string, string[]> = {
  Bereishis: ["Bereishis", "Noach", "Lech Lecha", "Vayeira", "Chayei Sarah", "Toldos", "Vayeitzei", "Vayishlach", "Vayeishev", "Mikeitz", "Vayigash", "Vayechi"],
  Shemos: ["Shemos", "Va'eira", "Bo", "Beshalach", "Yisro", "Mishpatim", "Terumah", "Tetzaveh", "Ki Sisa", "Vayakhel", "Pekudei"],
  Vayikra: ["Vayikra", "Tzav", "Shemini", "Tazria", "Metzora", "Acharei Mos", "Kedoshim", "Emor", "Behar", "Bechukosai"],
  Bamidbar: ["Bamidbar", "Naso", "Beha'aloscha", "Shelach", "Korach", "Chukas", "Balak", "Pinchas", "Mattos", "Masei"],
  Devarim: ["Devarim", "Va'eschanan", "Eikev", "Re'eh", "Shoftim", "Ki Seitzei", "Ki Savo", "Nitzavim", "Vayeilech", "Ha'azinu", "V'Zos HaBracha"],
};

function lookupSefer(parshaName: string): string | undefined {
  return PARSHA_TO_SEFER[parshaName.toLowerCase()];
}

/**
 * Explicit mapping: variant spelling (lowercase) → canonical parsha name.
 * Each canonical name maps to itself, and all known transliteration variants
 * map to the same canonical. This ensures "ki tisa" → "Ki Sisa", etc.
 */
const VARIANT_TO_CANONICAL: Record<string, string> = {};

// 1) Every canonical name maps to itself
for (const parshiyos of Object.values(PARSHIYOS_BY_SEFER)) {
  for (const p of parshiyos) {
    VARIANT_TO_CANONICAL[p.toLowerCase()] = p;
  }
}

// 2) Every variant in PARSHA_TO_SEFER maps to the canonical in the same sefer.
//    We find the right canonical by checking: among all canonical names in that
//    sefer, which one is ALSO a key in PARSHA_TO_SEFER? Since variants of the
//    same parsha are listed in a block, we match by the parsha whose canonical
//    lowercase is closest to (or identical to) one of the variants on the same line.
//    Reliable approach: for each variant, the canonical is the parsha in the sefer
//    whose own lowercase is also in PARSHA_TO_SEFER with the same sefer, AND
//    we haven't already assigned this variant to a different canonical.
//
//    Since the PARSHA_TO_SEFER object lists variants grouped by parsha (on the
//    same source line), we leverage the source-order: variants appear right after
//    their canonical. We process in order and track which canonical we're "in".
(function buildVariantMap() {
  const canonicalSet = new Set(Object.keys(VARIANT_TO_CANONICAL));
  let currentCanonical: string | null = null;

  for (const variant of Object.keys(PARSHA_TO_SEFER)) {
    if (canonicalSet.has(variant)) {
      // This IS a canonical name — set it as current context
      currentCanonical = VARIANT_TO_CANONICAL[variant];
    } else if (currentCanonical) {
      // This is a variant of the current canonical
      VARIANT_TO_CANONICAL[variant] = currentCanonical;
    }
  }
})();

/** Find the canonical parsha name from a variant spelling.
 * Handles double parshiyos (e.g., "Achrei Mot-Kedoshim" → "Acharei Mos - Kedoshim").
 */
export function canonicalParsha(parshaName: string): string {
  const trimmed = parshaName.trim();
  if (/[-–]/.test(trimmed)) {
    return trimmed
      .split(/\s*[-–]\s*/)
      .map((part) => canonicalParsha(part))
      .join(" - ");
  }
  const lower = trimmed.toLowerCase();
  return VARIANT_TO_CANONICAL[lower] ||
    trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/** Split a parsha name into its canonical constituent parts.
 * Single parsha → array of one. Double → array of two.
 */
export function splitParshaNames(parshaName: string): string[] {
  return parshaName
    .split(/\s*[-–]\s*/)
    .map((part) => canonicalParsha(part.trim()))
    .filter(Boolean);
}

/**
 * Get all known lowercase variant spellings for a canonical parsha name.
 * E.g., "Ki Sisa" → ["ki sisa", "ki tisa", "ki sissa"]
 */
export function getParshaVariants(canonicalName: string): string[] {
  const variants: string[] = [];
  for (const [variant, canonical] of Object.entries(VARIANT_TO_CANONICAL)) {
    if (canonical === canonicalName) variants.push(variant);
  }
  // Always include the canonical itself
  const lower = canonicalName.toLowerCase();
  if (!variants.includes(lower)) variants.push(lower);
  return variants;
}

function extractParshaLevels(title: string): [string | undefined, string | undefined] {
  // Match "Parshas Vayeira" or "Parsha Vayeira" — capture the parsha name
  const match = title.match(/^Parshas?\s+([A-Za-z'`\- ]+?)(?:[,.:;]|\s+[-–]|\s+\d|$)/i);
  if (!match) return [undefined, undefined];

  const parshaRaw = match[1].trim();
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
