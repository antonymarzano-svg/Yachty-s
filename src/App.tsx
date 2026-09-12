import { useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_MAP } from "./data/categories";
import type { CategoryId } from "./data/types";
import { cardsByCategory } from "./data/cards";
import { CategoryTabs } from "./components/CategoryTabs";
import { SwipeFeed } from "./components/SwipeFeed";
import { useMasteredStore } from "./hooks/useMasteredStore";

export default function App() {
  const [category, setCategory] = useState<CategoryId>(CATEGORIES[0].id);
  const [unmasteredOnly, setUnmasteredOnly] = useState(false);
  const { isMastered, toggleMastered, countInCategory } = useMasteredStore();

  const progress = useMemo(() => {
    return Object.fromEntries(
      CATEGORIES.map((c) => [c.id, countInCategory(c.id)]),
    ) as Record<CategoryId, { done: number; total: number }>;
  }, [countInCategory]);

  const cards = useMemo(() => {
    const all = cardsByCategory(category);
    return unmasteredOnly ? all.filter((c) => !isMastered(c.id)) : all;
  }, [category, unmasteredOnly, isMastered]);

  const activeCategory = CATEGORY_MAP[category];
  const catProgress = progress[category];

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#071224]">
      <SwipeFeed
        cards={cards}
        gradient={activeCategory.gradient}
        isMastered={isMastered}
        onToggleMastered={toggleMastered}
        resetKey={`${category}:${unmasteredOnly}`}
      />

      <CategoryTabs
        active={category}
        onChange={setCategory}
        progress={progress}
        unmasteredOnly={unmasteredOnly}
        onToggleUnmasteredOnly={() => setUnmasteredOnly((v) => !v)}
      />

      {/* subtle per-category progress bar */}
      {catProgress && catProgress.total > 0 && (
        <div
          className="pointer-events-none absolute inset-x-3 z-10 h-0.5 rounded-full bg-white/10"
          style={{ top: "calc(env(safe-area-inset-top) + 86px)" }}
        >
          <div
            className="h-full rounded-full bg-white/70 transition-[width] duration-500"
            style={{
              width: `${(catProgress.done / catProgress.total) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
