/**
 * Fetch this week's parsha from the Hebcal API (Jerusalem timezone).
 * Returns the parsha name (e.g., "Terumah") and Hebrew name.
 */
export async function fetchCurrentParsha(): Promise<{
  name: string;
  hebrew: string;
} | null> {
  try {
    const res = await fetch(
      "https://www.hebcal.com/shabbat?cfg=json&geonameid=281184&M=on",
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
    const name = parashat.title.replace(/^Parashat\s+/, "");
    const hebrew = parashat.hebrew?.replace(/^פרשת\s+/, "") || "";

    return { name, hebrew };
  } catch {
    return null;
  }
}
