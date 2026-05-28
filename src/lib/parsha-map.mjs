// Single source of truth for parsha canonicalization + shiur matching.
//
// Imported by BOTH the app (categoryConfig.ts, via Next/webpack) and the
// offline audit (scripts/index-shiurim.mjs, via plain Node ESM). Keeping the
// canonical names + spelling variants in one place is what stops "This Week's
// Parsha" from silently missing shiurim when a title is spelled a new way.
//
// Plain ESM, no types — do not add TS syntax here.

// Canonical parsha names per sefer, in reading order (used for display + nav).
export const PARSHIYOS_BY_SEFER = {
  Bereishis: ["Bereishis", "Noach", "Lech Lecha", "Vayeira", "Chayei Sarah", "Toldos", "Vayeitzei", "Vayishlach", "Vayeishev", "Mikeitz", "Vayigash", "Vayechi"],
  Shemos: ["Shemos", "Va'eira", "Bo", "Beshalach", "Yisro", "Mishpatim", "Terumah", "Tetzaveh", "Ki Sisa", "Vayakhel", "Pekudei"],
  Vayikra: ["Vayikra", "Tzav", "Shemini", "Tazria", "Metzora", "Acharei Mos", "Kedoshim", "Emor", "Behar", "Bechukosai"],
  Bamidbar: ["Bamidbar", "Nasso", "Beha'aloscha", "Shelach", "Korach", "Chukas", "Balak", "Pinchas", "Mattos", "Masei"],
  Devarim: ["Devarim", "Va'eschanan", "Eikev", "Re'eh", "Shoftim", "Ki Seitzei", "Ki Savo", "Nitzavim", "Vayeilech", "Ha'azinu", "V'Zos HaBracha"],
};

// canonical name -> known alternate spellings (any transliteration / typo seen
// in shiur titles or returned by Hebcal). Normalized at build time, so case,
// apostrophes (straight ' or curly ’) and spaces don't matter here.
const VARIANTS = {
  Bereishis: ["bereshis", "beresheet", "bereshit", "breishis"],
  Noach: ["noah"],
  "Lech Lecha": ["lech lcha", "lech-lecha"],
  Vayeira: ["vayera", "vyera"],
  "Chayei Sarah": ["chayei sara", "chayai soroh", "chayyei soroh", "chayei soroh", "chayyei sarah", "chayei soro"],
  Toldos: ["toledot", "toldot"],
  Vayeitzei: ["vayetzei", "vayetze", "vayeitze", "vayeytzei"],
  Vayishlach: ["vayishlah"],
  Vayeishev: ["vayeshev"],
  Mikeitz: ["miketz"],
  Vayigash: [],
  Vayechi: ["vaychi"],
  "Va'eira": ["vaeira", "vaera"],
  Bo: [],
  Beshalach: ["bshalach"],
  Yisro: ["yitro", "yisroe"],
  Mishpatim: [],
  Terumah: ["trumah", "teruma"],
  Tetzaveh: ["tetzave"],
  "Ki Sisa": ["ki tisa", "ki sissa"],
  Vayakhel: ["vayakheil"],
  Pekudei: ["pikudei"],
  Vayikra: [],
  Tzav: [],
  Shemini: ["shmini"],
  Tazria: [],
  Metzora: ["metzoroh", "metzorah"],
  "Acharei Mos": ["acharei mot", "achrei mos", "achrei mot", "acharei moss"],
  Kedoshim: [],
  Emor: [],
  Behar: [],
  Bechukosai: ["bechukotai", "bchukosai", "bechukoisai"],
  Bamidbar: [],
  Nasso: ["naso"],
  "Beha'aloscha": ["behaaloscha", "beha'alotcha", "behaalotcha", "beha'alosecha", "beha'aloshcha", "behaalosecha", "beha'alosocha"],
  Shelach: ["shlach", "shelach lecha", "shlach lecha"],
  Korach: [],
  Chukas: ["chukat"],
  Balak: [],
  Pinchas: ["pinchos"],
  Mattos: ["mattot", "matos", "matot"],
  Masei: ["massei", "maasei", "masai", "masey"],
  Devarim: [],
  "Va'eschanan": ["vaeschanan", "vaetchanan", "voeschanan"],
  Eikev: ["ekev"],
  "Re'eh": ["reeh"],
  Shoftim: [],
  "Ki Seitzei": ["ki tetze", "ki teitzei", "ki setzei", "ki teitze"],
  "Ki Savo": ["ki tavo", "ki sovo"],
  Nitzavim: ["nitzovim", "netzavim"],
  Vayeilech: ["vayelech"],
  "Ha'azinu": ["haazinu"],
  "V'Zos HaBracha": ["vzos habracha", "vezot haberachah", "vzos habrocho", "vezos haberacha"],
};

/**
 * Normalize a parsha string to a comparison key: lowercase, drop all
 * apostrophe-likes (straight, curly, backtick), keep letters only. So
 * "Beha'aloscha", "Beha’aloscha" and "behaaloscha" all collapse to the same
 * key, while genuinely different spellings (t vs s, extra vowels) stay distinct
 * and are unified through the explicit VARIANTS map instead.
 */
