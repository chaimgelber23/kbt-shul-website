"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/davening", label: "Davening Times" },
  { href: "/programs", label: "Programs" },
  { href: "/shiurim", label: "Shiurim" },
  { href: "/membership", label: "Membership" },
  { href: "/donate", label: "Donate", accent: true },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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
          {navLinks.map((link) => (
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
          ))}
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
              {navLinks.map((link) => (
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
              ))}
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
