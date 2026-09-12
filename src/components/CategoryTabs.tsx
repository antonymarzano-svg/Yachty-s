import clsx from "clsx";
import { CATEGORIES } from "../data/categories";
import type { CategoryId } from "../data/types";
import { useHaptics } from "../hooks/useHaptics";

interface CategoryTabsProps {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
  progress: Record<CategoryId, { done: number; total: number }>;
  unmasteredOnly: boolean;
  onToggleUnmasteredOnly: () => void;
}

/** Horizontal pill selector fixed to the top, IG-story-tab style. */
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
        {CATEGORIES.map((cat) => {
          const p = progress[cat.id];
          const isActive = cat.id === active;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                if (cat.id !== active) haptics.selectionChanged();
                onChange(cat.id);
              }}
              className={clsx(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                isActive
                  ? "border-white/80 bg-white text-slate-900"
                  : "border-white/20 bg-black/30 text-white/80 backdrop-blur-md",
              )}
            >
              {cat.shortName}
              {p && (
                <span
                  className={clsx(
                    "ml-1.5 text-[11px] font-medium",
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
    </div>
  );
}
