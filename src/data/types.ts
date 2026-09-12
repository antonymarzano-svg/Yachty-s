/**
 * Core content types for Yachty'S flashcards.
 *
 * Content lives as plain JSON under `src/data/cards/*.json` so new cards,
 * categories, images or audio clips can be added later without touching
 * any component code — just edit/append JSON and drop files in `public/`.
 */

export type CategoryId = "oow3000" | "gsk" | "nav-radar" | "aec";

/** A feed selection: a real category, or the special "mixed" feed of every category shuffled together. */
export type TabId = CategoryId | "mixed";

export interface Category {
  id: CategoryId;
  /** Full display name */
  name: string;
  /** Short label for pills/tabs */
  shortName: string;
  description: string;
  /** Tailwind gradient stops used for the category's accent chrome */
  gradient: [string, string];
}

export interface FlashcardMedia {
  /** Path (relative to /public) or URL to a diagram / photo, revealed with the answer (back of the card) */
  image?: string;
  imageAlt?: string;
  /**
   * Path (relative to /public) or URL to a scene-setting illustration shown
   * on the FRONT of the card, alongside the question — e.g. a picture of two
   * boats crossing for a "what should happen in this situation" question.
   * Keep it non-spoiling: it should set the scene, not give away the answer.
   */
  frontImage?: string;
  frontImageAlt?: string;
  /** Path (relative to /public) or URL to an audio clip, e.g. a COLREGS sound signal */
  audio?: string;
  /** Human label shown next to the play button, e.g. "Two prolonged blasts" */
  audioLabel?: string;
}

export interface Flashcard {
  id: string;
  category: CategoryId;
  question: string;
  answer: string;
  tags?: string[];
  media?: FlashcardMedia;
}
