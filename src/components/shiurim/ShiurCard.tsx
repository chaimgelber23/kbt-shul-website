"use client";

import { useEffect, useState } from "react";
import type { Shiur } from "@/lib/types";
import { getCategoryDef } from "@/lib/categories";
import { getProgressPercentage, isInProgress } from "@/lib/progress";

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDuration(duration: string): string {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) {
    if (parts[0] > 0) return `${parts[0]}h ${parts[1]}m`;
    return `${parts[1]} min`;
  }
  if (parts.length === 2) return `${parts[0]} min`;
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
  const [progressPercent, setProgressPercent] = useState(0);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    setProgressPercent(getProgressPercentage(shiur.id));
    setInProgress(isInProgress(shiur.id));
  }, [shiur.id]);

  return (
    <div className={`bg-white rounded-xl transition-all duration-200 border ${
      isCurrent
        ? "border-primary shadow-md shadow-primary/10 ring-1 ring-primary/20"
        : "border-primary/10 shadow-sm hover:shadow-md hover:border-primary/25"
    }`}>
      <div className="flex items-center gap-4 p-4">

        {/* ── Play / Pause button ── */}
        <button
          onClick={() => onPlay(shiur)}
          aria-label={isCurrentlyPlaying ? "Pause" : isCurrent ? "Resume" : "Play"}
          className="relative flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center
                     transition-transform duration-150 hover:scale-105 active:scale-95
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2"
          style={{
            background: "linear-gradient(145deg, #D0B055 0%, #C4A245 55%, #A88530 100%)",
            boxShadow: isCurrentlyPlaying
              ? "0 0 0 4px rgba(196,162,69,0.22), 0 6px 18px rgba(168,133,48,0.45)"
              : "0 4px 14px rgba(168,133,48,0.38), inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          {/* Pulse ring when actively playing */}
          {isCurrentlyPlaying && (
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "rgba(196,162,69,0.35)" }}
            />
          )}

          {isCurrentlyPlaying ? (
            <svg className="w-[17px] h-[17px] text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
              <rect x="5.5" y="4" width="4" height="16" rx="2" />
              <rect x="14.5" y="4" width="4" height="16" rx="2" />
            </svg>
          ) : (
            <svg className="w-[17px] h-[17px] text-white drop-shadow-sm translate-x-px" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* ── Title + meta + progress ── */}
        <div className="flex-1 min-w-0">
          {/* Category tag */}
          {catDef && catDef.id !== "general" && (
            <span className="inline-block bg-primary/10 text-primary text-xs font-semibold rounded-full px-2 py-0.5 mb-1">
              {catDef.label}
            </span>
          )}
          <h3 className={`font-bold text-sm leading-snug line-clamp-2 mb-0.5 transition-colors ${
            isCurrent ? "text-primary" : "text-navy"
          }`}>
            {shiur.title}
          </h3>
          <div className="flex items-center gap-1.5 text-navy/40 text-xs flex-wrap">
            <span>{formatDate(shiur.pubDate)}</span>
            <span>·</span>
            <span>{formatDuration(shiur.duration)}</span>
            {progressPercent >= 100 && (
              <>
                <span>·</span>
                <span className="text-green-600/80 font-semibold flex items-center gap-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Done
                </span>
              </>
            )}
            {inProgress && progressPercent < 100 && (
              <>
                <span>·</span>
                <span className="text-primary/70 font-medium">{progressPercent}%</span>
              </>
            )}
          </div>

          {/* Thin progress bar */}
          {progressPercent > 0 && progressPercent < 100 && (
            <div className="mt-2 h-1 bg-navy/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%`, background: "linear-gradient(90deg,#C4A245,#D0B055)" }}
              />
            </div>
          )}
        </div>

        {/* ── Download icon ── */}
        <a
          href={`/api/download?url=${encodeURIComponent(shiur.audioUrl)}&title=${encodeURIComponent(shiur.title)}`}
          title="Download shiur"
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-navy/25
                     hover:text-primary hover:bg-primary/8 transition-all duration-150"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>

      </div>
    </div>
  );
}
