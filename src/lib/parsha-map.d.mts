// Type declarations for the plain-ESM parsha-map.mjs (single source of truth
// for parsha canonicalization + matching, shared with the offline audit script).

export const PARSHIYOS_BY_SEFER: Record<string, string[]>;

export function normKey(s: string): string;

export function canonicalParsha(name: string): string;

export function splitParshaNames(name: string): string[];

export function parshaKeys(name: string): string[];

export function lookupSefer(name: string): string | undefined;

export function extractParshaFromTitle(title: string | null | undefined): string | null;

export function shiurBelongsToParsha(
  shiur: { title?: string | null; subLevel2?: string | null } | null | undefined,
  parshaName: string,
): boolean;

export function getParshaVariants(canonicalName: string): string[];
