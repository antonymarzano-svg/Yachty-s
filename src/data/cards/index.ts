import type { CategoryId, Flashcard } from "../types";
import oow3000 from "./oow3000.json";
import gsk from "./gsk.json";
import navRadar from "./nav-radar.json";
import aec from "./aec.json";

/**
 * All flashcards, aggregated from per-category JSON files.
 *
 * To add content later: append objects to the relevant JSON file (or add a
 * new file + import it here) — no component changes are needed.
 */
export const ALL_CARDS: Flashcard[] = [
  ...(oow3000 as Flashcard[]),
  ...(gsk as Flashcard[]),
  ...(navRadar as Flashcard[]),
  ...(aec as Flashcard[]),
];

export function cardsByCategory(category: CategoryId | "all"): Flashcard[] {
  if (category === "all") return ALL_CARDS;
  return ALL_CARDS.filter((c) => c.category === category);
}
