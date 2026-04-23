import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSeriesShiurim, getSeriesNavSections, getSeriesSectionMap } from "@/lib/seriesData";
import { getSeriesBySlug, getAllSlugs } from "@/lib/seriesConfig";
import SeriesPageClient from "@/components/shiurim/SeriesPageClient";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) return {};
  return {
    title: `${series.name} | Shiurim | Kahal Beis Tefilla`,
    description: series.description,
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) notFound();

  const [shiurim, navSections, sectionMap] = await Promise.all([
    getSeriesShiurim(slug),
    getSeriesNavSections(slug),
    getSeriesSectionMap(slug),
  ]);

  return (
    <Suspense>
      <SeriesPageClient
        series={{
          slug: series.slug,
          name: series.name,
          description: series.description,
          group: series.group,
          navType: series.navType,
          sortDefault: series.sortDefault || "newest",
        }}
        shiurim={shiurim}
        navSections={navSections}
        sectionMap={sectionMap}
      />
    </Suspense>
  );
}

