"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import {
  getAllProgress,
  getProgressPercentage,
  loadProgressFromFirestore,
} from "@/lib/progress";

interface SeriesInfo {
  slug: string;
  name: string;
  episodeCount: number;
}

interface SeriesWithProgress {
  slug: string;
  name: string;
  episodeCount: number;
  listenedCount: number;
  completedCount: number;
  lastListened: string;
  lastShiurProgress: number;
}

interface LearningStats {
  totalShiurim: number;
  completedShiurim: number;
  inProgressShiurim: number;
  seriesStarted: number;
  totalMinutes: number;
}

function computeData(allSeries: SeriesInfo[]) {
  const all = getAllProgress();
  const entries = Object.values(all).filter((p) => p.currentTime > 10);
  const completed = entries.filter((p) => p.completed);
  const inProgress = entries.filter((p) => !p.completed);
  const totalSeconds = entries.reduce((acc, p) => acc + (p.currentTime || 0), 0);

  const seriesMap = new Map<string, { listened: Set<string>; completed: Set<string>; lastListened: string; lastShiurId: string }>();
  for (const p of entries) {
    if (!p.seriesSlug) continue;
    const existing = seriesMap.get(p.seriesSlug);
    if (!existing) {
      seriesMap.set(p.seriesSlug, {
        listened: new Set([p.shiurId]),
        completed: p.completed ? new Set([p.shiurId]) : new Set(),
        lastListened: p.lastListened,
        lastShiurId: p.shiurId,
      });
    } else {
      existing.listened.add(p.shiurId);
      if (p.completed) existing.completed.add(p.shiurId);
      if (new Date(p.lastListened) > new Date(existing.lastListened)) {
        existing.lastListened = p.lastListened;
        existing.lastShiurId = p.shiurId;
      }
    }
  }

  const seriesProgress: SeriesWithProgress[] = [];
  for (const series of allSeries) {
    const data = seriesMap.get(series.slug);
    if (!data) continue;
    seriesProgress.push({
      slug: series.slug,
      name: series.name,
      episodeCount: series.episodeCount,
      listenedCount: data.listened.size,
      completedCount: data.completed.size,
      lastListened: data.lastListened,
      lastShiurProgress: getProgressPercentage(data.lastShiurId),
    });
  }
  seriesProgress.sort((a, b) => new Date(b.lastListened).getTime() - new Date(a.lastListened).getTime());

  const stats: LearningStats = {
    totalShiurim: entries.length,
    completedShiurim: completed.length,
    inProgressShiurim: inProgress.length,
    seriesStarted: seriesMap.size,
    totalMinutes: Math.round(totalSeconds / 60),
  };

  return { stats, seriesProgress };
}

function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function MyLearningClient({ allSeries }: { allSeries: SeriesInfo[] }) {
  const { user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [stats, setStats] = useState<LearningStats>({ totalShiurim: 0, completedShiurim: 0, inProgressShiurim: 0, seriesStarted: 0, totalMinutes: 0 });
  const [seriesProgress, setSeriesProgress] = useState<SeriesWithProgress[]>([]);
  const [ready, setReady] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Compute data from localStorage
  const refresh = useCallback(() => {
    const data = computeData(allSeries);
    setStats(data.stats);
    setSeriesProgress(data.seriesProgress);
  }, [allSeries]);

  // Load local progress immediately on mount — don't wait for auth
  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  // When auth resolves AND user is signed in, sync from Firestore then recompute
  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    setSyncing(true);
    loadProgressFromFirestore()
      .then(() => {
        if (!cancelled) refresh();
      })
      .catch(() => { })
      .finally(() => {
        if (!cancelled) setSyncing(false);
      });
    return () => { cancelled = true; };
  }, [authLoading, user, refresh]);

  // Show a minimal skeleton if we haven't even read localStorage yet (one frame at most)
  if (!ready) {
    return (
      <main className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          <p className="text-navy/60 mt-4">Loading…</p>
        </div>
      </main>
    );
  }

  const hasProgress = seriesProgress.length > 0;

  return (
    <main className="min-h-screen bg-bg-light">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {user ? `Welcome back${user.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}` : "My Learning"}
          </h1>
          <p className="text-white/80 text-lg">
            {user ? "Continue your Torah learning journey" : "Track your Torah learning journey"}
          </p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Sign-in prompt (non-blocking) */}
          {!user && !authLoading && (
            <div className="mb-8 bg-white border border-primary/20 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="text-navy font-semibold">Sign in to sync your progress across devices</p>
                <p className="text-navy/50 text-sm mt-1">Your progress is saved locally — sign in to keep it in the cloud too</p>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="shrink-0 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-light transition-colors shadow-sm"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Syncing indicator */}
          {syncing && (
            <div className="mb-4 flex items-center gap-2 text-navy/50 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              Syncing your progress…
            </div>
          )}

          {!hasProgress ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-navy mb-2">Start Your Learning Journey</h2>
              <p className="text-navy/60 mb-6">You haven&apos;t started any shiurim yet. Browse our library to begin!</p>
              <Link href="/shiurim" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-light transition-colors">Browse Shiurim</Link>
            </div>
          ) : (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                {[
                  { label: "Shiurim Started", value: stats.totalShiurim },
                  { label: "Completed", value: stats.completedShiurim },
                  { label: "In Progress", value: stats.inProgressShiurim },
                  { label: "Series", value: stats.seriesStarted },
                  { label: "Time Listened", value: formatMinutes(stats.totalMinutes) },
                ].map((item) => (
                  <div key={item.label} className="bg-white border border-primary/15 rounded-xl p-4 text-center shadow-sm">
                    <p className="text-navy text-2xl font-bold">{item.value}</p>
                    <p className="text-navy/50 text-xs mt-1">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Series Progress Cards */}
              <h2 className="text-navy font-bold text-2xl mb-6">Continue Learning</h2>
              <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="space-y-4">
                {seriesProgress.map((s) => {
                  const pct = Math.round((s.completedCount / s.episodeCount) * 100);
                  return (
                    <motion.div key={s.slug} variants={fadeUp}>
                      <Link href={`/shiurim/${s.slug}`}
                        className="block bg-white border border-primary/15 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-navy font-bold text-xl group-hover:text-primary transition-colors">{s.name}</h3>
                            <p className="text-navy/50 text-sm mt-1">
                              <span className="font-semibold text-navy/70">{s.completedCount}</span> / {s.episodeCount} shiurim completed
                              <span className="text-navy/30 mx-2">&middot;</span>
                              Last listened {formatRelativeTime(s.lastListened)}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold rounded-xl px-5 py-2.5 shrink-0 shadow-sm group-hover:bg-primary-light transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            Continue
                          </span>
                        </div>
                        <div className="h-2.5 bg-navy/8 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-navy/40 text-xs">{pct}% complete</p>
                          {s.lastShiurProgress > 0 && s.lastShiurProgress < 100 && (
                            <p className="text-primary text-xs font-medium">Current shiur: {s.lastShiurProgress}% listened</p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Browse More */}
              <div className="mt-10 text-center">
                <Link href="/shiurim" className="inline-flex items-center gap-2 border-2 border-primary/30 text-navy px-8 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Browse More Shiurim
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </main>
  );
}
