import type { Metadata } from "next";
import MyLearningClient from "@/components/shiurim/MyLearningClient";
import { getLandingData, getTrackData } from "@/lib/seriesData";
import { fetchAllShiurim } from "@/lib/shiurim";
import type { JourneyShiur, JourneySeries } from "@/components/shiurim/TanachJourney";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "My Learning | Shiurim | Kahal Beis Tefilla",
  description: "Track your Torah learning journey. Continue where you left off in your shiurim.",
};

export default async function MyLearningPage() {
  const [data, allShiurim, naviTrack] = await Promise.all([
    getLandingData(),
    fetchAllShiurim(),
    getTrackData("navi"),
  ]);

  // Slim the Navi track down to what the client journey needs.
  const track = naviTrack
    ? {
        label: naviTrack.label,
        description: naviTrack.description,
        ordered: naviTrack.ordered.map((e): JourneyShiur => ({
          id: e.shiur.id,
          title: e.shiur.title,
          audioUrl: e.shiur.audioUrl,
          durationSeconds: e.shiur.durationSeconds,
          seriesSlug: e.seriesSlug,
          seriesName: e.seriesName,
        })),
        series: naviTrack.series.map((s): JourneySeries => ({
          slug: s.slug,
          name: s.name,
          count: s.count,
          startIndex: s.startIndex,
        })),
      }
    : null;

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

  return <MyLearningClient allSeries={allSeries} groups={groups} shiurLookup={shiurLookup} track={track} />;
}
