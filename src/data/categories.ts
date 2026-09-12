import type { Category, TabId } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "oow3000",
    name: "OOW 3000 · COLREGS",
    shortName: "OOW 3000",
    description: "Rules of the Road, lights, shapes & sound signals",
    // port red → starboard green: the actual navigation-light colors, so the
    // category itself teaches port/starboard at a glance
    gradient: ["#f87171", "#34d399"],
  },
  {
    id: "gsk",
    name: "General Ship Knowledge",
    shortName: "GSK",
    description: "Meteorology, construction, corrosion, class & load lines",
    gradient: ["#2dd4bf", "#38bdf8"],
  },
  {
    id: "nav-radar",
    name: "Navigation & Radar",
    shortName: "Nav & Radar",
    description: "Chartwork, tides, ARPA/radar plotting, ECDIS",
    gradient: ["#60a5fa", "#818cf8"],
  },
  {
    id: "aec",
    name: "Auxiliary Equipment & Construction",
    shortName: "AEC",
    description: "Auxiliary machinery, equipment & ship construction",
    // warm engine-room amber/brass tones
    gradient: ["#fbbf24", "#fb923c"],
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);

/**
 * The special "everything shuffled together" feed — not a real content
 * category (cards keep their own category/gradient/watermark), just a tab.
 */
export const MIXED_TAB = {
  id: "mixed" as TabId,
  name: "All Categories · Mixed",
  shortName: "Mixed",
  description: "Every course shuffled into one feed",
};

/** Tabs shown in the top pill selector, "Mixed" first. */
export const TABS: Array<{ id: TabId; shortName: string }> = [
  MIXED_TAB,
  ...CATEGORIES,
];
