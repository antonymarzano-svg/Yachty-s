import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "oow3000",
    name: "OOW 3000 · COLREGS",
    shortName: "OOW 3000",
    description: "Rules of the Road, lights, shapes & sound signals",
    gradient: ["#f97316", "#ef4444"],
  },
  {
    id: "gsk",
    name: "General Ship Knowledge",
    shortName: "GSK",
    description: "Stability, construction, fire, LSA, SOLAS/MARPOL",
    gradient: ["#22c55e", "#0ea5e9"],
  },
  {
    id: "nav-radar",
    name: "Navigation & Radar",
    shortName: "Nav & Radar",
    description: "Chartwork, tides, ARPA/radar plotting, ECDIS",
    gradient: ["#38bdf8", "#6366f1"],
  },
  {
    id: "aec",
    name: "Anchoring, Emergencies & Comms",
    shortName: "AEC",
    description: "Anchor work, emergency response, GMDSS & signals",
    gradient: ["#c084fc", "#ec4899"],
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);
