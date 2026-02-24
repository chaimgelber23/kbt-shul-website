"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import AuthModal from "@/components/AuthModal";
import { updateProfile } from "firebase/auth";
import { getAllProgress, type ShiurProgress } from "@/lib/progress";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface LearningStats {
  totalListened: number;
  completed: number;
  inProgress: number;
  totalMinutes: number;
  seriesCount: number;
  lastActive: string | null;
}

function computeStats(progress: Record<string, ShiurProgress>): LearningStats {
  const entries = Object.values(progress);
  const started = entries.filter((p) => p.currentTime > 10);
  const completed = started.filter((p) => p.completed);
  const inProgress = started.filter((p) => !p.completed);
  const totalSeconds = started.reduce((sum, p) => sum + p.currentTime, 0);
  const seriesSlugs = new Set(started.filter((p) => p.seriesSlug).map((p) => p.seriesSlug));

  let lastActive: string | null = null;
  if (started.length > 0) {
    lastActive = started.reduce((latest, p) =>
      new Date(p.lastListened) > new Date(latest.lastListened) ? p : latest
    ).lastListened;
  }

  return {
    totalListened: started.length,
    completed: completed.length,
    inProgress: inProgress.length,
    totalMinutes: Math.round(totalSeconds / 60),
    seriesCount: seriesSlugs.size,
    lastActive,
  };
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ProfileClient() {
  const { user, loading: authLoading, signOut, resetPassword } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [stats, setStats] = useState<LearningStats | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    const progress = getAllProgress();
    setStats(computeStats(progress));
  }, []);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user?.displayName]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-bg-light flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-bg-light py-20">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-navy mb-3">My Profile</h1>
          <p className="text-navy/60 mb-8">Sign in to view your profile and learning stats</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-light transition-colors"
          >
            Sign In
          </button>
          <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
      </main>
    );
  }

  const handleSaveName = async () => {
    if (!user || !displayName.trim()) return;
    setSavingName(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      setEditingName(false);
    } catch (err) {
      console.error("Failed to update name:", err);
    } finally {
      setSavingName(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
    } catch (err) {
      console.error("Failed to send reset email:", err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const initials = (user.displayName || user.email || "U")
    .split(/[\s@]/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  return (
    <main className="min-h-screen bg-bg-light">
      {/* Header */}
      <section className="bg-gradient-to-br from-navy to-navy-light text-white py-16 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 bg-primary/30 rounded-full flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-primary">{initials}</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">
              {user.displayName || "My Profile"}
            </h1>
            <p className="text-white/60 text-sm">{user.email}</p>
            {user.metadata.creationTime && (
              <p className="text-white/40 text-xs mt-1">
                Member since {formatDate(user.metadata.creationTime)}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Learning Stats */}
          {stats && stats.totalListened > 0 && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <h2 className="text-xl font-bold text-navy mb-4">Learning Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-primary/15 text-center">
                  <p className="text-3xl font-bold text-primary">{stats.totalListened}</p>
                  <p className="text-navy/50 text-sm mt-1">Shiurim Started</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-primary/15 text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                  <p className="text-navy/50 text-sm mt-1">Completed</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-primary/15 text-center">
                  <p className="text-3xl font-bold text-navy">{formatMinutes(stats.totalMinutes)}</p>
                  <p className="text-navy/50 text-sm mt-1">Time Listened</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-primary/15 text-center">
                  <p className="text-3xl font-bold text-navy">{stats.seriesCount}</p>
                  <p className="text-navy/50 text-sm mt-1">Series Explored</p>
                </div>
              </div>
              {stats.lastActive && (
                <p className="text-navy/40 text-xs mt-3">
                  Last active: {formatDate(stats.lastActive)}
                </p>
              )}
            </motion.div>
          )}

          {/* Quick Links */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h2 className="text-xl font-bold text-navy mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/my-learning"
                className="flex items-center gap-4 bg-white rounded-xl p-5 border border-primary/15 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-navy group-hover:text-primary transition-colors">My Learning</p>
                  <p className="text-navy/50 text-sm">Continue where you left off</p>
                </div>
              </Link>
              <Link
                href="/shiurim"
                className="flex items-center gap-4 bg-white rounded-xl p-5 border border-primary/15 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-navy group-hover:text-primary transition-colors">Browse Shiurim</p>
                  <p className="text-navy/50 text-sm">Explore all 30+ series</p>
                </div>
              </Link>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <h2 className="text-xl font-bold text-navy mb-4">Account Settings</h2>
            <div className="bg-white rounded-xl border border-primary/15 divide-y divide-primary/10">
              {/* Display Name */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-navy font-semibold text-sm">Display Name</p>
                    {editingName ? (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="px-3 py-1.5 border border-navy/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Your name"
                        />
                        <button
                          onClick={handleSaveName}
                          disabled={savingName}
                          className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg font-semibold hover:bg-primary-light disabled:opacity-50"
                        >
                          {savingName ? "..." : "Save"}
                        </button>
                        <button
                          onClick={() => {
                            setEditingName(false);
                            setDisplayName(user.displayName || "");
                          }}
                          className="px-3 py-1.5 text-navy/50 text-sm hover:text-navy"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="text-navy/50 text-sm mt-0.5">
                        {user.displayName || "Not set"}
                      </p>
                    )}
                  </div>
                  {!editingName && (
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-primary text-sm font-semibold hover:text-primary-light"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="p-5">
                <p className="text-navy font-semibold text-sm">Email</p>
                <p className="text-navy/50 text-sm mt-0.5">{user.email}</p>
              </div>

              {/* Password */}
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-navy font-semibold text-sm">Password</p>
                    <p className="text-navy/50 text-sm mt-0.5">••••••••</p>
                  </div>
                  <button
                    onClick={handleResetPassword}
                    className="text-primary text-sm font-semibold hover:text-primary-light"
                  >
                    {resetSent ? "Email Sent!" : "Reset"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sign Out */}
          <div className="pt-4 pb-8">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold text-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
