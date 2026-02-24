"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import {
  getAllProgress,
  getSeriesProgress,
  getProgressPercentage,
  type ShiurProgress,
  type SeriesProgress,
} from "@/lib/progress";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

interface SeriesWithProgress {
  seriesSlug: string;
  seriesName: string;
  lastListened: string;
  totalListened: number;
  lastShiurTitle: string;
  lastShiurId: string;
  progressPercent: number;
}

export default function MyLearningClient() {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const [inProgressSeries, setInProgressSeries] = useState<SeriesWithProgress[]>([]);
  const [recentShiurim, setRecentShiurim] = useState<ShiurProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all progress from localStorage
    const allProgress = getAllProgress();
    const progressArray = Object.values(allProgress);

    // Filter for in-progress (not completed)
    const inProgress = progressArray.filter((p) => !p.completed && p.currentTime > 10);

    // Sort by last listened
    const recent = inProgress
      .sort((a, b) => new Date(b.lastListened).getTime() - new Date(a.lastListened).getTime())
      .slice(0, 10);

    setRecentShiurim(recent);

    // Group by series
    const seriesMap = new Map<string, SeriesWithProgress>();

    inProgress.forEach((progress) => {
      if (!progress.seriesSlug) return;

      const existing = seriesMap.get(progress.seriesSlug);
      if (!existing || new Date(progress.lastListened) > new Date(existing.lastListened)) {
        // This is a placeholder - in a real app, you'd fetch the shiur details
        seriesMap.set(progress.seriesSlug, {
          seriesSlug: progress.seriesSlug,
          seriesName: formatSeriesName(progress.seriesSlug),
          lastListened: progress.lastListened,
          totalListened: 1, // Would come from series progress
          lastShiurTitle: "Shiur", // Would fetch from API
          lastShiurId: progress.shiurId,
          progressPercent: getProgressPercentage(progress.shiurId),
        });
      }
    });

    // Get series progress for accurate counts
    Array.from(seriesMap.keys()).forEach((slug) => {
      const seriesProgress = getSeriesProgress(slug);
      if (seriesProgress) {
        const current = seriesMap.get(slug)!;
        seriesMap.set(slug, {
          ...current,
          totalListened: seriesProgress.totalListened,
        });
      }
    });

    setInProgressSeries(
      Array.from(seriesMap.values()).sort(
        (a, b) => new Date(b.lastListened).getTime() - new Date(a.lastListened).getTime()
      )
    );

    setLoading(false);
  }, []);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <main className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-navy/60 mt-4">Loading...</p>
        </div>
      </main>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <main className="min-h-screen bg-bg-light py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-navy mb-4">My Learning</h1>
            <p className="text-navy/60 text-lg mb-8">
              Sign in to keep your place and track your shiurim across all devices
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-primary/15">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-navy font-bold text-lg mb-2">Keep Your Place</h3>
              <p className="text-navy/60 text-sm">
                Pick up exactly where you left off in every shiur, on any device
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-primary/15">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-navy font-bold text-lg mb-2">Track Progress</h3>
              <p className="text-navy/60 text-sm">
                See your learning history and how many shiurim you've completed
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-primary/15">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-navy font-bold text-lg mb-2">Sync Across Devices</h3>
              <p className="text-navy/60 text-sm">
                Start on your phone, continue on your computer, seamlessly
              </p>
            </div>
          </div>

          {/* Sign in button */}
          <div className="text-center">
            <button
              onClick={() => signInWithGoogle()}
              className="inline-flex items-center gap-3 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-light transition-colors shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
            <p className="text-navy/40 text-sm mt-4">
              Your progress is saved locally and synced when you sign in
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-light">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, {user.displayName?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-white/80 text-lg">
            Continue your Torah learning journey
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="text-navy/60 mt-4">Loading your progress...</p>
            </div>
          ) : inProgressSeries.length === 0 && recentShiurim.length === 0 ? (
            <div className="text-center py-20">
              <svg
                className="w-20 h-20 text-navy/20 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h2 className="text-2xl font-bold text-navy mb-2">Start Your Learning Journey</h2>
              <p className="text-navy/60 mb-6">
                You haven't started any shiurim yet. Browse our collection to begin.
              </p>
              <Link
                href="/shiurim"
                className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-light transition-colors"
              >
                Browse Shiurim
              </Link>
            </div>
          ) : (
            <>
              {/* In Progress Series */}
              {inProgressSeries.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-navy mb-6">Continue Learning</h2>
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {inProgressSeries.map((series) => (
                      <motion.div key={series.seriesSlug} variants={fadeUp}>
                        <Link
                          href={`/shiurim/${series.seriesSlug}`}
                          className="block bg-white border border-primary/15 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <h3 className="text-navy font-bold text-xl group-hover:text-primary transition-colors mb-1">
                                {series.seriesName}
                              </h3>
                              <p className="text-navy/50 text-sm">
                                {series.totalListened} shiur{series.totalListened !== 1 ? "im" : ""} listened
                              </p>
                            </div>
                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold rounded-full px-3 py-1.5 shrink-0">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                              Resume
                            </span>
                          </div>

                          {/* Progress bar */}
                          {series.progressPercent > 0 && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-navy/60 mb-1.5">
                                <span>Last shiur progress</span>
                                <span>{series.progressPercent}%</span>
                              </div>
                              <div className="h-2 bg-navy/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${series.progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-navy/40 pt-3 border-t border-primary/10">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Last listened: {formatRelativeTime(series.lastListened)}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* Recent Activity - commented out for now since we don't have shiur titles
              {recentShiurim.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-6">Recent Activity</h2>
                  <div className="bg-white rounded-xl border border-primary/15 overflow-hidden">
                    {recentShiurim.map((shiur, index) => (
                      <div
                        key={shiur.shiurId}
                        className={`p-4 hover:bg-primary/5 transition-colors ${
                          index !== recentShiurim.length - 1 ? "border-b border-primary/10" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-navy font-semibold text-sm">
                              {shiur.seriesSlug ? formatSeriesName(shiur.seriesSlug) : "Shiur"}
                            </p>
                            <p className="text-navy/40 text-xs mt-0.5">
                              {formatRelativeTime(shiur.lastListened)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-primary font-semibold text-sm">
                              {getProgressPercentage(shiur.shiurId)}%
                            </p>
                            <p className="text-navy/40 text-xs">
                              {shiur.completed ? "Completed" : "In Progress"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              */}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

// Helper functions
function formatSeriesName(slug: string): string {
  // Convert slug to readable name
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
