"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "reset") {
        await resetPassword(email);
        setResetSent(true);
        setTimeout(() => {
          setMode("signin");
          setResetSent(false);
          onClose();
        }, 3000);
      } else if (mode === "signup") {
        await signUp(email, password);
        onClose();
      } else {
        await signIn(email, password);
        onClose();
      }
    } catch (err: any) {
      const errorMessage = err?.message || "An error occurred";
      if (errorMessage.includes("auth/invalid-email")) {
        setError("Invalid email address");
      } else if (errorMessage.includes("auth/user-not-found")) {
        setError("No account found with this email");
      } else if (errorMessage.includes("auth/wrong-password")) {
        setError("Incorrect password");
      } else if (errorMessage.includes("auth/email-already-in-use")) {
        setError("Email already in use");
      } else if (errorMessage.includes("auth/weak-password")) {
        setError("Password should be at least 6 characters");
      } else if (errorMessage.includes("auth/invalid-credential")) {
        setError("Invalid email or password");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    setMode("signin");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4" onClick={handleClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-navy/40 hover:text-navy transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="serif-heading text-navy text-2xl font-bold mb-2">
            {mode === "reset" ? "Reset Password" : mode === "signup" ? "Create Account" : "Sign In"}
          </h2>
          <p className="text-navy/60 text-sm">
            {mode === "reset"
              ? "Enter your email to receive a password reset link"
              : "Track your learning progress across all devices"}
          </p>
        </div>

        {/* Success message for password reset */}
        {resetSent && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            Password reset email sent! Check your inbox.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-navy text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="your@email.com"
              required
            />
          </div>

          {mode !== "reset" && (
            <div>
              <label htmlFor="password" className="block text-navy text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-navy/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={mode === "signup" ? "At least 6 characters" : "••••••••"}
                required
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : mode === "reset" ? "Send Reset Link" : mode === "signup" ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center text-sm">
          {mode === "signin" && (
            <>
              <button
                onClick={() => setMode("reset")}
                className="text-primary hover:text-primary-light font-semibold"
              >
                Forgot password?
              </button>
              <div className="mt-3 text-navy/60">
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-primary hover:text-primary-light font-semibold"
                >
                  Sign up
                </button>
              </div>
            </>
          )}
          {mode === "signup" && (
            <div className="text-navy/60">
              Already have an account?{" "}
              <button
                onClick={() => setMode("signin")}
                className="text-primary hover:text-primary-light font-semibold"
              >
                Sign in
              </button>
            </div>
          )}
          {mode === "reset" && (
            <button
              onClick={() => setMode("signin")}
              className="text-primary hover:text-primary-light font-semibold"
            >
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
