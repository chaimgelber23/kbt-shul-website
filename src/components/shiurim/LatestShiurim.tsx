"use client";

import { motion } from "framer-motion";
import type { Shiur } from "@/lib/types";
import ShiurCard from "./ShiurCard";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LatestShiurim({
  shiurim,
  onPlay,
  currentShiurId,
  isPlaying,
}: {
  shiurim: Shiur[];
  onPlay: (shiur: Shiur) => void;
  currentShiurId?: string;
  isPlaying: boolean;
}) {
  if (shiurim.length === 0) return null;

  return (
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
        {shiurim.map((shiur) => (
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
    </motion.div>
  );
}
