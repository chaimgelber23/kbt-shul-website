"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { updateProfile } from "firebase/auth";

export default function ProfileClient() {
  const { user, loading: authLoading, signOut, resetPassword } = useAuth();
  const router = useRouter();
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);

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
    router.push("/");
    return null;
  }

  const initials = (user.displayName || user.email || "U")
    .split(/[\s@]/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  const handleSaveName = async () => {
    if (!user || !displayName.trim()) return;
    setSavingName(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      setEditingName(false);
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
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

  return (
    <main className="min-h-screen bg-bg-light">
      {/* Header */}
      <section className="bg-gradient-to-br from-navy to-navy-light text-white py-16 px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-6">
          <div className="w-20 h-20 bg-primary/30 rounded-full flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-primary">{initials}</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-1">
              {user.displayName || "My Account"}
            </h1>
            <p className="text-white/60 text-sm">{user.email}</p>
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Quick Link to My Learning */}
          <Link href="/my-learning"
            className="flex items-center gap-4 bg-white border border-primary/15 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-navy font-bold group-hover:text-primary transition-colors">My Learning</p>
              <p className="text-navy/50 text-sm">View your progress and continue learning</p>
            </div>
            <svg className="w-5 h-5 text-navy/30 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Account Details */}
          <div>
            <h2 className="text-navy font-bold text-xl mb-4">Account Details</h2>
            <div className="bg-white border border-primary/15 rounded-xl shadow-sm divide-y divide-primary/10">
              <div className="p-5">
                <p className="text-navy/50 text-xs font-medium uppercase tracking-wider mb-1">Email</p>
                <p className="text-navy font-medium">{user.email}</p>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-navy/50 text-xs font-medium uppercase tracking-wider">Display Name</p>
                  {!editingName && <button onClick={() => setEditingName(true)} className="text-primary text-sm font-medium hover:text-primary-light transition-colors">Edit</button>}
                </div>
                {editingName ? (
                  <div className="flex items-center gap-3 mt-2">
                    <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-navy/20 rounded-lg text-navy focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Your name" autoFocus />
                    <button onClick={handleSaveName} disabled={savingName}
                      className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50">{savingName ? "Saving..." : "Save"}</button>
                    <button onClick={() => { setEditingName(false); setDisplayName(user.displayName || ""); }}
                      className="px-3 py-2 text-navy/50 text-sm font-medium hover:text-navy transition-colors">Cancel</button>
                  </div>
                ) : (
                  <p className="text-navy font-medium">{user.displayName || <span className="text-navy/30 italic">Not set</span>}</p>
                )}
                {nameSuccess && <p className="text-green-600 text-sm mt-2">Name updated successfully</p>}
              </div>
              <div className="p-5">
                <p className="text-navy/50 text-xs font-medium uppercase tracking-wider mb-1">Member Since</p>
                <p className="text-navy font-medium">
                  {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Unknown"}
                </p>
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <h2 className="text-navy font-bold text-xl mb-4">Security</h2>
            <div className="bg-white border border-primary/15 rounded-xl shadow-sm p-5">
              {resetSent && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">Password reset email sent! Check your inbox.</div>}
              <div className="flex items-center justify-between">
                <div><p className="text-navy font-medium">Password</p><p className="text-navy/50 text-sm">Send a reset email to change your password</p></div>
                <button onClick={handleResetPassword} className="px-4 py-2 text-primary text-sm font-semibold hover:text-primary-light transition-colors">Send Reset Email</button>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="pt-4">
            <button onClick={handleSignOut}
              className="w-full py-3 border-2 border-navy/15 text-navy/60 font-semibold rounded-xl hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all">
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
