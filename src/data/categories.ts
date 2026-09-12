import type { Category } from "./types";

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
    description: "Stability, construction, fire, LSA, SOLAS/MARPOL",
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
    name: "Anchoring, Emergencies & Comms",
    shortName: "AEC",
    description: "Anchor work, emergency response, GMDSS & signals",
    // warm lighthouse-beacon / flare tones
    gradient: ["#fbbf24", "#fb923c"],
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);
