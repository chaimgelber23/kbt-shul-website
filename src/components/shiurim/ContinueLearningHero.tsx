"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { useAudioPlayer } from "./AudioPlayerProvider";
import {
  getMostRecentResume,
  getProgressPercentage,
  loadProgressFromFirestore,
  type ShiurProgress,
} from "@/lib/progress";

function prettySlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * "Continue where you left off" — the single most-recent in-progress shiur,
 * one tap to resume. Renders nothing if there's no progress yet.
 */
export default function ContinueLearningHero({
  seriesNames = {},
}: {
  seriesNames?: Record<string, string>;
}) {
  const { user, loading } = useAuth();
  const { playShiur, playerState } = useAudioPlayer();
  const [resume, setResume] = useState<ShiurProgress | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => setResume(getMostRecentResume()), []);

  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  // After sign-in, pull cloud progress then re-resolve the resume point.
  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    loadProgressFromFirestore()
      .then(() => { if (!cancelled) refresh(); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [loading, user, refresh]);

  // Keep in sync as the listener plays through shiurim on the same page.
  useEffect(() => {
    refresh();
  }, [playerState.currentShiur?.id, playerState.isPlaying, refresh]);

  if (!ready || !resume) return null;

  const pct = getProgressPercentage(resume.shiurId);
  const seriesName =
    (resume.seriesSlug && (seriesNames[resume.seriesSlug] || prettySlug(resume.seriesSlug))) || "";
  const isThis = playerState.currentShiur?.id === resume.shiurId;
  const isPlaying = isThis && playerState.isPlaying;

  function handleResume() {
    if (!resume?.audioUrl) return;
    playShiur(
      {
        id: resume.shiurId,
        title: resume.title || "",
        audioUrl: resume.audioUrl,
        duration: resume.duration ? new Date(resume.duration * 1000).toISOString().substr(11, 8) : "0:00",
        durationSeconds: resume.duration,
        pubDate: resume.lastListened,
        description: "",
        link: "",
        categoryId: "",
      },
      false,
      resume.seriesSlug || undefined,
      null
    );
  }

  return (
    <section className="px-6 -mt-8 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="max-w-6xl mx-auto"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-light text-white shadow-float border border-primary/20">
          {/* Decorative gold glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-stretch gap-5 p-6 sm:p-7">
            {/* Big play button */}
            <button
              onClick={handleResume}
              aria-label={isPlaying ? "Pause" : "Resume"}
              className="group shrink-0 self-center w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(145deg,#D0B055,#A88530)",
                boxShadow: "0 8px 24px rgba(168,133,48,0.45)",
              }}
            >
              {isPlaying ? (
                <svg className="w-7 h-7 text-navy" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1.5" />
                  <rect x="14" y="4" width="4" height="16" rx="1.5" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-navy translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Text */}
            <div className="flex-1 min-w-0 self-center">
              <p className="eyebrow text-primary-light/90 mb-1.5">Continue where you left off</p>
              <h2 className="serif-heading text-white text-xl sm:text-2xl font-bold leading-snug line-clamp-2">
                {resume.title}
              </h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-white/55 text-sm">
                {seriesName && <span className="text-primary-light/90 font-semibold">{seriesName}</span>}
                <span>{pct}% complete</span>
                <span className="text-white/30">•</span>
                <span>Last listened {formatRelative(resume.lastListened)}</span>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-md">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg,#C4A245,#D0B055)" }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
              <button onClick={handleResume} className="btn btn-primary px-6 py-2.5 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                {isPlaying ? "Playing" : "Resume"}
              </button>
              <Link
                href="/my-learning"
                className="text-white/60 hover:text-primary-light text-sm font-semibold transition-colors whitespace-nowrap"
              >
                My Learning →
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
