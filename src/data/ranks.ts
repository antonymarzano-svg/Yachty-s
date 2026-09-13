import { ALL_CARDS } from "./cards";

/** Points awarded once per card, the first time it's answered correctly (quiz) or marked "Master" (flip cards). */
export const POINTS_PER_CORRECT = 10;

/** Total points available if every card in the whole app were answered correctly once. */
export const TOTAL_POSSIBLE_POINTS = ALL_CARDS.length * POINTS_PER_CORRECT;

export interface Rank {
  name: string;
  shortName: string;
  threshold: number;
}

interface RankTier {
  name: string;
  shortName: string;
  /** Fraction of the whole question bank (0-1) needed to reach this rank. */
  fraction: number;
}

/**
 * A real yacht-crew career ladder, spaced out as milestones across the
 * *whole* question bank — not fixed numbers — so reaching the top rank
 * (Captain) always means "answered every card correctly," however many
 * cards the app ends up with.
 */
const RANK_TIERS: RankTier[] = [
  { name: "Deckhand", shortName: "Deckhand", fraction: 0 },
  { name: "Lead Deckhand", shortName: "Lead Deckhand", fraction: 0.08 },
  { name: "Bosun", shortName: "Bosun", fraction: 0.18 },
  { name: "Third Officer", shortName: "3rd Officer", fraction: 0.32 },
  { name: "Second Officer", shortName: "2nd Officer", fraction: 0.48 },
  { name: "Chief Officer", shortName: "Chief Officer", fraction: 0.65 },
  { name: "Chief Mate", shortName: "Chief Mate", fraction: 0.8 },
  { name: "First Officer", shortName: "1st Officer", fraction: 0.92 },
  { name: "Captain", shortName: "Captain", fraction: 1 },
];

export const RANKS: Rank[] = RANK_TIERS.map((t) => ({
  name: t.name,
  shortName: t.shortName,
  threshold: Math.round(t.fraction * TOTAL_POSSIBLE_POINTS),
}));

export interface RankStatus {
  current: Rank;
  next: Rank | null;
  /** 0-1 progress from current rank's threshold to next rank's threshold (1 if at/above the top rank). */
  progress: number;
  pointsToNext: number | null;
}

export function getRankStatus(points: number): RankStatus {
  let current = RANKS[0];
  let next: Rank | null = null;
  for (let i = 0; i < RANKS.length; i++) {
    if (points >= RANKS[i].threshold) {
      current = RANKS[i];
      next = RANKS[i + 1] ?? null;
    }
  }
  if (!next) return { current, next: null, progress: 1, pointsToNext: null };
  const span = next.threshold - current.threshold;
  const progress = span > 0 ? (points - current.threshold) / span : 1;
  return {
    current,
    next,
    progress: Math.max(0, Math.min(1, progress)),
    pointsToNext: next.threshold - points,
  };
}
