"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import { useAudioPlayer } from "@/components/shiurim/AudioPlayerProvider";
import ContinueLearningHero from "@/components/shiurim/ContinueLearningHero";
import TanachJourney, { type TanachJourneyProps } from "@/components/shiurim/TanachJourney";
import {
  getAllProgress,
  getProgressPercentage,
  loadProgressFromFirestore,
} from "@/lib/progress";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SeriesInfo {
  slug: string;
  name: string;
  episodeCount: number;
  group: string | null;
}

interface GroupInfo {
  id: string;
  label: string;
}

interface SeriesWithProgress {
  slug: string;
  name: string;
  episodeCount: number;
  listenedCount: number;
  completedCount: number;
  lastListened: string;
  lastShiurProgress: number;
  lastShiurTitle: string;
  group: string | null;
}

interface GroupedSeriesCard {
  slug: string;
  name: string;
  episodeCount: number;
  listenedCount: number;
  completedCount: number;
  lastListened: string;
  lastShiurProgress: number;
  lastShiurTitle: string;
  isGroup: boolean;
}

interface RecentShiur {
  shiurId: string;
  title: string;
  audioUrl: string;
  seriesSlug: string;
  seriesName: string;
  progress: number;
  currentTime: number;
  duration: number;
  lastListened: string;
  completed: boolean;
}

interface LearningStats {
  totalShiurim: number;
  completedShiurim: number;
  inProgressShiurim: number;
  seriesStarted: number;
  totalMinutes: number;
  streak: number;
}

type TabId = "all" | "in-progress" | "completed" | "series";
type SortBy = "recent" | "title" | "progress-desc" | "progress-asc";

