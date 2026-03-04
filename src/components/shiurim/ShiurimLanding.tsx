"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Shiur, SeriesStats } from "@/lib/types";
import { getParshaVariants } from "@/lib/categoryConfig";
import { useAudioPlayer } from "./AudioPlayerProvider";
import ShiurimHero from "./ShiurimHero";
import SearchBar from "./SearchBar";
import SeriesCard from "./SeriesCard";
import ShiurCard from "./ShiurCard";
import SignInBanner from "../SignInBanner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

interface LandingProps {
  ungrouped: SeriesStats[];
  groups: { id: string; label: string; description: string; series: SeriesStats[] }[];
  totalCount: number;
  latestShiurim: Shiur[];
  allShiurim: Shiur[];
  currentParsha: { name: string; hebrew: string } | null;
}

export default function ShiurimLanding({
  ungrouped,
  groups,
  totalCount,
  latestShiurim,
  allShiurim,
  currentParsha,
}: LandingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { playShiur, playerState } = useAudioPlayer();

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return allShiurim.filter((s) => s.title.toLowerCase().includes(q));
  }, [searchQuery, allShiurim]);

  const isSearching = searchQuery.trim().length > 0;

  // Find ALL parsha shiurim for "This Week's Parsha" (don't slice — we need the total count)
  const parshaShiurim = useMemo(() => {
    if (!currentParsha) return [];
    const lowerName = currentParsha.name.toLowerCase();
    // Get all known spelling variants (e.g., "ki sisa" → ["ki sisa", "ki tisa", "ki sissa"])
    const variants = getParshaVariants(currentParsha.name);
    return allShiurim
      .filter((s) => {
        // Match by canonical subLevel2
        if (s.subLevel2?.toLowerCase() === lowerName) return true;
        // Also match by title containing any variant spelling
        const titleLower = s.title.toLowerCase();
        return variants.some((v) =>
          titleLower.includes(`parshas ${v}`) ||
          titleLower.includes(`parsha ${v}`)
        );
      })
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  }, [allShiurim, currentParsha]);

  const displayedParshaShiurim = parshaShiurim.slice(0, 3);

  return (
    <main className="min-h-screen">
      <ShiurimHero totalCount={totalCount} />

      {/* Sign in banner for unauthenticated users */}
      <SignInBanner />

      {/* This Week's Parsha */}
      {currentParsha && parshaShiurim.length > 0 && !isSearching && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="bg-bg-alt py-12 px-6 border-b border-primary/10"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-2">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="serif-heading text-navy text-3xl font-bold">
                  This Week&apos;s Parsha
                </h2>
                <p className="text-primary font-semibold text-lg">
                  {currentParsha.name}
                  {currentParsha.hebrew && (
                    <span className="hebrew-heading text-navy/50 ml-2">
                      {currentParsha.hebrew}
                    </span>
                  )}
                </p>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="w-20 h-1 bg-primary mb-8" />
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedParshaShiurim.map((shiur) => (
                <motion.div key={shiur.id} variants={fadeUp}>
                  <ShiurCard
                    shiur={shiur}
                    onPlay={playShiur}
                    isCurrentlyPlaying={playerState.currentShiur?.id === shiur.id && playerState.isPlaying}
                    isCurrent={playerState.currentShiur?.id === shiur.id}
                  />
                </motion.div>
              ))}
            </motion.div>
            {parshaShiurim.length > 3 && (
              <motion.div variants={fadeUp} className="mt-6 text-center">
                <Link
                  href={`/shiurim/parsha?section=${encodeURIComponent(currentParsha!.name)}`}
                  className="text-primary font-semibold hover:text-primary-light transition-colors text-sm"
                >
                  View all {parshaShiurim.length} shiurim on Parshas {currentParsha!.name} &rarr;
                </Link>
              </motion.div>
            )}
          </div>
        </motion.section>
      )}

      {/* Search Bar */}
      <section className="bg-bg-alt border-b border-primary/10 py-6 px-6 sticky top-[73px] z-40 backdrop-blur-sm bg-bg-alt/95">
        <div className="max-w-5xl mx-auto">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6 bg-bg-light">
        <div className="max-w-6xl mx-auto">
          {/* Search Results */}
          {isSearching && (
            <div>
              <p className="text-navy/60 text-sm mb-6">
                {searchResults?.length || 0} result{searchResults?.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
              </p>
              {searchResults && searchResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.slice(0, 30).map((shiur) => (
                    <ShiurCard
                      key={shiur.id}
                      shiur={shiur}
                      onPlay={playShiur}
                      isCurrentlyPlaying={playerState.currentShiur?.id === shiur.id && playerState.isPlaying}
                      isCurrent={playerState.currentShiur?.id === shiur.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Browse Series (when not searching) */}
          {!isSearching && (
            <>
              {/* All Series (ungrouped) */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
              >
                <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                  <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="serif-heading text-navy text-4xl font-bold">
                    Browse Shiurim
                  </h2>
                </motion.div>
                <motion.div variants={fadeUp} className="w-20 h-1 bg-primary mb-10" />

                <motion.div
                  variants={stagger}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {ungrouped.map((series) => (
                    <SeriesCard key={series.slug} series={series} />
                  ))}
                </motion.div>
              </motion.div>

              {/* Grouped sections (Halacha, Navi) */}
              {groups.map((group) => (
                <motion.div
                  key={group.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="mt-16"
                >
                  <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                    <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="serif-heading text-navy text-4xl font-bold">
                        {group.label}
                      </h2>
                      <p className="text-navy/50 text-sm">{group.description}</p>
                    </div>
                  </motion.div>
                  <motion.div variants={fadeUp} className="w-20 h-1 bg-primary mb-10" />

                  <motion.div
                    variants={stagger}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {group.series.map((series) => (
                      <SeriesCard key={series.slug} series={series} />
                    ))}
                  </motion.div>
                </motion.div>
              ))}

              {/* Latest Shiurim */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={stagger}
                className="mt-16"
              >
                <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                  <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <div className="w-6 h-0.5 bg-primary" />
                  </div>
                  <h2 className="serif-heading text-navy text-4xl font-bold">
                    Latest Shiurim
                  </h2>
                </motion.div>
                <motion.div variants={fadeUp} className="w-20 h-1 bg-primary mb-10" />

                <motion.div
                  variants={stagger}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {latestShiurim.map((shiur) => (
                    <motion.div key={shiur.id} variants={fadeUp}>
                      <ShiurCard
                        shiur={shiur}
                        onPlay={playShiur}
                        isCurrentlyPlaying={playerState.currentShiur?.id === shiur.id && playerState.isPlaying}
                        isCurrent={playerState.currentShiur?.id === shiur.id}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Archive CTA */}
              <div className="mt-16 bg-navy rounded-2xl py-12 px-6 text-center">
                <h2 className="serif-heading text-primary text-3xl font-bold mb-4">
                  Explore the Full Archive
                </h2>
                <p className="text-white/70 text-lg mb-8">
                  Browse all 2,000+ shiurim on JewishPodcasts.fm
                </p>
                <a
                  href="https://listen.jewishpodcasts.fm/rabbisteinhauer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-primary text-navy font-bold px-8 py-3 rounded-xl hover:bg-primary-light transition-colors"
                >
                  Browse Full Archive
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
