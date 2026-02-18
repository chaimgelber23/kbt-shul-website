import { getLandingData } from "@/lib/seriesData";
import { fetchAllShiurim } from "@/lib/shiurim";
import { fetchCurrentParsha } from "@/lib/parsha";
import ShiurimLanding from "@/components/shiurim/ShiurimLanding";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shiurim | Torah Lectures by Rav Dovid Steinhauer | Kahal Beis Tefilla",
  description:
    "Listen to Torah shiurim from Rav Dovid Steinhauer covering Parsha, Machshava, Halacha, Navi, Mesilas Yesharim, and more. Thousands of recorded lectures available.",
};

export default async function ShiurimPage() {
  const [landingData, allShiurim, currentParsha] = await Promise.all([
    getLandingData(),
    fetchAllShiurim(),
    fetchCurrentParsha(),
  ]);

  return (
    <ShiurimLanding
      ungrouped={landingData.ungrouped}
      groups={landingData.groups}
      totalCount={landingData.totalCount}
      latestShiurim={landingData.latestShiurim}
      allShiurim={allShiurim}
      currentParsha={currentParsha}
    />
  );
}
