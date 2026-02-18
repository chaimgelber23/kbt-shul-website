"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/davening", label: "Davening Times" },
  { href: "/programs", label: "Programs" },
  { href: "/shiurim", label: "Shiurim", hasDropdown: true },
  { href: "/membership", label: "Membership" },
  { href: "/donate", label: "Donate", accent: true },
];

// Shiurim dropdown links — curated major topics
const shiurimDropdown = [
  { label: "All Shiurim", href: "/shiurim", description: "Browse all 30+ series" },
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
        <nav className="hidden lg:flex items-center gap-8">
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
                              i === 0
                                ? "border-b border-primary/10 mb-1"
                                : ""
                            }`}
                          >
                            <span className="text-navy font-semibold text-sm">
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

        {/* Contact Button + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="hidden sm:flex bg-primary text-navy px-6 py-2 rounded-lg font-bold text-sm hover:brightness-105 transition-all shadow-sm"
          >
            Contact
          </Link>
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
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
