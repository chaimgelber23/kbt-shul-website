import { CATEGORIES } from "./categoryConfig";
import type { Shiur } from "./types";

/**
 * Categorize a shiur by matching its title against category patterns.
 * Returns the category ID and extracted sub-levels.
 */
export function categorizeTitle(title: string): {
  categoryId: string;
  subLevel1?: string;
  subLevel2?: string;
} {
  for (const cat of CATEGORIES) {
    // Skip the "general" catch-all during pattern matching
    if (cat.id === "general") continue;

    for (const pattern of cat.patterns) {
      if (pattern.test(title)) {
        let subLevel1: string | undefined;
        let subLevel2: string | undefined;

        if (cat.extractLevels) {
          [subLevel1, subLevel2] = cat.extractLevels(title);
        }

        return { categoryId: cat.id, subLevel1, subLevel2 };
      }
    }
  }

  return { categoryId: "general" };
}

/**
 * Get category counts from a list of shiurim.
 * Returns categories sorted by count (descending), excluding empty ones.
 * "General" is always last.
 */
export function getCategoryCounts(shiurim: Shiur[]): { id: string; label: string; description: string; count: number }[] {
  const counts = new Map<string, number>();

  for (const shiur of shiurim) {
    counts.set(shiur.categoryId, (counts.get(shiur.categoryId) || 0) + 1);
  }

  const result = CATEGORIES
    .filter((cat) => (counts.get(cat.id) || 0) > 0)
    .map((cat) => ({
      id: cat.id,
      label: cat.label,
      description: cat.description,
      count: counts.get(cat.id) || 0,
    }));

  // Sort by count descending, but keep "general" last
  result.sort((a, b) => {
    if (a.id === "general") return 1;
    if (b.id === "general") return -1;
    return b.count - a.count;
  });

  return result;
}

/**
 * Get unique sub-level 1 values for a category (e.g., seforim for Parsha).
 * Returns them in the order they appear in the data.
 */
export function getSubLevel1Values(shiurim: Shiur[], categoryId: string): string[] {
  const values = new Set<string>();
  for (const s of shiurim) {
    if (s.categoryId === categoryId && s.subLevel1) {
      values.add(s.subLevel1);
    }
  }
  return Array.from(values);
}

/**
 * Get unique sub-level 2 values within a category and sub-level 1.
 */
export function getSubLevel2Values(shiurim: Shiur[], categoryId: string, subLevel1: string): string[] {
  const values = new Set<string>();
  for (const s of shiurim) {
    if (s.categoryId === categoryId && s.subLevel1 === subLevel1 && s.subLevel2) {
      values.add(s.subLevel2);
    }
  }
  return Array.from(values);
}

/**
 * Get the category definition by ID.
 */
export function getCategoryDef(categoryId: string) {
  return CATEGORIES.find((c) => c.id === categoryId);
}
