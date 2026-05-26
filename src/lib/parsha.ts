import { canonicalParsha } from "./categoryConfig";

// Kahal Beis Tefilla is in Ramat Eshkol, Jerusalem — so the parsha schedule
// follows Eretz Yisrael (which diverges from the Diaspora for stretches after a
// festival). geonameid 281184 = Jerusalem; Hebcal returns the Israel leyning.
const JERUSALEM_GEONAMEID = 281184;
const JERUSALEM_TZ = "Asia/Jerusalem";

interface HebcalItem {
  category: string;
  title?: string;
  hebrew?: string;
  date?: string; // ISO, with offset for timed items (candles/havdalah)
}

/** YYYY-MM-DD for a Date as seen in Jerusalem. */
function jerusalemYMD(d: Date): { y: number; m: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: JERUSALEM_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const [y, m, day] = parts.split("-").map(Number);
  return { y, m, day };
}

/** Day of week in Jerusalem (0=Sun … 6=Sat). */
function jerusalemDow(d: Date): number {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: JERUSALEM_TZ,
    weekday: "short",
  }).format(d);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
}

/** Add `days` to a {y,m,day} date and return the new {y,m,day}. */
function addDays(date: { y: number; m: number; day: number }, days: number) {
  const t = Date.UTC(date.y, date.m - 1, date.day) + days * 86400000;
  const d = new Date(t);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, day: d.getUTCDate() };
}

async function fetchShabbat(
  sat: { y: number; m: number; day: number },
  signal: AbortSignal,
): Promise<HebcalItem[] | null> {
  // M=on → Havdalah is set to 72 minutes after sunset (the rollover moment).
  const url =
    `https://www.hebcal.com/shabbat?cfg=json&geonameid=${JERUSALEM_GEONAMEID}` +
    `&M=on&gy=${sat.y}&gm=${sat.m}&gd=${sat.day}`;
  const res = await fetch(url, { next: { revalidate: 1800 }, signal });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.items as HebcalItem[]) || null;
}

/**
 * Fetch the parsha to show as "This Week's Parsha", per the shul's rule:
 *
 *   The parsha read on Shabbos stays current until Motzei Shabbos. 72 minutes
 *   after sunset (Havdalah) the display rolls over to the NEXT parsha.
 *
 * So Sun–Fri (and Shabbos day) it shows the parsha of the upcoming Shabbos; on
 * Motzei Shabbos it advances. We query Hebcal's Israel leyning each week rather
 * than counting, so weeks where a Yom Tov falls on Shabbos (no regular parsha)
 * are handled — we simply skip ahead to the next Shabbos that has a parsha.
 *
 * Returns the canonical parsha name (e.g. "Beha'aloscha") and its Hebrew, or
 * null on failure (callers degrade gracefully).
 */
export async function fetchCurrentParsha(): Promise<{
  name: string;
  hebrew: string;
} | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);
  try {
    const now = new Date();
    const today = jerusalemYMD(now);
    const dow = jerusalemDow(now);
    const daysUntilSat = (6 - dow + 7) % 7; // 0 if today is Shabbos
    let target = addDays(today, daysUntilSat);

    // Walk forward until we land on a Shabbos that (a) has a regular parsha and
    // (b) hasn't already rolled over (its Havdalah is still in the future).
    for (let i = 0; i < 4; i++) {
      const items = await fetchShabbat(target, controller.signal);
      if (!items) return null;

      const parashat = items.find((it) => it.category === "parashat" && it.title);
      const havdalah = items.find((it) => it.category === "havdalah" && it.date);
      const rolledOver = havdalah ? now.getTime() >= new Date(havdalah.date!).getTime() : false;

      if (parashat && !rolledOver) {
        const rawName = parashat
          .title!.replace(/^Parashat\s+/i, "")
          .replace(/[‘’]/g, "'"); // curly → straight apostrophe
        return {
          name: canonicalParsha(rawName),
          hebrew: parashat.hebrew?.replace(/^פרשת\s+/, "") || "",
        };
      }
      // Either a Yom Tov Shabbos (no parsha) or we're past Havdalah → next week.
      target = addDays(target, 7);
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
