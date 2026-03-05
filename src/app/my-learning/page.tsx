import type { Metadata } from "next";
import MyLearningClient from "@/components/shiurim/MyLearningClient";
import { getLandingData } from "@/lib/seriesData";
import { fetchAllShiurim } from "@/lib/shiurim";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "My Learning | Shiurim | Kahal Beis Tefilla",
  description: "Track your Torah learning journey. Continue where you left off in your shiurim.",
};

export default async function MyLearningPage() {
  const [data, allShiurim] = await Promise.all([getLandingData(), fetchAllShiurim()]);

  const allSeries = [
    ...data.groups.flatMap((g) =>
      g.series.map((s) => ({ slug: s.slug, name: s.name, episodeCount: s.episodeCount, group: g.id }))
    ),
    ...data.ungrouped.map((s) => ({ slug: s.slug, name: s.name, episodeCount: s.episodeCount, group: null as string | null })),
  ];

  const groups = data.groups.map((g) => ({ id: g.id, label: g.label }));

  // Build lookup so the client can show real titles/audioUrls for all progress entries
  const shiurLookup: Record<string, { title: string; audioUrl: string }> = {};
  for (const s of allShiurim) {
    shiurLookup[s.id] = { title: s.title, audioUrl: s.audioUrl };
  }

  return <MyLearningClient allSeries={allSeries} groups={groups} shiurLookup={shiurLookup} />;
}
