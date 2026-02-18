"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface CategoryInfo {
  id: string;
  label: string;
  description: string;
  count: number;
}

export default function CategoryBrowser({
  categories,
  onSelectCategory,
}: {
  categories: CategoryInfo[];
  onSelectCategory: (id: string) => void;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={stagger}
    >
      <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
        <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <div className="w-6 h-0.5 bg-primary" />
        </div>
        <h2 className="serif-heading text-navy text-4xl font-bold">
          Browse by Category
        </h2>
      </motion.div>
      <motion.div variants={fadeUp} className="w-20 h-1 bg-primary mb-10" />

      <motion.div
        variants={stagger}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            variants={fadeUp}
            onClick={() => onSelectCategory(cat.id)}
            className="bg-white border border-primary/15 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left group"
          >
            <h3 className="text-navy font-bold text-lg group-hover:text-primary transition-colors">
              {cat.label}
            </h3>
            <p className="text-navy/50 text-xs mt-1">{cat.description}</p>
            <p className="text-primary/70 text-sm font-semibold mt-3">
              {cat.count} shiur{cat.count !== 1 ? "im" : ""}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
