import type { SeriesDef } from "./types";

// --- Helpers for extracting navigation info from titles ---

function extractPerek(title: string, prefix: RegExp): { section?: string; detail?: string } {
  const cleaned = title.replace(prefix, "").trim();
  // Match "perek 2", "4.16", "2,", "2 " at start
  const perekMatch = cleaned.match(/^(?:perek\s*)?(\d+)/i);
  return perekMatch ? { section: `Perek ${perekMatch[1]}` } : {};
}

function extractHalachaTopic(title: string): { section?: string; detail?: string } {
  // "Halacha series - Shabbos, kiddush" → section="Kiddush"
  const match = title.match(/Halacha\s+series\s*[-–:]\s*Shabbos\s*[,;:]\s*(.+)/i);
  if (match) return { section: match[1].trim() };
  // Fallback: just "Halacha series - Shabbos"
  return {};
}

// --- Landing page group labels ---

export const SERIES_GROUPS = {
  halacha: { label: "Halacha", description: "Jewish Law" },
  navi: { label: "Navi", description: "Prophets" },
} as const;

// --- All series definitions ---
// ORDER MATTERS: more specific patterns must come before general ones.
// e.g., "hilchos-shabbos" before "halacha-series"

export const SERIES: SeriesDef[] = [
  // ========== NAVI ==========
  {
    slug: "yehoshua",
    name: "Yehoshua",
    description: "The Book of Yehoshua — Klal Yisrael's entry into Eretz Yisrael and the conquest.",
    patterns: [/^Yehoshua/i],
    group: "navi",
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Yehoshua[,:]?\s*/i),
    sortDefault: "oldest",
  },
  {
    slug: "shoftim",
    name: "Shoftim",
    description: "The Book of Shoftim — the era of the Judges and Klal Yisrael's early struggles in Eretz Yisrael.",
    patterns: [/^Shoftim[\s,]/i],
    group: "navi",
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Shoftim[,:]?\s*/i),
    sortDefault: "oldest",
  },
  {
    slug: "shmuel",
    name: "Shmuel",
    description: "Sefer Shmuel — from the birth of Shmuel HaNavi through the reign of Dovid HaMelech.",
    patterns: [/^Shmuel/i],
    group: "navi",
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Shmuel\s*(?:II?)?[,:]?\s*/i),
    sortDefault: "oldest",
  },
  {
    slug: "melachim",
    name: "Melachim",
    description: "Sefer Melachim — from Shlomo HaMelech through the divided kingdom.",
    patterns: [/^Melachim/i],
    group: "navi",
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Melachim\s*(?:I+)?[,:]?\s*/i),
    sortDefault: "oldest",
  },

  // ========== HALACHA ==========
  {
    slug: "hilchos-teshuva",
    name: "Hilchos Teshuva",
    description: "The Rambam's Laws of Repentance — understanding the process and philosophy of teshuva.",
    patterns: [/^[Hh][Ii]lchos\s+[Tt]eshuva/i],
    group: "halacha",
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^[Hh][Ii]lchos\s+[Tt]eshuva[,:]?\s*/i),
    sortDefault: "oldest",
  },
  {
    slug: "hilchos-yesodei-hatorah",
    name: "Hilchos Yesodei HaTorah",
    description: "Foundations of the Torah — the Rambam on the fundamentals of faith and knowledge of Hashem.",
    patterns: [/^[Hh][Ii]lchos\s+Yesodei\s+HaTorah/i],
    group: "halacha",
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^[Hh][Ii]lchos\s+Yesodei\s+HaTorah[,:]?\s*/i),
    sortDefault: "oldest",
  },
  {
    slug: "hilchos-talmud-torah",
    name: "Hilchos Talmud Torah",
    description: "The Rambam's Laws of Torah Study — obligations, methods, and priorities in learning.",
    patterns: [/^[Hh][Ii]lchos\s+[Tt]almud\s+Torah/i],
    group: "halacha",
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^[Hh][Ii]lchos\s+[Tt]almud\s+Torah[,:]?\s*/i),
    sortDefault: "oldest",
  },
  {
    slug: "hilchos-deos",
    name: "Hilchos Deos",
    description: "The Rambam's Laws of Character Traits — cultivating proper middos and ethical conduct.",
    patterns: [/^[Hh][Ii]lchos\s+[Dd]e[o']?[eo]s/i],
    group: "halacha",
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^[Hh][Ii]lchos\s+[Dd]e[o']?[eo]s[,:]?\s*/i),
    sortDefault: "oldest",
  },
  {
    slug: "hilchos-shabbos",
    name: "Hilchos Shabbos",
    description: "A comprehensive study of the laws of Shabbos — from the Halacha Series.",
    patterns: [/^Halacha\s+series\s*[-–:]\s*Shabbos/i],
    group: "halacha",
    navType: "topic",
    extractNav: extractHalachaTopic,
  },
  {
    slug: "halacha-series",
    name: "Halacha Series",
    description: "Practical halacha topics including Tefilla, Yom Tov, Kashrus, and seasonal halachos.",
    patterns: [/^Halacha\s+series/i, /^Halachos\s/i],
    group: "halacha",
    navType: "topic",
    extractNav: (t) => {
      const match = t.match(/Halacha\s+series\s*[-–:]\s*(.+?)(?:\s*[-–,]|$)/i);
      return match ? { section: match[1].trim() } : {};
    },
  },

  // ========== UNGROUPED SERIES ==========

  // Seforim
  {
    slug: "kuzari",
    name: "Kuzari",
    description: "An in-depth study of Sefer HaKuzari by Rabbi Yehuda HaLevi — exploring the philosophical foundations of Judaism.",
    patterns: [/^Kuzari/i],
    group: null,
    navType: "sequential",
    sortDefault: "oldest",
  },
  {
    slug: "mesilas-yesharim",
    name: "Mesilas Yesharim",
    description: "Path of the Just by Rav Moshe Chaim Luzzatto — a guide to spiritual growth and character refinement.",
    patterns: [/^Mesill?as\s+[Yy]esho?rim/i],
    group: null,
    navType: "sequential",
    sortDefault: "oldest",
  },
  {
    slug: "nefesh-hachaim",
    name: "Nefesh HaChaim",
    description: "Rav Chaim Volozhiner's masterwork on the soul, Torah study, and man's relationship with Hashem.",
    patterns: [/^Nefesh\s+[Hh]a?[Cc]h?ayim/i],
    group: null,
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Nefesh\s+[Hh]a?[Cc]h?ayim[,:]?\s*/i),
    sortDefault: "oldest",
  },
  {
    slug: "shir-hashirim",
    name: "Shir Hashirim",
    description: "Song of Songs — uncovering the profound allegory of Hashem's love for Klal Yisrael.",
    patterns: [/^Shir\s+[Hh]a?[Ss]hirim/i],
    group: null,
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Shir\s+[Hh]a?[Ss]hirim[ms,:]?\s*/i),
    sortDefault: "oldest",
  },
  {
    slug: "shemone-perakim",
    name: "Shemoneh Perakim",
    description: "The Rambam's Eight Chapters — his introduction to Pirkei Avos on the human soul and ethics.",
    patterns: [/^Shemon[ea]\s+[Pp]erakim/i],
    group: null,
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Shemon[ea]\s+[Pp]erakim[,:]?\s*/i),
    sortDefault: "oldest",
  },

  // Machshava & Mussar
  {
    slug: "machshava",
    name: "Machshava",
    description: "Jewish thought and philosophy — exploring hashkafa topics in depth.",
    patterns: [/^Machshava/i],
    group: null,
    navType: "sequential",
  },
  {
    slug: "pirkei-avos",
    name: "Pirkei Avos with the Maharal",
    description: "Ethics of the Fathers illuminated through the Maharal's Derech Chaim.",
    patterns: [/^Pirkei\s+[Aa]vo[st]/i],
    group: null,
    navType: "sequential",
    sortDefault: "oldest",
  },
  {
    slug: "ruach-chaim",
    name: "Ruach Chaim",
    description: "Rav Chaim Volozhiner's commentary on Pirkei Avos — deep insights into Torah and avodas Hashem.",
    patterns: [/^Ruach?\s+[Cc]h?ayim/i, /^Ruach\s+[Hh]achayim/i, /^Ruach\s+[Cc]haim/i],
    group: null,
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Ruach?\s+[CHch]h?a[yi]+m[,:]?\s*/i),
    sortDefault: "oldest",
  },
  {
    slug: "taryag-mitzvos",
    name: "Taryag Mitzva Project",
    description: "A 100-day journey through the 613 mitzvos — understanding their structure and significance.",
    patterns: [/^Taryag/i],
    group: null,
    navType: "sequential",
    sortDefault: "oldest",
  },
  {
    slug: "taamei-hamitzvos",
    name: "Taamei HaMitzvos",
    description: "Exploring the reasons behind the mitzvos — why Hashem commanded us.",
    patterns: [/^T[a']+m[ae]i\s+[Hh]amitzvos/i],
    group: null,
    navType: "sequential",
  },
  {
    slug: "chinuch",
    name: "Chinuch",
    description: "Torah perspectives on education and raising children.",
    patterns: [/^Chinuch/i],
    group: null,
    navType: "sequential",
  },
  {
    slug: "emunah",
    name: "Emunah",
    description: "Strengthening faith and belief in Hashem.",
    patterns: [/^Emunah?[\s,]/i, /^Emunah$/i],
    group: null,
    navType: "sequential",
  },
  {
    slug: "tefilla",
    name: "Tefilla",
    description: "Understanding the structure, meaning, and power of prayer.",
    patterns: [/^Tefill?ah?\s+vaad/i, /^Tefill?ah?\s+series/i, /^Tefill?ah?\s*[-–:]/i, /^Tefill?ah$/i],
    group: null,
    navType: "sequential",
    sortDefault: "oldest",
  },
  {
    slug: "moshiach",
    name: "Moshiach",
    description: "Understanding the coming of Moshiach and the final redemption.",
    patterns: [/^Moshiach/i],
    group: null,
    navType: "sequential",
    sortDefault: "oldest",
  },

  // Parsha
  {
    slug: "parsha",
    name: "Parshas HaShavua",
    description: "Insights on the weekly Torah portion from Rav Dovid Steinhauer.",
    patterns: [/^Parshas?\s/i],
    group: null,
    navType: "parsha",
    extractNav: (t) => {
      const match = t.match(/^Parshas?\s+([A-Za-z'`\- ]+?)(?:[,.:;]|\s+[-–]|\s+\d|$)/i);
      return match ? { section: match[1].trim() } : {};
    },
  },

  // Special
  {
    slug: "qa",
    name: "Q & A",
    description: "Listener questions answered on a wide range of Torah topics.",
    patterns: [/^Q\s*[&]\s*A/i],
    group: null,
    navType: "sequential",
  },
];

// --- Lookup helpers ---

export function getSeriesBySlug(slug: string): SeriesDef | undefined {
  return SERIES.find((s) => s.slug === slug);
}

export function getAllSlugs(): string[] {
  return SERIES.map((s) => s.slug);
}

/**
 * Match a title to a series. Returns the first matching series, or undefined.
 * Order of SERIES array determines priority.
 */
export function matchTitleToSeries(title: string): SeriesDef | undefined {
  for (const series of SERIES) {
    for (const pattern of series.patterns) {
      if (pattern.test(title)) {
        return series;
      }
    }
  }
  return undefined;
}
