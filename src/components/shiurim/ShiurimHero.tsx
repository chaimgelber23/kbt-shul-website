"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function ShiurimHero({ totalCount }: { totalCount: number }) {
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
          className="text-white/50 text-sm tracking-widest uppercase"
        >
          {totalCount.toLocaleString()}+ Shiurim Available
        </motion.p>
      </motion.div>
    </section>
  );
}
