"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Shiur } from "@/lib/types";
import { useAudioPlayer } from "./AudioPlayerProvider";
import {
  getShiurProgress,
  getTrackResume,
  type TrackPlayItem,
} from "@/lib/progress";

export interface JourneyShiur {
  id: string;
  title: string;
  audioUrl: string;
  durationSeconds: number;
  seriesSlug: string;
  seriesName: string;
}

export interface JourneySeries {
  slug: string;
  name: string;
  count: number;
  startIndex: number;
}

export interface TanachJourneyProps {
  label: string;
  description: string;
  ordered: JourneyShiur[];
  series: JourneySeries[];
}

function toShiur(j: JourneyShiur): Shiur {
  return {
    id: j.id,
    title: j.title,
    audioUrl: j.audioUrl,
    duration: j.durationSeconds ? new Date(j.durationSeconds * 1000).toISOString().substr(11, 8) : "0:00",
    durationSeconds: j.durationSeconds,
    pubDate: new Date(0).toISOString(),
    description: "",
    link: "",
    categoryId: "",
  };
}

export default function TanachJourney({ label, description, ordered, series }: TanachJourneyProps) {
  const { playShiur, playerState } = useAudioPlayer();
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => { refresh(); }, [refresh]);
  // Re-read progress as the listener plays through.
  useEffect(() => { refresh(); }, [playerState.currentShiur?.id, playerState.isPlaying, refresh]);

  const playItems: TrackPlayItem[] = useMemo(
    () => ordered.map((o) => ({ shiurId: o.id, seriesSlug: o.seriesSlug })),
    [ordered]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resume = useMemo(() => getTrackResume(playItems), [playItems, tick]);

  // Per-sefer completed counts + the "current" sefer (contains the next shiur).
  const perSeries = useMemo(() => {
    return series.map((s) => {
      let completed = 0;
      let started = 0;
      for (let i = s.startIndex; i < s.startIndex + s.count; i++) {
        const p = getShiurProgress(ordered[i]?.id);
        if (!p) continue;
        if (p.completed) completed++;
        else if (p.currentTime > 10) started++;
      }
      const isCurrent =
        resume.nextIndex != null &&
        resume.nextIndex >= s.startIndex &&
        resume.nextIndex < s.startIndex + s.count;
      const pct = s.count > 0 ? Math.round((completed / s.count) * 100) : 0;
      let status: "done" | "current" | "started" | "todo";
      if (completed >= s.count) status = "done";
      else if (isCurrent) status = "current";
      else if (started > 0 || completed > 0) status = "started";
      else status = "todo";
      return { ...s, completed, started, pct, isCurrent, status };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, ordered, resume, tick]);

  const next = resume.nextIndex != null ? ordered[resume.nextIndex] : null;
  const overallPct = resume.total > 0 ? Math.round((resume.completedCount / resume.total) * 100) : 0;

  function handleContinue() {
    if (!next?.audioUrl || resume.nextIndex == null) return;
    const nextUp = ordered[resume.nextIndex + 1] ?? null;
    playShiur(
      toShiur(next),
      false,
      next.seriesSlug,
      nextUp ? toShiur(nextUp) : null,
      nextUp ? nextUp.seriesSlug : null
    );
  }

  if (ordered.length === 0) return null;

  return (
    <div className="bg-white border border-primary/15 rounded-2xl shadow-card overflow-hidden">
      {/* Header band */}
      <div className="relative bg-gradient-to-br from-navy to-navy-light text-white p-6 sm:p-8 overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow text-primary-light/90 mb-2">{label}</p>
            <p className="text-white/70 text-sm leading-relaxed text-pretty">{description}</p>
          </div>
          <div className="shrink-0">
            <div className="flex items-baseline gap-2">
              <span className="serif-heading text-primary text-4xl font-bold">{overallPct}%</span>
              <span className="text-white/50 text-sm">through the seder</span>
            </div>
            <div className="mt-2 h-1.5 w-44 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${overallPct}%`, background: "linear-gradient(90deg,#C4A245,#D0B055)" }} />
            </div>
            <p className="text-white/45 text-xs mt-1.5">{resume.completedCount} of {resume.total} shiurim completed</p>
          </div>
        </div>

        {/* Continue CTA */}
        {next ? (
          <div className="relative mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <button onClick={handleContinue} className="btn btn-primary px-6 py-3 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              {resume.shouldResume ? "Resume" : resume.completedCount === 0 ? "Begin the journey" : "Continue the journey"}
            </button>
            <p className="text-white/60 text-sm min-w-0">
              <span className="text-primary-light/90 font-semibold">{next.seriesName}</span>
              <span className="text-white/30 mx-1.5">·</span>
              <span className="line-clamp-1 align-bottom">{next.title}</span>
            </p>
          </div>
        ) : (
          <div className="relative mt-6 inline-flex items-center gap-2 text-primary-light font-semibold text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            You&apos;ve completed the entire seder. Yasher koach!
          </div>
        )}
      </div>

      {/* Seder roadmap */}
      <div className="p-5 sm:p-6">
        <ol className="relative">
          {perSeries.map((s, i) => {
            const isLast = i === perSeries.length - 1;
            return (
              <motion.li
                key={s.slug}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="relative flex gap-4 pb-5 last:pb-0"
              >
                {/* Rail + node */}
                <div className="relative flex flex-col items-center shrink-0">
                  <span
                    className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 transition-colors ${
                      s.status === "done"
                        ? "bg-primary border-primary text-navy"
                        : s.status === "current"
                        ? "bg-white border-primary text-primary ring-4 ring-primary/15"
                        : s.status === "started"
                        ? "bg-white border-primary/50 text-primary"
                        : "bg-white border-navy/15 text-navy/30"
                    }`}
                  >
                    {s.status === "done" ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <span className="text-sm font-bold">{i + 1}</span>
                    )}
                  </span>
                  {!isLast && (
                    <span className={`w-0.5 flex-1 mt-1 ${s.status === "done" ? "bg-primary/40" : "bg-navy/10"}`} />
                  )}
                </div>

                {/* Sefer card */}
                <Link
                  href={`/shiurim/${s.slug}`}
                  className={`flex-1 min-w-0 rounded-xl border p-4 transition-all hover:shadow-card-hover ${
                    s.isCurrent ? "border-primary/40 bg-primary/5" : "border-primary/12 bg-white hover:border-primary/25"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-bold text-navy truncate">{s.name}</h3>
                    <span
                      className={`shrink-0 text-[11px] font-semibold rounded-full px-2.5 py-0.5 ${
                        s.status === "done"
                          ? "bg-primary/15 text-primary-dark"
                          : s.status === "current"
                          ? "bg-primary text-white"
                          : s.status === "started"
                          ? "bg-navy/10 text-navy/70"
                          : "bg-navy/5 text-navy/40"
                      }`}
                    >
                      {s.status === "done" ? "Completed" : s.status === "current" ? "Up next" : s.status === "started" ? "In progress" : "Not started"}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-navy/8 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.pct}%` }} />
                    </div>
                    <span className="shrink-0 text-navy/45 text-xs tabular-nums">{s.completed}/{s.count}</span>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
