"use client";

import { useState } from "react";
import type { Shiur, SortOrder } from "@/lib/types";
import ShiurCard from "./ShiurCard";

const PAGE_SIZE = 30;

export default function ShiurimList({
  shiurim,
  sortOrder,
  onSortChange,
  onPlay,
  currentShiurId,
  isPlaying,
}: {
  shiurim: Shiur[];
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  onPlay: (shiur: Shiur) => void;
  currentShiurId?: string;
  isPlaying: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sorted = [...shiurim].sort((a, b) => {
    const diff = new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    return sortOrder === "newest" ? diff : -diff;
  });

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <div>
      {/* Header with count and sort */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <p className="text-navy/60 text-sm">
          {shiurim.length} shiur{shiurim.length !== 1 ? "im" : ""}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-navy/50 text-sm">Sort:</span>
          <button
            onClick={() => onSortChange("newest")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              sortOrder === "newest"
                ? "bg-navy text-white"
                : "bg-white border border-navy/15 text-navy/60 hover:border-navy/30"
            }`}
          >
            Newest
          </button>
          <button
            onClick={() => onSortChange("oldest")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              sortOrder === "oldest"
                ? "bg-navy text-white"
                : "bg-white border border-navy/15 text-navy/60 hover:border-navy/30"
            }`}
          >
            Oldest
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((shiur) => (
          <ShiurCard
            key={shiur.id}
            shiur={shiur}
            onPlay={onPlay}
            isCurrentlyPlaying={currentShiurId === shiur.id && isPlaying}
            isCurrent={currentShiurId === shiur.id}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="border border-primary/30 text-navy px-8 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors"
          >
            Load More Shiurim
            <span className="text-navy/50 text-sm ml-2">
              (showing {visible.length} of {sorted.length})
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
