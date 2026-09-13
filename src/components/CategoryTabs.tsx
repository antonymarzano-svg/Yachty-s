import clsx from "clsx";
import { TABS } from "../data/categories";
import type { TabId } from "../data/types";
import { useHaptics } from "../hooks/useHaptics";

interface CategoryTabsProps {
  active: TabId;
  onChange: (id: TabId) => void;
  progress: Record<TabId, { done: number; total: number }>;
  unmasteredOnly: boolean;
  onToggleUnmasteredOnly: () => void;
}

/** Horizontal pill selector fixed to the top, IG-story-tab style. "Mixed" shuffles every category into one feed. */
export function CategoryTabs({
  active,
  onChange,
  progress,
  unmasteredOnly,
  onToggleUnmasteredOnly,
}: CategoryTabsProps) {
  const haptics = useHaptics();

  return (
    <div className="pointer-events-auto absolute inset-x-0 top-0 z-20 safe-top">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-3 pb-2 pt-3">
        {TABS.map((tab) => {
          const p = progress[tab.id];
          const isActive = tab.id === active;
          const isMixed = tab.id === "mixed";
          const isNews = tab.id === "news";
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (tab.id !== active) haptics.selectionChanged();
                onChange(tab.id);
              }}
              className={clsx(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                isActive
                  ? "border-white/80 bg-white text-slate-900"
                  : isMixed
                    ? "border-fuchsia-300/40 bg-fuchsia-500/10 text-fuchsia-200"
                    : isNews
                      ? "border-amber-300/40 bg-amber-500/10 text-amber-200"
                      : "border-white/20 bg-black/30 text-white/80 backdrop-blur-md",
              )}
            >
              {isMixed && <ShuffleIcon isActive={isActive} />}
              {isNews && <NewsIcon isActive={isActive} />}
              {tab.shortName}
              {p && p.total > 0 && (
                <span
                  className={clsx(
                    "text-[11px] font-medium",
                    isActive ? "text-slate-500" : "text-white/50",
                  )}
                >
                  {p.done}/{p.total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {active !== "news" && (
        <div className="flex justify-center px-3 pb-2">
          <button
            type="button"
            onClick={() => {
              haptics.light();
              onToggleUnmasteredOnly();
            }}
            className={clsx(
              "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md transition-colors",
              unmasteredOnly
                ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-300"
                : "border-white/15 bg-black/30 text-white/60",
            )}
          >
            <span
              className={clsx(
                "h-2 w-2 rounded-full",
                unmasteredOnly ? "bg-emerald-400" : "bg-white/30",
              )}
            />
            Unmastered only
          </button>
        </div>
      )}
    </div>
  );
}

function NewsIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={clsx("h-3.5 w-3.5", isActive ? "text-slate-500" : "text-amber-300")}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 9h6M7 13h10M7 16h6" />
    </svg>
  );
}

function ShuffleIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={clsx("h-3.5 w-3.5", isActive ? "text-slate-500" : "text-fuchsia-300")}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h3.5c2 0 3.2 1.2 4.5 3M3 18h3.5c2 0 3.2-1.2 4.5-3M15 6h6M15 18h6" />
      <path d="M18 3l3 3-3 3M18 15l3 3-3 3" />
    </svg>
  );
}
