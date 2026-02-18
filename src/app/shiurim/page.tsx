import { fetchAllShiurim } from "@/lib/shiurim";
import { fetchCurrentParsha } from "@/lib/parsha";
import ShiurimClient from "@/components/shiurim/ShiurimClient";
import type { Metadata } from "next";

export const revalidate = 3600; // Re-fetch every hour

export const metadata: Metadata = {
  title: "Shiurim | Torah Lectures by Rav Dovid Steinhauer | Kahal Beis Tefilla",
  description:
    "Listen to Torah shiurim from Rav Dovid Steinhauer covering Parsha, Machshava, Halacha, Navi, Mesilas Yesharim, and more. Thousands of recorded lectures available.",
};

export default async function ShiurimPage() {
  const [shiurim, currentParsha] = await Promise.all([
    fetchAllShiurim(),
    fetchCurrentParsha(),
  ]);

  return (
    <ShiurimClient
      initialShiurim={shiurim}
      currentParsha={currentParsha}
    />
  );
}