export function normKey(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[‘’ʼ`'´]/g, "")
    .replace(/[^a-z]/g, "");
}

const CANONICAL_TO_SEFER = {};
const VARIANT_TO_CANONICAL = {};
for (const [sefer, list] of Object.entries(PARSHIYOS_BY_SEFER)) {
  for (const name of list) {
    CANONICAL_TO_SEFER[name] = sefer;
    VARIANT_TO_CANONICAL[normKey(name)] = name;
  }
}
for (const [canonical, alts] of Object.entries(VARIANTS)) {
  for (const alt of alts) VARIANT_TO_CANONICAL[normKey(alt)] = canonical;
}

/**
 * Resolve any spelling to its canonical parsha name.
 * Handles hyphenated single parshiyos ("Lech-Lecha" -> "Lech Lecha") and double
 * parshiyos ("Behar-Bechukosai" -> "Behar - Bechukosai"). Unknown spellings
 * fall back to title-case so two identical unknowns still match each other.
 */
export function canonicalParsha(name) {
  const trimmed = String(name || "").trim();
  if (!trimmed) return "";
  // Try the whole string first — catches hyphenated *single* parshiyos.
  const whole = VARIANT_TO_CANONICAL[normKey(trimmed)];
  if (whole) return whole;
  // Otherwise treat a hyphen as a double-parsha separator.
  if (/[-–]/.test(trimmed)) {
    return trimmed
      .split(/\s*[-–]\s*/)
      .map((part) => canonicalParsha(part))
      .filter(Boolean)
      .join(" - ");
  }
  return trimmed.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Split a parsha name into its canonical constituent parts (1 for single, 2 for double). */
export function splitParshaNames(name) {
  return canonicalParsha(name)
    .split(/\s+-\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Comparison keys for every constituent of a (possibly double) parsha name. */
export function parshaKeys(name) {
  return splitParshaNames(name).map(normKey).filter(Boolean);
}

/** Sefer a parsha belongs to (uses the first recognized constituent). */
export function lookupSefer(name) {
  for (const part of splitParshaNames(name)) {
    if (CANONICAL_TO_SEFER[part]) return CANONICAL_TO_SEFER[part];
  }
  return undefined;
}

// Pull the parsha out of a shiur title: "Parshas Vaera - Hashem's army" -> "Vaera",
// "Parshas Behar- Bechukosai, ..." -> "Behar- Bechukosai" (a tight hyphen stays,
// a spaced " - " ends the parsha and starts the topic). Also stops on "/" so
// "Parshas Tzav /Shabbos hagadol" yields "Tzav".
const TITLE_RE = /^\s*parsh(?:as|us|at|ah|a)?\s+([a-z‘’'`´\- ]+?)(?:[,.;:\/]|\s+[-–]|\s+\d|$)/i;

// The Arba Parshiyos (Shekalim, Zachor, Parah, Hachodesh) are special maftir
// readings, not weekly sedras — each is read on a regular parsha week. A title
// like "Parshas Hachodesh - Vayakhel ..." names the real weekly parsha after
// the dash, so resolve to that instead of the special-reading name.
const SPECIAL_THEN_PARSHA_RE = /^\s*parsh(?:as|us|at|ah|a)?\s+(?:ha[‘’'`´]?chodesh|shekalim|shkalim|zachor|zochor|parah|poroh)\s*[-–]\s*([a-z‘’'`´ ]+?)(?:[,.;:\/]|\s+[-–]|\s+\d|$)/i;

/** Extract the raw parsha string from a shiur title, or null if it isn't a parsha shiur. */
export function extractParshaFromTitle(title) {
  const s = String(title || "");
  const special = s.match(SPECIAL_THEN_PARSHA_RE);
  if (special && special[1].trim()) return special[1].trim();
  const m = s.match(TITLE_RE);
  if (!m) return null;
  const raw = m[1].trim();
  return raw || null;
}

/**
 * Does this shiur belong to the given parsha? Spelling/apostrophe tolerant, and
 * double-parsha aware in BOTH directions (a "Behar" week matches a
 * "Behar-Bechukosai" shiur, and vice-versa). Checks the categorized subLevel2
 * first, then falls back to parsing the title.
 */
export function shiurBelongsToParsha(shiur, parshaName) {
  const target = new Set(parshaKeys(parshaName));
  if (target.size === 0) return false;
  if (shiur && shiur.subLevel2) {
    for (const k of parshaKeys(shiur.subLevel2)) if (target.has(k)) return true;
  }
  const fromTitle = extractParshaFromTitle(shiur && shiur.title);
  if (fromTitle) {
    // The captured token usually IS the parsha, but when a title has no
    // separator ("Parshas Korach vs Moshe") trailing words leak in. Try the
    // whole token plus its first-two and first-one word prefixes — parsha names
    // are 1–2 words, so a leading prefix still resolves.
    const words = fromTitle.split(/\s+/);
    const candidates = [fromTitle];
    if (words.length > 2) candidates.push(words.slice(0, 2).join(" "));
    if (words.length > 1) candidates.push(words[0]);
    for (const cand of candidates) {
      for (const k of parshaKeys(cand)) if (target.has(k)) return true;
    }
  }
  return false;
}

/** All known alternate spellings for a canonical name (kept for backward compatibility). */
export function getParshaVariants(canonicalName) {
  const out = [canonicalName.toLowerCase()];
  const alts = VARIANTS[canonicalName];
  if (alts) for (const a of alts) out.push(a.toLowerCase());
  return Array.from(new Set(out));
}
