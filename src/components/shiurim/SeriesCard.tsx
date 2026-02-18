"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { SeriesStats } from "@/lib/types";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SeriesCard({ series }: { series: SeriesStats }) {
  return (
    <motion.div variants={fadeUp}>
      <Link href={`/shiurim/${series.slug}`} className="block h-full">
        <div className="bg-white border border-primary/15 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group h-full flex flex-col">
          <h3 className="text-navy font-bold text-lg group-hover:text-primary transition-colors">
            {series.name}
          </h3>
          <p className="text-navy/50 text-sm mt-1 line-clamp-2 flex-1">
            {series.description}
          </p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-primary/10">
            <span className="text-primary font-semibold text-sm">
              {series.episodeCount} shiur{series.episodeCount !== 1 ? "im" : ""}
            </span>
            <span className="text-navy/40 text-xs">
              Latest: {formatDate(series.latestDate)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
