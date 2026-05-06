import { canonicalParsha } from "./categoryConfig";

/**
 * Fetch this week's parsha from the Hebcal API (Jerusalem timezone).
 * Returns the parsha name (e.g., "Terumah") and Hebrew name.
 * The English name is normalized to our canonical transliteration
 * (e.g., Hebcal's "Ki Tisa" → our "Ki Sisa").
 */
export async function fetchCurrentParsha(): Promise<{
  name: string;
  hebrew: string;
} | null> {
  try {
    // _w is the upcoming Saturday's date — Hebcal ignores unknown query params,
    // but Next.js keys its fetch cache by URL, so a weekly-rotating param prevents
    // ISR from serving last week's parsha across the Shabbos boundary.
    const now = new Date();
    const offset = now.getUTCDay() === 6 ? 0 : (6 - now.getUTCDay());
    const sat = new Date(now);
    sat.setUTCDate(sat.getUTCDate() + offset);
    const weekKey = sat.toISOString().slice(0, 10);
    const res = await fetch(
      `https://www.hebcal.com/shabbat?cfg=json&geonameid=281184&M=on&_w=${weekKey}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const parashat = data.items?.find(
      (item: { category: string }) => item.category === "parashat"
    );

    if (!parashat?.title) return null;

    // Extract parsha name: "Parashat Terumah" → "Terumah"
    // Handle double parshiyos: "Parashat Vayakhel-Pekudei" → "Vayakhel-Pekudei"
    const rawName = parashat.title.replace(/^Parashat\s+/, "");
    const name = canonicalParsha(rawName);
    const hebrew = parashat.hebrew?.replace(/^פרשת\s+/, "") || "";

    return { name, hebrew };
  } catch {
    return null;
  }
}

