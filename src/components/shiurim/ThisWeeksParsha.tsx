"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Shiur } from "@/lib/types";
import { shiurBelongsToParsha } from "@/lib/categoryConfig";
import ShiurCard from "./ShiurCard";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ThisWeeksParsha({
  parshaName,
  parshaHebrew,
  shiurim,
  onPlay,
  currentShiurId,
  isPlaying,
  onViewAll,
}: {
  parshaName: string;
  parshaHebrew: string;
  shiurim: Shiur[];
  onPlay: (shiur: Shiur) => void;
  currentShiurId?: string;
  isPlaying: boolean;
  onViewAll: () => void;
}) {
  // Find shiurim matching this parsha — spelling/apostrophe tolerant and
  // double-parsha aware via the shared matcher.
  const parshaShiurim = useMemo(
    () => shiurim.filter((s) => shiurBelongsToParsha(s, parshaName)),
    [shiurim, parshaName],
  );

  if (parshaShiurim.length === 0) return null;

  // Show up to 3 shiurim, newest first
  const displayed = parshaShiurim
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 3);

  return (
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
              {parshaName}
              {parshaHebrew && (
                <span className="hebrew-heading text-navy/50 ml-2">
                  {parshaHebrew}
                </span>
              )}
            </p>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="w-20 h-1 bg-primary mb-8" />

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayed.map((shiur) => (
            <motion.div key={shiur.id} variants={fadeUp}>
              <ShiurCard
                shiur={shiur}
                onPlay={onPlay}
                isCurrentlyPlaying={currentShiurId === shiur.id && isPlaying}
                isCurrent={currentShiurId === shiur.id}
              />
            </motion.div>
          ))}
        </motion.div>

        {parshaShiurim.length > 3 && (
          <motion.div variants={fadeUp} className="mt-6 text-center">
            <button
              onClick={onViewAll}
              className="text-primary font-semibold hover:text-primary-light transition-colors text-sm"
            >
              View all {parshaShiurim.length} shiurim on Parshas {parshaName} &rarr;
            </button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
