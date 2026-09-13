/** Points awarded once per card, the first time it's answered correctly (quiz) or marked "Master" (flip cards). */
export const POINTS_PER_CORRECT = 10;

export interface Rank {
  name: string;
  shortName: string;
  threshold: number;
}

/** A real yacht-crew career ladder — climbing it mirrors the app's own goal of getting you to OOW. */
export const RANKS: Rank[] = [
  { name: "Deckhand", shortName: "Deckhand", threshold: 0 },
  { name: "Able Seaman", shortName: "AB", threshold: 100 },
  { name: "Bosun", shortName: "Bosun", threshold: 250 },
  { name: "Junior Officer", shortName: "Jr. Officer", threshold: 500 },
  { name: "Third Officer", shortName: "3rd Officer", threshold: 900 },
  { name: "Officer of the Watch", shortName: "OOW", threshold: 1500 },
];

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
