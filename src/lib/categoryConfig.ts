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
  "acharei mos": "Vayikra", "acharei mot": "Vayikra", "achrei mos": "Vayikra",
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
  mattos: "Bamidbar", mattot: "Bamidbar", matos: "Bamidbar",
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

/** Find the canonical parsha name from a variant spelling */
function canonicalParsha(parshaName: string): string {
  const lower = parshaName.toLowerCase();
  // Check if it's in our lookup
  if (PARSHA_TO_SEFER[lower]) {
    const sefer = PARSHA_TO_SEFER[lower];
    // Find the canonical name from PARSHIYOS_BY_SEFER
    const parshiyos = PARSHIYOS_BY_SEFER[sefer];
    if (parshiyos) {
      for (const p of parshiyos) {
        if (p.toLowerCase() === lower || PARSHA_TO_SEFER[p.toLowerCase()] === sefer) {
          // Check common variants
          if (lower.startsWith(p.toLowerCase().slice(0, 3))) return p;
        }
      }
    }
  }
  // Fall back to title case of what was given
  return parshaName.charAt(0).toUpperCase() + parshaName.slice(1);
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
