import { useEffect, useState } from "react";

const STORAGE_KEY = "yachtys.streak.v1";

interface StreakState {
  current: number;
  longest: number;
  lastActiveDate: string; // YYYY-MM-DD
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.parse(b) - Date.parse(a)) / msPerDay);
}

function loadState(): StreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { current: 0, longest: 0, lastActiveDate: "" };
    const parsed = JSON.parse(raw) as StreakState;
    return {
      current: parsed.current ?? 0,
      longest: parsed.longest ?? 0,
      lastActiveDate: parsed.lastActiveDate ?? "",
    };
  } catch {
    return { current: 0, longest: 0, lastActiveDate: "" };
  }
}

function persistState(state: StreakState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable — the streak just won't persist across sessions.
  }
}

/**
 * A real, on-device daily-use streak (Duolingo/Snapchat-style) — bumped once
 * per calendar day the app is opened, reset if a day is skipped. No fake
 * numbers, no other users: just an honest count of your own consecutive days.
 */
export function useStreakStore() {
  const [state, setState] = useState<StreakState>(() => loadState());

  // Runs once on mount — "opening the app today" is what advances the streak.
  useEffect(() => {
    setState((prev) => {
      const today = todayKey();
      if (prev.lastActiveDate === today) return prev; // already counted today
      const gap = prev.lastActiveDate ? daysBetween(prev.lastActiveDate, today) : null;
      const nextCurrent = gap === 1 ? prev.current + 1 : 1;
      const next: StreakState = {
        current: nextCurrent,
        longest: Math.max(prev.longest, nextCurrent),
        lastActiveDate: today,
      };
      persistState(next);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { streak: state.current, longestStreak: state.longest };
}
