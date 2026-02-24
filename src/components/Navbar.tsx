"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/shiurim", label: "Shiurim", hasDropdown: true },
  { href: "/programs/yahrtzeit-learning", label: "Yahrtzeit Learning" },
  { href: "/membership", label: "Membership" },
  { href: "/donate", label: "Donate", accent: true },
];

// Shiurim dropdown links — curated major topics
const shiurimDropdown = [
  { label: "All Shiurim", href: "/shiurim", description: "Browse all 30+ series" },
  { label: "My Learning", href: "/my-learning", description: "Track your progress", highlight: true },
  { label: "Parshas HaShavua", href: "/shiurim/parsha", description: "Weekly Torah portion" },
  { label: "Yamim Tovim", href: "/shiurim/yamim-tovim", description: "Holidays & Yom Tov shiurim" },
  { label: "Kuzari", href: "/shiurim/kuzari", description: "Sefer HaKuzari" },
  { label: "Mesilas Yesharim", href: "/shiurim/mesilas-yesharim", description: "Path of the Just" },
  { label: "Shir Hashirim", href: "/shiurim/shir-hashirim", description: "Song of Songs" },
  { label: "Machshava", href: "/shiurim/machshava", description: "Hashkafa & Jewish thought" },
  { label: "Pirkei Avos", href: "/shiurim/pirkei-avos", description: "With the Maharal" },
  { label: "Ruach Chaim", href: "/shiurim/ruach-chaim", description: "On Pirkei Avos" },
  { label: "Navi", href: "/shiurim/yehoshua", description: "Yehoshua, Shoftim, Shmuel..." },
  { label: "Tefilla", href: "/shiurim/tefilla", description: "Understanding prayer" },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shiurimOpen, setShiurimOpen] = useState(false);
  const [mobileShiurimOpen, setMobileShiurimOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShiurimOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setShiurimOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-bg-light/95 backdrop-blur-sm border-b border-primary/10 px-6 lg:px-20 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              scrollToTop();
            }
          }}
          className="flex items-center gap-4"
        >
          <Image
            src="/logo.png"
            alt="Kahal Beis Tefilla"
            width={240}
            height={120}
            className="h-12 md:h-14 w-auto"
            unoptimized
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.href} className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShiurimOpen(!shiurimOpen)}
                  onMouseEnter={() => setShiurimOpen(true)}
                  className={`text-sm font-semibold transition-colors flex items-center gap-1 ${
                    pathname.startsWith("/shiurim")
                      ? "text-primary"
                      : "text-navy hover:text-primary"
                  }`}
                >
                  {link.label}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${
                      shiurimOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <AnimatePresence>
                  {shiurimOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      onMouseEnter={() => setShiurimOpen(true)}
                      onMouseLeave={() => setShiurimOpen(false)}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-xl shadow-xl border border-primary/10 overflow-hidden"
                    >
                      {/* Arrow */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-primary/10 rotate-45" />

                      <div className="py-2 relative max-h-80 overflow-y-auto scrollbar-thin">
                        {shiurimDropdown.map((item, i) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col px-4 py-2.5 hover:bg-primary/5 transition-colors ${
                              i === 0 || i === 1
                                ? "border-b border-primary/10 mb-1"
                                : ""
                            } ${'highlight' in item && item.highlight ? "bg-primary/5" : ""}`}
                          >
                            <span className={`font-semibold text-sm ${'highlight' in item && item.highlight ? "text-primary" : "text-navy"}`}>
                              {item.label}
                            </span>
                            <span className="text-navy/40 text-xs">
                              {item.description}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href === "/" && pathname === "/") {
                    e.preventDefault();
                    scrollToTop();
                  }
                }}
                className={`text-sm font-semibold transition-colors ${
                  link.accent
                    ? "text-primary italic hover:text-primary-light"
                    : "text-navy hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Contact Button + Auth + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden lg:flex bg-primary text-navy px-6 py-2 rounded-lg font-bold text-sm hover:brightness-105 transition-all shadow-sm"
          >
            Contact
          </Link>
          {user ? (
            <button
              onClick={() => signOut()}
              className="hidden lg:flex items-center gap-2 text-navy hover:text-primary transition-colors text-sm font-semibold"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </span>
              </div>
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="hidden lg:flex items-center gap-2 text-navy hover:text-primary transition-colors text-sm font-semibold"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              Sign In
            </button>
          )}
          <button
            className="lg:hidden text-navy"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-6 pb-4">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.href}>
                    <button
                      onClick={() =>
                        setMobileShiurimOpen(!mobileShiurimOpen)
                      }
                      className="text-base font-semibold text-navy flex items-center gap-2 w-full"
                    >
                      {link.label}
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          mobileShiurimOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {mobileShiurimOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-1 pl-4 pt-2 max-h-60 overflow-y-auto scrollbar-thin">
                            {shiurimDropdown.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => {
                                  setMobileOpen(false);
                                  setMobileShiurimOpen(false);
                                }}
                                className="py-1.5 text-sm text-navy/70 hover:text-primary transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      setMobileOpen(false);
                      if (link.href === "/" && pathname === "/") {
                        e.preventDefault();
                        scrollToTop();
                      }
                    }}
                    className={`text-base font-semibold transition-colors ${
                      link.accent ? "text-primary italic" : "text-navy"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="bg-primary text-navy px-6 py-2 rounded-lg font-bold text-sm text-center w-fit"
              >
                Contact
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 text-navy text-sm font-semibold"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                    </span>
                  </div>
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 text-navy text-sm font-semibold"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                  Sign In
                </button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
}