const SORT_OPTIONS: { id: SortBy; label: string }[] = [
  { id: "recent", label: "Recently played" },
  { id: "progress-desc", label: "Closest to done" },
  { id: "progress-asc", label: "Just started" },
  { id: "title", label: "Title (A–Z)" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function computeStreak(entries: { lastListened: string }[]): number {
  if (entries.length === 0) return 0;
  const days = new Set<string>();
  for (const e of entries) {
    days.add(new Date(e.lastListened).toLocaleDateString("en-US"));
  }
  const sorted = Array.from(days)
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (sorted[0]?.getTime() !== today.getTime() && sorted[0]?.getTime() !== yesterday.getTime()) {
    return 0;
  }

  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(sorted[0]);
    expected.setDate(expected.getDate() - i);
    if (sorted[i].getTime() === expected.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function buildRecentShiur(
  p: ReturnType<typeof getAllProgress>[string],
  allSeries: SeriesInfo[],
  groupMap: Map<string, GroupInfo>,
  shiurLookup: Record<string, { title: string; audioUrl: string }>
): RecentShiur {
  const seriesInfo = allSeries.find((s) => s.slug === p.seriesSlug);
  let seriesName = seriesInfo?.name || "";
  if (seriesInfo?.group) {
    const g = groupMap.get(seriesInfo.group);
    if (g) seriesName = `${g.label} — ${seriesName}`;
  }
  const looked = shiurLookup[p.shiurId];
  const title = p.title || looked?.title || "";
  const audioUrl = p.audioUrl || looked?.audioUrl || "";
  return {
    shiurId: p.shiurId,
    title,
    audioUrl,
    seriesSlug: p.seriesSlug || "",
    seriesName,
    progress: p.duration > 0 ? Math.min(100, Math.round((p.currentTime / p.duration) * 100)) : 0,
    currentTime: p.currentTime,
    duration: p.duration,
    lastListened: p.lastListened,
    completed: p.completed,
  };
}

function computeData(
  allSeries: SeriesInfo[],
  groups: GroupInfo[],
  shiurLookup: Record<string, { title: string; audioUrl: string }>
) {
  const all = getAllProgress();
  const entries = Object.values(all).filter((p) => p.currentTime > 10);
  const completed = entries.filter((p) => p.completed);
  const inProgress = entries.filter((p) => !p.completed);
  const totalSeconds = entries.reduce((acc, p) => acc + (p.currentTime || 0), 0);

  const groupMap = new Map<string, GroupInfo>();
  for (const g of groups) groupMap.set(g.id, g);

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
    const progressEntry = all[data.lastShiurId];
    const lastShiurTitle =
      progressEntry?.title ||
      shiurLookup[data.lastShiurId]?.title ||
      "";
    seriesProgress.push({
      slug: series.slug,
      name: series.name,
      episodeCount: series.episodeCount,
      listenedCount: data.listened.size,
      completedCount: data.completed.size,
      lastListened: data.lastListened,
      lastShiurProgress: getProgressPercentage(data.lastShiurId),
      lastShiurTitle,
      group: series.group,
    });
  }

  // Consolidate grouped series into cards
  const groupBuckets = new Map<string, SeriesWithProgress[]>();
  const ungrouped: SeriesWithProgress[] = [];

  for (const sp of seriesProgress) {
    if (sp.group && groupMap.has(sp.group)) {
      const bucket = groupBuckets.get(sp.group) || [];
      bucket.push(sp);
      groupBuckets.set(sp.group, bucket);
    } else {
      ungrouped.push(sp);
    }
  }

  const cards: GroupedSeriesCard[] = [];

  for (const [groupId, bucket] of groupBuckets) {
    const gInfo = groupMap.get(groupId)!;
    const totalEp = bucket.reduce((a, s) => a + s.episodeCount, 0);
    const totalListened = bucket.reduce((a, s) => a + s.listenedCount, 0);
    const totalCompleted = bucket.reduce((a, s) => a + s.completedCount, 0);
    const latest = bucket.reduce((a, s) => (new Date(s.lastListened) > new Date(a) ? s.lastListened : a), bucket[0].lastListened);
    const latestSeries = bucket.reduce((best, s) => (new Date(s.lastListened) > new Date(best.lastListened) ? s : best), bucket[0]);

    cards.push({
      slug: groupId,
      name: gInfo.label,
      episodeCount: totalEp,
      listenedCount: totalListened,
      completedCount: totalCompleted,
      lastListened: latest,
      lastShiurProgress: latestSeries.lastShiurProgress,
      lastShiurTitle: latestSeries.lastShiurTitle,
      isGroup: true,
    });
  }

  for (const sp of ungrouped) {
    cards.push({
      slug: sp.slug,
      name: sp.name,
      episodeCount: sp.episodeCount,
      listenedCount: sp.listenedCount,
      completedCount: sp.completedCount,
      lastListened: sp.lastListened,
      lastShiurProgress: sp.lastShiurProgress,
      lastShiurTitle: sp.lastShiurTitle,
      isGroup: false,
    });
  }

  cards.sort((a, b) => new Date(b.lastListened).getTime() - new Date(a.lastListened).getTime());

  // All enriched shiurim sorted by lastListened (used for tab lists)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.lastListened).getTime() - new Date(a.lastListened).getTime()
  );
  const allShiurimList: RecentShiur[] = sortedEntries.map((p) =>
    buildRecentShiur(p, allSeries, groupMap, shiurLookup)
  );

  // Top 8 for "Recently Played"
  const recentShiurim = allShiurimList.slice(0, 8);

  const streak = computeStreak(entries);

  const stats: LearningStats = {
    totalShiurim: entries.length,
    completedShiurim: completed.length,
    inProgressShiurim: inProgress.length,
    seriesStarted: seriesMap.size,
    totalMinutes: Math.round(totalSeconds / 60),
    streak,
  };

  return { stats, cards, recentShiurim, allShiurimList };
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All Shiurim" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "series", label: "By Series" },
];

/* ------------------------------------------------------------------ */
/*  Shiur card (reusable inside this file)                            */
/* ------------------------------------------------------------------ */

function ShiurListCard({
  rs,
  isCurrentlyPlaying,
  isCurrent,
  onPlay,
}: {
  rs: RecentShiur;
  isCurrentlyPlaying: boolean;
  isCurrent: boolean;
  onPlay: () => void;
}) {
  return (
    <div
      className={`bg-white border rounded-xl p-4 shadow-sm transition-all ${
        isCurrent
          ? "border-primary/40 ring-1 ring-primary/20"
          : "border-primary/15 hover:border-primary/30 hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Play/Pause button */}
        <button
          onClick={onPlay}
          disabled={!rs.audioUrl}
          aria-label={isCurrentlyPlaying ? "Pause" : rs.completed ? "Replay" : "Resume"}
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: rs.completed
              ? "linear-gradient(145deg,#22c55e,#16a34a)"
              : "linear-gradient(145deg,#D0B055,#A88530)",
            boxShadow: isCurrentlyPlaying
              ? "0 0 0 4px rgba(196,162,69,0.22)"
              : "0 4px 14px rgba(168,133,48,0.35)",
          }}
        >
          {rs.completed ? (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : isCurrentlyPlaying ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="5.5" y="4" width="4" height="16" rx="1.5" />
              <rect x="14.5" y="4" width="4" height="16" rx="1.5" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white translate-x-px" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-navy font-semibold text-sm leading-tight line-clamp-2">{rs.title}</p>
          {rs.seriesName && (
            <p className="text-navy/40 text-xs mt-0.5 truncate">{rs.seriesName}</p>
          )}
        </div>

        {/* Progress badge + time */}
        <div className="shrink-0 text-right">
          <p className={`text-xs font-semibold ${rs.completed ? "text-green-500" : "text-primary"}`}>
            {rs.completed ? "Done" : `${rs.progress}%`}
          </p>
          <p className="text-navy/30 text-[10px] mt-0.5">{formatRelativeTime(rs.lastListened)}</p>
        </div>
      </div>

      {/* Progress bar */}
      {!rs.completed && rs.progress > 0 && (
        <div className="mt-3 h-1 bg-navy/8 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${rs.progress}%`, background: "linear-gradient(90deg,#C4A245,#D0B055)" }}
          />
        </div>
      )}

      {/* Series link */}
      {rs.seriesSlug && (
        <div className="mt-2 flex justify-end">
          <Link
            href={`/shiurim/${rs.seriesSlug}`}
            className="text-navy/30 text-[10px] hover:text-primary transition-colors"
          >
            Go to series →
          </Link>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MyLearningClient({
  allSeries,
  groups,
  shiurLookup,
  track,
}: {
  allSeries: SeriesInfo[];
  groups: GroupInfo[];
  shiurLookup: Record<string, { title: string; audioUrl: string }>;
  track: Omit<TanachJourneyProps, never> | null;
}) {
  const { user, loading: authLoading } = useAuth();
  const { playShiur, playerState } = useAudioPlayer();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [query, setQuery] = useState("");

  const seriesNames = useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of allSeries) m[s.slug] = s.name;
    return m;
  }, [allSeries]);
  const [stats, setStats] = useState<LearningStats>({
    totalShiurim: 0, completedShiurim: 0, inProgressShiurim: 0,
    seriesStarted: 0, totalMinutes: 0, streak: 0,
  });
  const [cards, setCards] = useState<GroupedSeriesCard[]>([]);
  const [recentShiurim, setRecentShiurim] = useState<RecentShiur[]>([]);
  const [allShiurimList, setAllShiurimList] = useState<RecentShiur[]>([]);
  const [ready, setReady] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const tabSectionRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    const data = computeData(allSeries, groups, shiurLookup);
    setStats(data.stats);
    setCards(data.cards);
    setRecentShiurim(data.recentShiurim);
    setAllShiurimList(data.allShiurimList);
  }, [allSeries, groups, shiurLookup]);

  useEffect(() => {
    refresh();
    setReady(true);
  }, [refresh]);

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    setSyncing(true);
    loadProgressFromFirestore()
      .then(() => { if (!cancelled) refresh(); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setSyncing(false); });
    return () => { cancelled = true; };
  }, [authLoading, user, refresh]);

  // Click stat box → set tab + scroll to tab section
  const handleStatClick = (tab: TabId) => {
    setActiveTab(tab);
    setTimeout(() => {
      tabSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const filteredShiurim = useMemo(() => {
    let list =
      activeTab === "in-progress"
        ? allShiurimList.filter((s) => !s.completed)
        : activeTab === "completed"
        ? allShiurimList.filter((s) => s.completed)
        : allShiurimList; // "all"

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) => s.title.toLowerCase().includes(q) || s.seriesName.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    switch (sortBy) {
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "progress-desc":
        sorted.sort((a, b) => b.progress - a.progress);
        break;
      case "progress-asc":
        sorted.sort((a, b) => a.progress - b.progress);
        break;
      default: // "recent" — already lastListened desc from allShiurimList
        sorted.sort((a, b) => new Date(b.lastListened).getTime() - new Date(a.lastListened).getTime());
    }
    return sorted;
  }, [allShiurimList, activeTab, sortBy, query]);

  const filteredCards = useMemo(() => {
    return cards; // series tab always shows all series
  }, [cards]);

  function handlePlay(rs: RecentShiur) {
    if (!rs.audioUrl) return;
    playShiur(
      {
        id: rs.shiurId,
        title: rs.title,
        audioUrl: rs.audioUrl,
        duration: rs.duration ? new Date(rs.duration * 1000).toISOString().substr(11, 8) : "0:00",
        durationSeconds: rs.duration,
        pubDate: rs.lastListened,
        description: "",
        link: "",
        categoryId: "",
      },
      false,
      rs.seriesSlug || undefined,
      null
    );
  }

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

  const hasProgress = allShiurimList.length > 0;

  return (
    <main className="min-h-screen bg-bg-light">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy-light text-white pt-16 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="serif-heading text-4xl md:text-5xl font-bold mb-4">
            {user ? `Welcome back${user.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}` : "My Learning"}
          </h1>
          <p className="text-white/80 text-lg">
            {user ? "Pick up exactly where you left off" : "Track your Torah learning journey"}
          </p>
        </div>
      </section>

      {/* Continue where you left off — overlaps the hero */}
      <ContinueLearningHero seriesNames={seriesNames} />

      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Sign-in prompt */}
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

          {syncing && (
            <div className="mb-4 flex items-center gap-2 text-navy/50 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
              Syncing your progress…
            </div>
          )}

          {/* Your Tanach Journey — the Navi seder, in order */}
          {track && (
            <div className="mb-12">
              <TanachJourney {...track} />
            </div>
          )}

          {!hasProgress ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-navy mb-2">Start Your Learning Journey</h2>
              <p className="text-navy/60 mb-6">You haven&apos;t started any shiurim yet. Browse our library to begin!</p>
              <Link href="/shiurim" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-light transition-colors">
                Browse Shiurim
              </Link>
            </div>
          ) : (
            <>
              {/* ── Stats (clickable) ── */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                {[
                  { label: "Shiurim Started", value: stats.totalShiurim, tab: "all" as TabId },
                  { label: "Completed", value: stats.completedShiurim, tab: "completed" as TabId },
                  { label: "In Progress", value: stats.inProgressShiurim, tab: "in-progress" as TabId },
                  { label: "Series", value: stats.seriesStarted, tab: "series" as TabId },
                  { label: "Time Listened", value: formatMinutes(stats.totalMinutes), tab: "all" as TabId },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleStatClick(item.tab)}
                    className={`bg-white border rounded-xl p-4 text-center shadow-sm transition-all hover:shadow-md hover:border-primary/30 cursor-pointer ${
                      activeTab === item.tab ? "border-primary/40 ring-1 ring-primary/20" : "border-primary/15"
                    }`}
                  >
                    <p className="text-navy text-2xl font-bold">{item.value}</p>
                    <p className="text-navy/50 text-xs mt-1">{item.label}</p>
                  </button>
                ))}
              </div>

              {/* ── Recently Played ── */}
              {recentShiurim.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-navy font-bold text-xl mb-4">Recently Played</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {recentShiurim.map((rs) => (
                      <ShiurListCard
                        key={rs.shiurId}
                        rs={rs}
                        isCurrentlyPlaying={playerState.currentShiur?.id === rs.shiurId && playerState.isPlaying}
                        isCurrent={playerState.currentShiur?.id === rs.shiurId}
                        onPlay={() => handlePlay(rs)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ── Tabs + filtered content ── */}
              <div ref={tabSectionRef} className="scroll-mt-6">
                <div className="flex gap-1 mb-6 border-b border-navy/10 overflow-x-auto">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                        activeTab === tab.id ? "text-primary" : "text-navy/40 hover:text-navy/70"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Sort + search row (find the shiur you're on) */}
                {activeTab !== "series" && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                    <div className="relative flex-1">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                      </svg>
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Find a shiur in your learning…"
                        className="w-full bg-white border border-primary/15 rounded-xl pl-9 pr-3 py-2.5 text-sm text-navy placeholder:text-navy/35 shadow-sm focus:border-primary/40 transition-colors"
                      />
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-navy/50 text-sm">Sort</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortBy)}
                        className="bg-white border border-primary/15 rounded-xl px-3 py-2.5 text-sm font-medium text-navy shadow-sm focus:border-primary/40 transition-colors cursor-pointer"
                      >
                        {SORT_OPTIONS.map((o) => (
                          <option key={o.id} value={o.id}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Individual shiurim list (All / In Progress / Completed) */}
                {activeTab !== "series" && (
                  filteredShiurim.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-navy/40 text-lg">
                        {query.trim()
                          ? `No shiurim match “${query.trim()}”.`
                          : activeTab === "completed"
                          ? "Keep going! You haven't finished a shiur yet."
                          : activeTab === "in-progress"
                          ? "No shiurim in progress right now."
                          : "No shiurim to show."}
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      key={activeTab}
                      initial="hidden"
                      animate="visible"
                      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      {filteredShiurim.map((rs) => (
                        <motion.div key={rs.shiurId} variants={fadeUp}>
                          <ShiurListCard
                            rs={rs}
                            isCurrentlyPlaying={playerState.currentShiur?.id === rs.shiurId && playerState.isPlaying}
                            isCurrent={playerState.currentShiur?.id === rs.shiurId}
                            onPlay={() => handlePlay(rs)}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )
                )}

                {/* Series tab */}
                {activeTab === "series" && (
                  filteredCards.length === 0 ? (
                    <div className="text-center py-16">
                      <p className="text-navy/40 text-lg">No series started yet.</p>
                    </div>
                  ) : (
                    <motion.div
                      key="series"
                      initial="hidden"
                      animate="visible"
                      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
                      className="space-y-4"
                    >
                      {filteredCards.map((s) => {
                        const pct = s.episodeCount > 0 ? Math.round((s.completedCount / s.episodeCount) * 100) : 0;
                        return (
                          <motion.div key={s.slug} variants={fadeUp}>
                            <Link
                              href={`/shiurim/${s.slug}`}
                              className="block bg-white border border-primary/15 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
                            >
                              <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-navy font-bold text-xl group-hover:text-primary transition-colors">{s.name}</h3>
                                  {s.lastShiurTitle && (
                                    <p className="text-primary/80 text-sm font-medium mt-0.5 truncate">
                                      ↩ {s.lastShiurTitle}
                                    </p>
                                  )}
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
                  )
                )}
              </div>

              {/* Browse More */}
              <div className="mt-10 text-center">
                <Link
                  href="/shiurim"
                  className="inline-flex items-center gap-2 border-2 border-primary/30 text-navy px-8 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-colors"
                >
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
