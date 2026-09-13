import { useMemo, useState } from "react";
import { CATEGORIES, TABS } from "./data/categories";
import type { TabId } from "./data/types";
import { cardsByTab, shuffle } from "./data/cards";
import { CategoryTabs } from "./components/CategoryTabs";
import { SwipeFeed } from "./components/SwipeFeed";
import { NewsFeed } from "./components/NewsFeed";
import { useMasteredStore } from "./hooks/useMasteredStore";

export default function App() {
  const [tab, setTab] = useState<TabId>(CATEGORIES[0].id);
  const [unmasteredOnly, setUnmasteredOnly] = useState(false);
  const { isMastered, toggleMastered, countInCategory } = useMasteredStore();

  // Shuffled once per session so the "Mixed" feed interleaves every
  // category instead of showing them back-to-back in file order.
  const mixedCards = useMemo(() => shuffle(cardsByTab("mixed")), []);

  const progress = useMemo(() => {
    return Object.fromEntries(
      TABS.map((t) => [t.id, countInCategory(t.id)]),
    ) as Record<TabId, { done: number; total: number }>;
  }, [countInCategory]);

  const cards = useMemo(() => {
    const all = tab === "mixed" ? mixedCards : cardsByTab(tab);
    return unmasteredOnly ? all.filter((c) => !isMastered(c.id)) : all;
  }, [tab, unmasteredOnly, isMastered, mixedCards]);

  const tabProgress = progress[tab];

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#071224]">
      {tab === "news" ? (
        <NewsFeed />
      ) : (
        <SwipeFeed
          cards={cards}
          isMastered={isMastered}
          onToggleMastered={toggleMastered}
          resetKey={`${tab}:${unmasteredOnly}`}
          showCategoryBadge={tab === "mixed"}
        />
      )}

      <CategoryTabs
        active={tab}
        onChange={setTab}
        progress={progress}
        unmasteredOnly={unmasteredOnly}
        onToggleUnmasteredOnly={() => setUnmasteredOnly((v) => !v)}
      />

      {/* subtle progress bar for whichever tab is active */}
      {tabProgress && tabProgress.total > 0 && (
        <div
          className="pointer-events-none absolute inset-x-3 z-10 h-0.5 rounded-full bg-white/10"
          style={{ top: "calc(env(safe-area-inset-top) + 86px)" }}
        >
          <div
            className="h-full rounded-full bg-white/70 transition-[width] duration-500"
            style={{
              width: `${(tabProgress.done / tabProgress.total) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
