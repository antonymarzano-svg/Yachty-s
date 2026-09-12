import { useCallback, useEffect, useState } from "react";
import type { TabId } from "../data/types";
import { ALL_CARDS } from "../data/cards";

const STORAGE_KEY = "yachtys.mastered.v1";

function loadMastered(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function persistMastered(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // localStorage unavailable (private mode, quota, SSR) — progress just
    // won't persist across sessions; the app still functions.
  }
}

/**
 * On-device progress tracking for "mastered" flashcards. No login/backend —
 * everything lives in localStorage for v1.
 */
export function useMasteredStore() {
  const [mastered, setMastered] = useState<Set<string>>(() => loadMastered());

  useEffect(() => {
    persistMastered(mastered);
  }, [mastered]);

  const isMastered = useCallback(
    (id: string) => mastered.has(id),
    [mastered],
  );

  const setMasteredState = useCallback((id: string, value: boolean) => {
    setMastered((prev) => {
      const has = prev.has(id);
      if (value === has) return prev;
      const next = new Set(prev);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const toggleMastered = useCallback((id: string) => {
    setMastered((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const countInCategory = useCallback(
    (tab: TabId) => {
      let total = 0;
      let done = 0;
      for (const card of ALL_CARDS) {
        if (tab !== "mixed" && card.category !== tab) continue;
        total += 1;
        if (mastered.has(card.id)) done += 1;
      }
      return { done, total };
    },
    [mastered],
  );

  const resetAll = useCallback(() => setMastered(new Set()), []);

  return {
    mastered,
    isMastered,
    setMastered: setMasteredState,
    toggleMastered,
    countInCategory,
    resetAll,
  };
}
