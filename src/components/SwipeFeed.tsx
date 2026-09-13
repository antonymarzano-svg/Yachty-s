import { useEffect, useRef, useState } from "react";
import type { Flashcard as FlashcardData } from "../data/types";
import { Flashcard } from "./Flashcard";
import { useHaptics } from "../hooks/useHaptics";

interface SwipeFeedProps {
  cards: FlashcardData[];
  isMastered: (id: string) => boolean;
  onToggleMastered: (id: string) => void;
  /** Awards points for a card once (no-op if already credited) — returns whether it was newly awarded. */
  onAward: (cardId: string, amount: number) => boolean;
  /** Remount key — pass something that changes when the card list identity changes (e.g. filter/category) to reset scroll position. */
  resetKey: string;
  /** Show each card's origin category (used for the "Mixed" feed). */
  showCategoryBadge?: boolean;
}

/**
 * Full-screen vertical swipe feed. Uses native CSS scroll-snap for buttery
 * momentum + snap physics (no custom drag/rubber-banding to fight the OS),
 * and an IntersectionObserver to know which card is "active" so only that
 * card plays audio / receives flip-reset / triggers haptics.
 */
export function SwipeFeed({
  cards,
  isMastered,
  onToggleMastered,
  onAward,
  resetKey,
  showCategoryBadge,
}: SwipeFeedProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const haptics = useHaptics();
  const lastHapticIndex = useRef(0);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "auto" });
    setActiveIndex(0);
    lastHapticIndex.current = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const children = Array.from(root.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = children.indexOf(entry.target as HTMLElement);
            if (idx !== -1) {
              setActiveIndex(idx);
              if (idx !== lastHapticIndex.current) {
                haptics.selectionChanged();
                lastHapticIndex.current = idx;
              }
            }
          }
        }
      },
      { root, threshold: [0, 0.6, 1] },
    );

    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length, resetKey]);

  if (cards.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-8 text-center text-white/60">
        <p className="text-lg font-semibold text-white">All caught up 🎉</p>
        <p className="text-sm">
          No unmastered cards left here. Toggle "unmastered only" off to
          review everything again.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll"
      style={{ touchAction: "pan-y", overscrollBehaviorY: "contain" }}
    >
      {cards.map((card, i) => (
        <Flashcard
          key={card.id}
          card={card}
          index={i}
          total={cards.length}
          active={i === activeIndex}
          mastered={isMastered(card.id)}
          onToggleMastered={() => onToggleMastered(card.id)}
          onAward={onAward}
          showCategoryBadge={showCategoryBadge}
        />
      ))}
    </div>
  );
}
