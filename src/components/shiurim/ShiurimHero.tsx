"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function ShiurimHero({ totalCount }: { totalCount: number }) {
  const { user } = useAuth();

  return (
    <section className="bg-navy py-24 px-6 text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-4xl mx-auto"
      >
        <motion.h1
          variants={fadeUp}
          className="serif-heading text-primary text-5xl md:text-6xl font-bold mb-6"
        >
          Shiurim
        </motion.h1>
        <motion.p
          variants={fadeUp}
          className="text-white/80 text-xl font-light mb-8"
        >
          Torah from Rav Dovid Steinhauer &mdash; anytime, anywhere
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="text-white/50 text-sm tracking-widest uppercase mb-8"
        >
          {totalCount.toLocaleString()}+ Shiurim Available
        </motion.p>
        {user && (
          <motion.div variants={fadeUp}>
            <Link
              href="/my-learning"
              className="inline-flex items-center gap-3 bg-primary text-navy font-bold px-8 py-3.5 rounded-xl hover:bg-primary-light transition-colors shadow-lg shadow-primary/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              My Learning
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
