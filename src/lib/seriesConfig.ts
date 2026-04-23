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
  return {};
}

/** Map Yamim Tovim / topic categories from a title (used by Machshava + standalone Yom Tov) */
export function classifyYomTovTopic(lower: string): string | null {
  if (
    /\brosh\s+hashana/i.test(lower) ||
    /\bshofar/i.test(lower) ||
    /\btekiy/i.test(lower) ||
    /\bmalchuyos/i.test(lower) ||
    /\bzichronos/i.test(lower) ||
    /\byamim\s+nora/i.test(lower) ||
    /\bmelech\s+hakadosh/i.test(lower) ||
    /\bakeid[ao]/i.test(lower)
  )
    return "Rosh Hashana";
  if (
    /\byom\s+kippur/i.test(lower) ||
    /\bneila/i.test(lower) ||
    /\bkoh[ae]in\s+gadol/i.test(lower) ||
    /\bv[iy]du[iy]\b/i.test(lower) ||
    /\bazazel\b/i.test(lower) ||
    /\bkol\s+nidrei/i.test(lower)
  )
    return "Yom Kippur";
  if (
    /\bsukk?os\b/i.test(lower) ||
    /\bhoshana\s+rabba/i.test(lower) ||
    /\barava\b/i.test(lower) ||
    /\bchol\s+hamoed/i.test(lower) ||
    /\blulav/i.test(lower) ||
    /\b[ee][st]rog/i.test(lower) ||
    /\barba\s+minim/i.test(lower) ||
    /\bushpizin/i.test(lower) ||
    /\bzman\s+simchaseinu/i.test(lower)
  )
    return "Sukkos";
  if (/\bsimchas\s+torah/i.test(lower) || /\bhakafos/i.test(lower) || /\bhatkafos/i.test(lower))
    return "Simchas Torah";
  if (/\bkoheles/i.test(lower)) return "Sukkos";
  if (/\bchanuk/i.test(lower) || /\bchannuk/i.test(lower)) return "Chanuka";
  if (/\bpurim/i.test(lower) || /\bmegillas?\s+esther/i.test(lower) || /\bachashverosh/i.test(lower))
    return "Purim";
  if (
    /\bpesach\b/i.test(lower) ||
    /\bchametz\b/i.test(lower) ||
    /\bhagad/i.test(lower) ||
    /\bseder\s+(?:night|meal)/i.test(lower) ||
    /leil\s+haseder/i.test(lower) ||
    /(?:leading|making)\s+the\s+seder/i.test(lower) ||
    /\bmatz[ao]h?s?\b/i.test(lower) ||
    /\bafikoma?[ne]\b/i.test(lower) ||
    /\bmaror\b/i.test(lower) ||
    /\bkarpas\b/i.test(lower) ||
    /korban\s+pesach/i.test(lower) ||
    /yetzias\s+miz?rayim/i.test(lower) ||
    /\bpharoh\b|\bpharaoh\b/i.test(lower) ||
    /shabbos\s+hagadol/i.test(lower) ||
    /shv?e?i['']?i\s+shel\s+pesach/i.test(lower)
  )
    return "Pesach";
  if (
    /\bshavuos/i.test(lower) ||
    /\bsinai/i.test(lower) ||
    /\bnaaseh/i.test(lower) ||
    /\bmatan\s+torah/i.test(lower) ||
    /\bkabalas\s+ha?torah/i.test(lower) ||
    /\baseres\s+hadibros/i.test(lower) ||
    /\bmegillas?\s+(?:rus|ruth)/i.test(lower)
  )
    return "Shavuos";
  if (
    /\btisha\s+b['']?av/i.test(lower) ||
    /\bseventeenth\s+of\s+tammuz/i.test(lower) ||
    /\bchurban\b/i.test(lower) ||
    /\bnine\s+days\b/i.test(lower) ||
    /\bthree\s+weeks\b/i.test(lower) ||
    /\bbein\s+ha[\-\s]?metzarim/i.test(lower)
  )
    return "Tisha B'Av";
  if (/\bteves\b/i.test(lower) || /10th of teves/i.test(lower) || /asara b'teves/i.test(lower) || /tenth of teves/i.test(lower))
    return "Asara B'Teves";
  if (/\bselichos/i.test(lower) || /\bkinnos/i.test(lower)) return "Selichos";
  if (/\bteshuva/i.test(lower) || /\bshovavim/i.test(lower)) return "Teshuva";
  if (
    /\blag\s+b[ao]?m?omer/i.test(lower) ||
    /\bomer\b/i.test(lower) ||
    /\bsefiras?\b/i.test(lower)
  )
    return "Sefirah & Lag BaOmer";
  if (/\brosh\s+chodesh/i.test(lower)) return "Rosh Chodesh";
  if (/\bell?ul\b/i.test(lower)) return "Elul";
  if (/shabbos\s+shuva/i.test(lower)) return "Teshuva";
  return null;
}

/** Map Machshava titles to Yom Tov / topic categories */
function extractMachshavaTopic(title: string): { section?: string; detail?: string } {
  const cleaned = title.replace(/^Machshava\s+series[\s:,\-–]+\s*/i, "").trim();
  const lower = cleaned.toLowerCase();

  const topic = classifyYomTovTopic(lower);
  if (topic) return { section: topic };

  return { section: "General Machshava" };
}

/** Extract Yom Tov topic from standalone titles (Rosh Hashana -, Pesach -, etc.) */
function extractYomTovSection(title: string): { section?: string; detail?: string } {
  const lower = title.toLowerCase();
  const topic = classifyYomTovTopic(lower);
  return topic ? { section: topic } : { section: "General" };
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
  // ========== NAVI (in Tanach order) ==========
  {
    slug: "yehoshua",
    name: "Yehoshua",
    description: "The Book of Yehoshua — Klal Yisrael's entry into Eretz Yisrael and the conquest.",
    patterns: [/^Yehoshua/i],
    group: "navi",
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Yehoshua[,:]?\s*/i),
    sortDefault: "oldest",
    displayOrder: 1,
  },
  {
    slug: "shoftim",
    name: "Shoftim",
    description: "The Book of Shoftim — the era of the Judges and Klal Yisrael's early struggles in Eretz Yisrael.",
    patterns: [/^Shoftim[\s,:\-–]/i],
    group: "navi",
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Shoftim[,:\-–]?\s*/i),
    sortDefault: "oldest",
    displayOrder: 2,
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
    displayOrder: 3,
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
    displayOrder: 4,
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
    patterns: [/^[Hh][Ii]l?chos\s+Yesodei\s+HaTorah/i],
    group: "halacha",
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^[Hh][Ii]l?chos\s+Yesodei\s+HaTorah[,:]?\s*/i),
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
    patterns: [/^Halacha\s+series/i, /^Halachos\s/i, /^Halacha\s+Tefilla/i, /^[Kk]ashrus/i],
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
    patterns: [/^Mesill?as\s+[Yy]esh[ao]?rim/i],
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
    patterns: [/^Shir\s+[Hh]a?[Ss]hir/i],
    group: null,
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Shir\s+[Hh]a?[Ss]hir[im]*[ms,:]?\s*/i),
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

  // Yamim Tovim — ALL Yom Tov content (standalone + Machshava-prefixed)
  // MUST come before Machshava so "Machshava series: Rosh Hashana..." goes here
  {
    slug: "yamim-tovim",
    name: "Yamim Tovim",
    description: "Shiurim on the Jewish holidays — Rosh Hashana, Yom Kippur, Sukkos, Chanuka, Purim, Pesach, Shavuos, and more.",
    patterns: [
      // Standalone Yom Tov titles
      /^Rosh\s+Hashana/i,
      /^Yom\s+Kippur/i,
      /^Simchas\s+Torah/i,
      /^Chanukk?a/i,
      /^Purim/i,
      /^Pesach/i,
      /^Selichos/i,
      /^Hoshana\s+Rabba/i,
      /^Shabbos\s+(?:Shuva|Hagadol|Chol)/i,
      /^Shv?e?i'?i\s+shel\s+/i, /^Shevi'i\s+shel\s+/i,
      /^[Ee]ll?ul/i,
      /^Teshuva[\s\-–:]/i,
      /^Drasha\s+before\s+neila/i,
      // Machshava Yom Tov titles (capture before generic ^Machshava)
      /^Machshava\s+[\s\S]*?(?:rosh\s+hashana|shofar|tekiy|malchuyos|zichronos|yom\s+kippur|neila|kohain\s+gadol|sukk?os|hoshana|arava|simchas\s+torah|hakafos|hatkafos|koheles|chanuk|channuk|purim|pesach|seder\b|hagad|matza|egypt|pharoh|shavuos|sinai|naaseh|tisha|tammuz|teves|selichos|kinnos|teshuva|shovavim|lag\s+b|omer|rosh\s+chodesh|ellul|elul|shabbos\s+shuva|shabbos\s+hagadol)/i,
    ],
    group: null,
    navType: "topic",
    extractNav: extractYomTovSection,
  },

  // Machshava — non-Yom-Tov topics only (Yom Tov captured above)
  {
    slug: "machshava",
    name: "Machshava",
    description: "Jewish thought and philosophy — hashkafa, mussar, and general Torah topics.",
    patterns: [/^Machshava/i, /^Themes\s+in\s+Torah/i, /^Topics\s+in\s+Torah/i],
    group: null,
    navType: "topic",
    extractNav: extractMachshavaTopic,
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
    patterns: [/^Ruac?h?\s+[Cc]h?a[yi]+m/i, /^Ruach\s+[Hh]achayim/i],
    group: null,
    navType: "perek",
    extractNav: (t) => extractPerek(t, /^Ruac?h?\s+[CHch]h?a[yi]+m[,:]?\s*/i),
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
    patterns: [/^T[a',]+m[ae]i\s+[Hh]amitzvos/i],
    group: null,
    navType: "sequential",
  },

  // Learning
  {
    slug: "learning",
    name: "Learning",
    description: "Torah study techniques, vaadim on how to learn, and developing skills in Gemara, mussar, and iyyun.",
    patterns: [/^[Ll]earning/i, /^Roaring\s+to\s+learn/i, /^Siyum/i],
    group: null,
    navType: "sequential",
    sortDefault: "oldest",
  },

  // Chizzuk
  {
    slug: "chizzuk",
    name: "Chizzuk",
    description: "Words of encouragement and inspiration — strengthening our avodas Hashem.",
    patterns: [/^[Cc]hizzuk/i, /^[Cc]hazak/i],
    group: null,
    navType: "sequential",
  },

  {
    slug: "chinuch",
    name: "Chinuch",
    description: "Torah perspectives on education and raising children.",
    patterns: [/^Chinuch/i, /^Imparting\s+Jewish/i, /\bchinuch$/i],
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
    patterns: [/^T[ae]fill?ah?\s+va'?ad/i, /^T[ae]fill?ah?\s+series/i, /^T[ae]fill?ah?\s*[-–:]/i, /^T[ae]fill?ah?\s+of\s/i, /^T[ae]fill?ah$/i, /^Thoughts\s+on.*[Tt]efill/i],
    group: null,
    navType: "sequential",
    sortDefault: "oldest",
  },
  {
    slug: "moshiach",
    name: "Moshiach",
    description: "Understanding the coming of Moshiach and the final redemption.",
    patterns: [/^Moshiach/i, /Gog\s*U?magog/i, /^Travels\s+with\s+Eliyahu/i],
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

  // Kollel
  {
    slug: "kollel",
    name: "Kollel Series",
    description: "Special shiurim from the KBT Kollel on various Torah topics.",
    patterns: [/^Kollel/i],
    group: null,
    navType: "sequential",
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

  // Catch-all — MUST be last. Any new shiur that doesn't match above lands here.
  {
    slug: "other",
    name: "Other Shiurim",
    description: "Shiurim on various Torah topics.",
    patterns: [/.+/],
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
