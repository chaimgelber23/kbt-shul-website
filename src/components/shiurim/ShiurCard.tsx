"use client";

import type { Shiur } from "@/lib/types";
import { getCategoryDef } from "@/lib/categories";

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDuration(duration: string): string {
  // Convert "00:27:10" to "27 min" or "1:27:10" to "1h 27m"
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    if (parts[0] > 0) return `${parts[0]}h ${parts[1]}m`;
    return `${parts[1]} min`;
  }
  if (parts.length === 2) {
    return `${parts[0]} min`;
  }
  return duration;
}

export default function ShiurCard({
  shiur,
  onPlay,
  isCurrentlyPlaying,
  isCurrent,
}: {
  shiur: Shiur;
  onPlay: (shiur: Shiur) => void;
  isCurrentlyPlaying: boolean;
  isCurrent: boolean;
}) {
  const catDef = getCategoryDef(shiur.categoryId);

  return (
    <div
      className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all ${
        isCurrent ? "border-primary ring-1 ring-primary/20" : "border-primary/15"
      }`}
    >
      {/* Category tag */}
      {catDef && catDef.id !== "general" && (
        <span className="inline-block bg-primary/10 text-primary text-xs font-semibold rounded-full px-2.5 py-0.5 mb-3">
          {catDef.label}
        </span>
      )}

      {/* Title */}
      <h3 className="text-navy font-bold text-lg leading-snug line-clamp-2 mb-3">
        {shiur.title}
      </h3>

      {/* Meta row */}
      <div className="flex items-center gap-2 text-navy/50 text-sm mb-4">
        <span>{formatDate(shiur.pubDate)}</span>
        <span className="text-navy/20">|</span>
        <span>{formatDuration(shiur.duration)}</span>
      </div>

      {/* Play button */}
      <button
        onClick={() => onPlay(shiur)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
          isCurrent
            ? "bg-primary text-white"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        }`}
      >
        {isCurrentlyPlaying ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
            Pause
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            {isCurrent ? "Resume" : "Play"}
          </>
        )}
      </button>
    </div>
  );
}
