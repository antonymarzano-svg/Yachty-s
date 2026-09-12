import type { TabId, Flashcard } from "../types";
import oow3000 from "./oow3000.json";
import gsk from "./gsk.json";
import navRadar from "./nav-radar.json";
import aec from "./aec.json";
import gmdss from "./gmdss.json";

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
  ...(gmdss as Flashcard[]),
];

export function cardsByTab(tab: TabId): Flashcard[] {
  if (tab === "mixed") return ALL_CARDS;
  return ALL_CARDS.filter((c) => c.category === tab);
}

/** Fisher–Yates shuffle — returns a new array, doesn't mutate the input. */
export function shuffle<T>(items: T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
