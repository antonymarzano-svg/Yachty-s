import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Flashcard as FlashcardData } from "../data/types";
import { AudioPlayer } from "./AudioPlayer";
import { MasteredButton } from "./MasteredButton";
import { DoubleTapBurst } from "./DoubleTapBurst";
import { useHaptics } from "../hooks/useHaptics";

interface FlashcardProps {
  card: FlashcardData;
  gradient: [string, string];
  mastered: boolean;
  onToggleMastered: () => void;
  /** Is this the card currently centred in the feed? */
  active: boolean;
  index: number;
  total: number;
}

const DOUBLE_TAP_MS = 260;

export function Flashcard({
  card,
  gradient,
  mastered,
  onToggleMastered,
  active,
  index,
  total,
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

  const [from, to] = gradient;

  return (
    <div className="relative h-full w-full snap-start shrink-0">
      {/* Ambient gradient backdrop per-category */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, ${from}, transparent 60%), radial-gradient(120% 90% at 50% 100%, ${to}, transparent 60%)`,
        }}
      />
      <div className="absolute inset-0 bg-slate-950/40" />

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
            />
            <div className="flex flex-1 items-center justify-center">
              <p className="text-center text-[26px] font-semibold leading-snug text-white sm:text-3xl">
                {card.question}
              </p>
            </div>
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
            />
            <div className="flex flex-1 flex-col justify-center gap-4 overflow-y-auto no-scrollbar">
              <p className="text-[17px] leading-relaxed text-white/90">
                {card.answer}
              </p>
              {card.media?.image && (
                <img
                  src={card.media.image}
                  alt={card.media.imageAlt ?? ""}
                  className="w-full rounded-xl border border-white/10"
                  draggable={false}
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
}: {
  index: number;
  total: number;
  tag?: string;
  hint: string;
}) {
  return (
    <div className="mb-4 flex items-center justify-between text-xs font-medium text-white/50">
      <span>
        {index + 1} / {total}
      </span>
      <div className="flex items-center gap-2">
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
