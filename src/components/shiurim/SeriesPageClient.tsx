"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import type { Shiur, SortOrder, NavType, SeriesGroup } from "@/lib/types";
import { PARSHIYOS_BY_SEFER, canonicalParsha, splitParshaNames, shiurBelongsToParsha } from "@/lib/categoryConfig";
import { useAudioPlayer } from "./AudioPlayerProvider";
import { getRecommendedShiur, getNextShiur } from "@/lib/progress";
import SeriesHero from "./SeriesHero";
import ShiurCard from "./ShiurCard";
import SignInBanner from "../SignInBanner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const PAGE_SIZE = 30;

interface SeriesInfo {
  slug: string;
  name: string;
  description: string;
  group: SeriesGroup;
  navType: NavType;
  sortDefault: SortOrder;
}

export default function SeriesPageClient({
  series,
  shiurim,
  navSections,
  sectionMap = {},
  trackNext = null,
  nextSeriesSlug = null,
  nextSeriesName = null,
}: {
  series: SeriesInfo;
  shiurim: Shiur[];
  navSections: string[];
  sectionMap?: Record<string, string>;
  /** First shiur of the next sefer in the track (for cross-sefer continuation). */
  trackNext?: Shiur | null;
  nextSeriesSlug?: string | null;
  nextSeriesName?: string | null;
}) {
  const [sortOrder, setSortOrder] = useState<SortOrder>(series.sortDefault);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSubSection, setSelectedSubSection] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { playShiur, playerState } = useAudioPlayer();
  const searchParams = useSearchParams();

  // Auto-select parsha from URL query param (e.g., ?section=Pekudei, ?section=Ki+Tisa,
  // or ?section=Acharei+Mos+-+Kedoshim for a double parsha).
  useEffect(() => {
    if (series.navType !== "parsha") return;
    const target = searchParams.get("section");
    if (!target) return;
    const canonical = canonicalParsha(target);
    const parts = splitParshaNames(canonical);
    const firstLower = parts[0]?.toLowerCase();
    if (!firstLower) return;
    // Find which sefer contains the (first) constituent parsha
    for (const sefer of navSections) {
      const parshiyos = PARSHIYOS_BY_SEFER[sefer] || [];
      if (parshiyos.some((p) => p.toLowerCase() === firstLower)) {
        setSelectedSection(sefer);
        // For a double, store the combined canonical so the filter matches either half
        setSelectedSubSection(parts.length > 1 ? canonical : parts[0]);
        break;
      }
    }
  }, [series.navType, searchParams, navSections]);

  const deepLinkedRef = useRef(false);

  // Get recommended shiur based on progress
  const recommendedShiur = useMemo(() => {
    return getRecommendedShiur(series.slug, shiurim);
  }, [series.slug, shiurim]);

  // Next shiur to play after `id` — advances through the full sefer, then rolls
  // into the first shiur of the next sefer in the seder (cross-sefer journey).
  // Returns the shiur AND the series it belongs to, so the player attributes
  // the auto-advanced shiur's progress to the correct sefer.
  const nextFor = (id: string): { shiur: Shiur | null; seriesSlug: string } => {
    const within = getNextShiur(shiurim, id);
    if (within) return { shiur: within, seriesSlug: series.slug };
    if (trackNext) return { shiur: trackNext, seriesSlug: nextSeriesSlug || series.slug };
    return { shiur: null, seriesSlug: series.slug };
  };

  // For parsha: need the parsha names within a sefer
  const parshaSubSections = useMemo(() => {
    if (series.navType !== "parsha" || !selectedSection) return [];
    return PARSHIYOS_BY_SEFER[selectedSection] || [];
  }, [series.navType, selectedSection]);

  // Filter shiurim by selected section
  const filteredShiurim = useMemo(() => {
    let filtered = [...shiurim];

    if (selectedSection && series.navType === "parsha") {
      // For parsha, filter by parsha name in title (variant-aware).
      // A double parsha subSection (e.g., "Acharei Mos - Kedoshim") matches shiurim on either half.
      if (selectedSubSection) {
        filtered = filtered.filter((s) => shiurBelongsToParsha(s, selectedSubSection));
      } else {
        // Filter by all parshiyos in the selected sefer.
        const parshiyos = PARSHIYOS_BY_SEFER[selectedSection] || [];
        filtered = filtered.filter((s) =>
          parshiyos.some((p) => shiurBelongsToParsha(s, p)),
        );
      }
    } else if (selectedSection && series.navType === "perek") {
      // Filter by perek number
      const perekNum = selectedSection.replace(/\D/g, "");
      filtered = filtered.filter((s) => {
        const titleLower = s.title.toLowerCase();
        // Match "perek X", "X.Y", "X,", "X " after the series prefix
        const perekPattern = new RegExp(
          `(?:perek\\s*${perekNum}\\b|\\b${perekNum}\\.\\d|\\b${perekNum}[,:\\s])`,
          "i"
        );
        return perekPattern.test(titleLower);
      });
    } else if (selectedSection && series.navType === "topic") {
      // Prefer the server-computed section map (catches shiurim whose
      // section name doesn't appear verbatim in the title, e.g., a
      // "Shabbos Hagadol" shiur belonging to "Pesach"). Fall back to
      // a substring match for any shiur missing from the map.
      const lower = selectedSection.toLowerCase();
      filtered = filtered.filter((s) => {
        const mapped = sectionMap[s.id];
        if (mapped) return mapped === selectedSection;
        return s.title.toLowerCase().includes(lower);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const diff = new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      return sortOrder === "newest" ? diff : -diff;
    });

    return filtered;
  }, [shiurim, selectedSection, selectedSubSection, sortOrder, series.navType, sectionMap]);

  // Deep-link: auto-play and scroll to a specific shiur via ?shiur=ID
  useEffect(() => {
    if (deepLinkedRef.current) return;
    const shiurId = searchParams.get("shiur");
    if (!shiurId) return;
    const target = shiurim.find((s) => s.id === shiurId);
    if (!target) return;
    deepLinkedRef.current = true;
    // Ensure the shiur is in the visible set
    const idx = filteredShiurim.findIndex((s) => s.id === shiurId);
    if (idx >= 0 && idx >= visibleCount) {
      setVisibleCount(idx + PAGE_SIZE);
    }
    // Auto-play the linked shiur
    const n = nextFor(target.id);
    playShiur(target, false, series.slug, n.shiur, n.seriesSlug);
    // Scroll to the card after render
    setTimeout(() => {
      const el = document.getElementById(`shiur-${shiurId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }, [searchParams, shiurim, filteredShiurim, visibleCount, playShiur, series.slug]);

  const visible = filteredShiurim.slice(0, visibleCount);
  const hasMore = visibleCount < filteredShiurim.length;

  // Reset visible count when filters change
  const handleSectionChange = (section: string | null) => {
    setSelectedSection(section);
    setSelectedSubSection(null);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <main className="min-h-screen">
      <SeriesHero
        name={series.name}
        description={series.description}
        group={series.group}
        episodeCount={shiurim.length}
      />

      {/* Sign in banner for unauthenticated users */}
      <SignInBanner />

      <section className="py-12 px-6 bg-bg-light">
        <div className="max-w-6xl mx-auto">
          {/* Action buttons - only show Resume if user has started */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {/* Resume button - ONLY shown if there's actual progress */}
            {recommendedShiur.lastListenedShiur && (
              <button
                onClick={() => {
                  const shiurToPlay = recommendedShiur.shouldResume
                    ? recommendedShiur.shiur
                    : (recommendedShiur.shiur || recommendedShiur.lastListenedShiur);
                  if (!shiurToPlay) return;
                  const n = nextFor(shiurToPlay.id);
                  playShiur(shiurToPlay, false, series.slug, n.shiur, n.seriesSlug);
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white shadow-md hover:bg-primary-light transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {recommendedShiur.shouldResume ? "Resume" : "Continue"} in {series.name}
              </button>
            )}

            {/* Sort/Filter buttons */}
            <button
              onClick={() => { setSortOrder("oldest"); handleSectionChange(null); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${sortOrder === "oldest" && !selectedSection
                ? "bg-navy text-white shadow-md"
                : "bg-white border border-navy/15 text-navy/70 hover:border-navy/30"
                }`}
            >
              Start from Beginning
            </button>
            <button
              onClick={() => { setSortOrder("newest"); handleSectionChange(null); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${sortOrder === "newest" && !selectedSection
                ? "bg-navy text-white shadow-md"
                : "bg-white border border-navy/15 text-navy/70 hover:border-navy/30"
                }`}
            >
              Latest Shiur
            </button>
          </div>

          {/* Navigation: Perek chips */}
          {series.navType === "perek" && navSections.length > 0 && (
            <div className="mb-8">
              <h3 className="text-navy/60 text-sm font-semibold mb-3 uppercase tracking-wider">
                Browse by Perek
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSectionChange(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedSection
                    ? "bg-primary text-white"
                    : "bg-white border border-primary/20 text-navy/60 hover:border-primary/40"
                    }`}
                >
                  All
                </button>
                {navSections.map((section) => (
                  <button
                    key={section}
                    onClick={() => handleSectionChange(section)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedSection === section
                      ? "bg-primary text-white"
                      : "bg-white border border-primary/20 text-navy/60 hover:border-primary/40"
                      }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation: Topic chips */}
          {series.navType === "topic" && navSections.length > 0 && (
            <div className="mb-8">
              <h3 className="text-navy/60 text-sm font-semibold mb-3 uppercase tracking-wider">
                Browse by Topic
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSectionChange(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedSection
                    ? "bg-primary text-white"
                    : "bg-white border border-primary/20 text-navy/60 hover:border-primary/40"
                    }`}
                >
                  All
                </button>
                {navSections.map((section) => (
                  <button
                    key={section}
                    onClick={() => handleSectionChange(section)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedSection === section
                      ? "bg-primary text-white"
                      : "bg-white border border-primary/20 text-navy/60 hover:border-primary/40"
                      }`}
                  >
                    {section}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation: Parsha tabs + chips */}
          {series.navType === "parsha" && navSections.length > 0 && (
            <div className="mb-8">
              {/* Sefer tabs */}
              <h3 className="text-navy/60 text-sm font-semibold mb-3 uppercase tracking-wider">
                Browse by Sefer
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => handleSectionChange(null)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${!selectedSection
                    ? "bg-navy text-white"
                    : "bg-white border border-navy/15 text-navy/60 hover:border-navy/30"
                    }`}
                >
                  All Parshiyos
                </button>
                {navSections.map((sefer) => (
                  <button
                    key={sefer}
                    onClick={() => handleSectionChange(sefer)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${selectedSection === sefer
                      ? "bg-navy text-white"
                      : "bg-white border border-navy/15 text-navy/60 hover:border-navy/30"
                      }`}
                  >
                    {sefer}
                  </button>
                ))}
              </div>

              {/* Parsha chips within selected sefer */}
              {selectedSection && parshaSubSections.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSubSection(null)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedSubSection
                      ? "bg-primary text-white"
                      : "bg-white border border-primary/20 text-navy/60 hover:border-primary/40"
                      }`}
                  >
                    All {selectedSection}
                  </button>
                  {parshaSubSections.map((parsha) => (
                    <button
                      key={parsha}
                      onClick={() => { setSelectedSubSection(parsha); setVisibleCount(PAGE_SIZE); }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedSubSection === parsha
                        ? "bg-primary text-white"
                        : "bg-white border border-primary/20 text-navy/60 hover:border-primary/40"
                        }`}
                    >
                      {parsha}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sort controls */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <p className="text-navy/60 text-sm">
              {filteredShiurim.length} shiur{filteredShiurim.length !== 1 ? "im" : ""}
              {selectedSection && ` in ${selectedSection}`}
              {selectedSubSection && ` / ${selectedSubSection}`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-navy/50 text-sm">Sort:</span>
              <button
                onClick={() => setSortOrder("newest")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${sortOrder === "newest"
                  ? "bg-navy text-white"
                  : "bg-white border border-navy/15 text-navy/60 hover:border-navy/30"
                  }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortOrder("oldest")}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${sortOrder === "oldest"
                  ? "bg-navy text-white"
                  : "bg-white border border-navy/15 text-navy/60 hover:border-navy/30"
                  }`}
              >
                Oldest
              </button>
            </div>
          </div>

          {/* Episode list */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visible.map((shiur) => {
              const n = nextFor(shiur.id);
              return (
                <motion.div key={shiur.id} id={`shiur-${shiur.id}`} variants={fadeUp}>
                  <ShiurCard
                    shiur={shiur}
                    onPlay={(s) => playShiur(s, false, series.slug, n.shiur, n.seriesSlug)}
                    isCurrentlyPlaying={
                      playerState.currentShiur?.id === shiur.id &&
                      playerState.isPlaying
                    }
                    isCurrent={playerState.currentShiur?.id === shiur.id}
                    seriesSlug={series.slug}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Empty state */}
          {filteredShiurim.length === 0 && (
            <div className="text-center py-16 text-navy/40">
              <p className="text-lg">No shiurim found for this selection.</p>
              <button
                onClick={() => handleSectionChange(null)}
                className="mt-4 text-primary font-semibold hover:text-primary-light transition-colors"
              >
                View all shiurim in this series
              </button>
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="border border-primary/30 text-navy px-8 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors"
              >
                Load More Shiurim
                <span className="text-navy/50 text-sm ml-2">
                  (showing {visible.length} of {filteredShiurim.length})
                </span>
              </button>
            </div>
          )}

          {/* Next in the seder (cross-sefer journey) */}
          {nextSeriesSlug && nextSeriesName && (
            <Link
              href={`/shiurim/${nextSeriesSlug}`}
              className="group mt-12 flex items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-white p-5 sm:p-6 shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all"
            >
              <div className="min-w-0">
                <p className="eyebrow mb-1">Next in the seder</p>
                <p className="serif-heading text-navy text-xl font-bold truncate group-hover:text-primary transition-colors">
                  {nextSeriesName}
                </p>
                <p className="text-navy/50 text-sm mt-0.5">Continue your Tanach journey →</p>
              </div>
              <span className="shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
