import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "yachtys.points.v1";

interface PointsState {
  points: number;
  /** Card ids already credited, so toggling a card on/off never double-awards. */
  awarded: string[];
}

function loadState(): PointsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { points: 0, awarded: [] };
    const parsed = JSON.parse(raw) as PointsState;
    return { points: parsed.points ?? 0, awarded: parsed.awarded ?? [] };
  } catch {
    return { points: 0, awarded: [] };
  }
}

function persistState(state: PointsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable — points just won't persist across sessions.
  }
}

/**
 * On-device points tracking. A card only ever pays out once (first correct
 * quiz answer, or first time it's marked "Master") no matter how many times
 * it's revisited or toggled afterwards.
 */
export function usePointsStore() {
  const [state, setState] = useState<PointsState>(() => loadState());

  useEffect(() => {
    persistState(state);
  }, [state]);

  /** Awards `amount` for `cardId` if (and only if) it hasn't been credited before. Returns true if points were actually awarded. */
  const awardOnce = useCallback((cardId: string, amount: number) => {
    let didAward = false;
    setState((prev) => {
      if (prev.awarded.includes(cardId)) return prev;
      didAward = true;
      return { points: prev.points + amount, awarded: [...prev.awarded, cardId] };
    });
    return didAward;
  }, []);

  const resetAll = useCallback(() => setState({ points: 0, awarded: [] }), []);

  return { points: state.points, awardOnce, resetAll };
}
