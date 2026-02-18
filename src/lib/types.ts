export interface Shiur {
  id: string;
  title: string;
  audioUrl: string;
  duration: string; // "00:27:10" format
  durationSeconds: number;
  pubDate: string; // ISO date
  description: string;
  link: string;
  // Category hierarchy
  categoryId: string;
  subLevel1?: string; // sefer, topic, etc.
  subLevel2?: string; // parsha, perek, etc.
}

export interface PlayerState {
  currentShiur: Shiur | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}

export type DrillDownType = "parsha" | "sefer-perek" | "topic" | null;

export interface CategoryDef {
  id: string;
  label: string;
  description: string;
  patterns: RegExp[];
  drillDown: DrillDownType;
  /** Extract sub-level info from the title. Returns [subLevel1, subLevel2?] */
  extractLevels?: (title: string) => [string | undefined, string | undefined];
}

export type SortOrder = "newest" | "oldest";

export interface BrowseState {
  categoryId: string | null;
  subLevel1: string | null;
  subLevel2: string | null;
}
