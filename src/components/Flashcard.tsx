import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Flashcard as FlashcardData } from "../data/types";
import { CATEGORY_MAP } from "../data/categories";
import { AudioPlayer } from "./AudioPlayer";
import { VideoPlayer } from "./VideoPlayer";
import { MasteredButton } from "./MasteredButton";
import { DoubleTapBurst } from "./DoubleTapBurst";
import { CategoryWatermark } from "./CategoryWatermark";
import { useHaptics } from "../hooks/useHaptics";

interface FlashcardProps {
  card: FlashcardData;
  mastered: boolean;
  onToggleMastered: () => void;
  /** Is this the card currently centred in the feed? */
  active: boolean;
  index: number;
  total: number;
  /** Show which category this card belongs to (used in the "Mixed" feed, where cards come from every category). */
  showCategoryBadge?: boolean;
}

const DOUBLE_TAP_MS = 260;

export function Flashcard({
  card,
  mastered,
  onToggleMastered,
  active,
  index,
  total,
  showCategoryBadge,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [burst, setBurst] = useState(0);
  const tapTimer = useRef<number | null>(null);
  const haptics = useHaptics();

  useEffect(() => {
    if (!active) setFlipped(false);
  }, [active]);

  const doFlip = () => {
    haptics.light();
    setFlipped((f) => !f);
  };

  // Double-tap-to-master, IG-style: always bursts, but only ever turns
  // mastery ON (never off) — mirrors "double tap to like".
  const doDoubleTapMaster = () => {
    haptics.success();
    setBurst((b) => b + 1);
    if (!mastered) onToggleMastered();
  };

  // The heart icon itself is a real on/off toggle, so mis-taps can be undone.
  const doHeartToggle = () => {
    haptics.success();
    onToggleMastered();
  };

  const handleTap = () => {
    if (tapTimer.current !== null) {
      // second tap within the window -> double tap
      window.clearTimeout(tapTimer.current);
      tapTimer.current = null;
      doDoubleTapMaster();
      return;
    }
    tapTimer.current = window.setTimeout(() => {
      tapTimer.current = null;
      doFlip();
    }, DOUBLE_TAP_MS);
  };

  useEffect(
    () => () => {
      if (tapTimer.current !== null) window.clearTimeout(tapTimer.current);
    },
    [],
  );

  const category = CATEGORY_MAP[card.category];
  const [from, to] = category.gradient;

  return (
    <div className="relative h-full w-full snap-start shrink-0">
      {/* Ambient gradient backdrop per-category — kept vivid & warm, not murky */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(130% 100% at 15% 0%, ${from}, transparent 55%), radial-gradient(130% 100% at 85% 100%, ${to}, transparent 55%)`,
          opacity: 0.5,
        }}
      />
      <div className="absolute inset-0 bg-[#071224]/35" />

      <div
        className="relative flex h-full w-full flex-col px-4 pb-28 pt-[calc(env(safe-area-inset-top)+72px)]"
        onClick={handleTap}
        style={{ perspective: 1600 }}
      >
        <motion.div
          className="preserve-3d relative mx-auto w-full max-w-md flex-1"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          {/* FRONT — question */}
          <div className="backface-hidden absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
            <CardChrome
              index={index}
              total={total}
              tag={card.tags?.[0]}
              hint="Tap to flip"
              categoryBadge={
                showCategoryBadge
                  ? { label: category.shortName, color: from }
                  : undefined
              }
            />
            {card.media?.frontImage ? (
              <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden">
                <div
                  className="max-h-[46vh] w-full shrink-0 overflow-hidden rounded-2xl border"
                  style={{ borderColor: `${from}55` }}
                >
                  <img
                    src={card.media.frontImage}
                    alt={card.media.frontImageAlt ?? ""}
                    className="w-full object-contain"
                    draggable={false}
                  />
                </div>
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-center text-2xl font-semibold leading-snug text-white sm:text-[28px]">
                    {card.question}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative flex flex-1 items-center justify-center">
                <CategoryWatermark
                  category={card.category}
                  className="pointer-events-none absolute h-64 w-64 -rotate-6 opacity-[0.08] sm:h-80 sm:w-80"
                  style={{ color: from }}
                />
                <p className="relative text-center text-[26px] font-semibold leading-snug text-white sm:text-3xl">
                  {card.question}
                </p>
              </div>
            )}
          </div>

          {/* BACK — answer */}
          <div
            className="backface-hidden absolute inset-0 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm"
            style={{ transform: "rotateY(180deg)" }}
          >
            <CardChrome
              index={index}
              total={total}
              tag={card.tags?.[0]}
              hint="Tap to flip back"
              categoryBadge={
                showCategoryBadge
                  ? { label: category.shortName, color: from }
                  : undefined
              }
            />
            <div className="flex min-h-0 flex-1 flex-col justify-center gap-4 overflow-y-auto no-scrollbar">
              <p className="text-[17px] leading-relaxed text-white/90">
                {card.answer}
              </p>
              {card.media?.image && (
                <img
                  src={card.media.image}
                  alt={card.media.imageAlt ?? ""}
                  className="max-h-[34vh] w-full shrink-0 rounded-xl border border-white/10 object-contain"
                  draggable={false}
                />
              )}
              {card.media?.video && (
                <VideoPlayer
                  src={card.media.video}
                  poster={card.media.videoPoster}
                  label={card.media.videoLabel}
                  active={active}
                />
              )}
              {card.media?.audio && (
                <AudioPlayer
                  src={card.media.audio}
                  label={card.media.audioLabel}
                  active={active}
                />
              )}
            </div>
          </div>
        </motion.div>

        <DoubleTapBurst trigger={burst} />
      </div>

      {/* Right-side action rail, IG-Reels style */}
      <div className="absolute bottom-32 right-4 flex flex-col items-center gap-5">
        <MasteredButton mastered={mastered} onToggle={doHeartToggle} />
      </div>
    </div>
  );
}

function CardChrome({
  index,
  total,
  tag,
  hint,
  categoryBadge,
}: {
  index: number;
  total: number;
  tag?: string;
  hint: string;
  categoryBadge?: { label: string; color: string };
}) {
  return (
    <div className="mb-4 flex items-center justify-between text-xs font-medium text-white/50">
      <span>
        {index + 1} / {total}
      </span>
      <div className="flex items-center gap-2">
        {categoryBadge && (
          <span
            className="rounded-full px-2.5 py-1 font-semibold"
            style={{
              color: categoryBadge.color,
              backgroundColor: `${categoryBadge.color}22`,
              border: `1px solid ${categoryBadge.color}55`,
            }}
          >
            {categoryBadge.label}
          </span>
        )}
        {tag && (
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-white/70">
            {tag}
          </span>
        )}
        <span className="hidden sm:inline">{hint}</span>
      </div>
    </div>
  );
}
