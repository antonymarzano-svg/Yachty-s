import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Flashcard as FlashcardData } from "../data/types";
import { CATEGORY_MAP } from "../data/categories";
import { AudioPlayer } from "./AudioPlayer";
import { VideoPlayer } from "./VideoPlayer";
import { MasteredButton } from "./MasteredButton";
import { DoubleTapBurst } from "./DoubleTapBurst";
import { CategoryScene } from "./CategoryScene";
import { QuizOptions } from "./QuizOptions";
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
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const tapTimer = useRef<number | null>(null);
  const autoFlipTimer = useRef<number | null>(null);
  const haptics = useHaptics();

  useEffect(() => {
    if (!active) {
      setFlipped(false);
      setQuizSelected(null);
      if (autoFlipTimer.current !== null) {
        window.clearTimeout(autoFlipTimer.current);
        autoFlipTimer.current = null;
      }
    }
  }, [active]);

  useEffect(
    () => () => {
      if (autoFlipTimer.current !== null) window.clearTimeout(autoFlipTimer.current);
    },
    [],
  );

  const handleQuizSelect = (i: number) => {
    if (!card.quiz) return;
    setQuizSelected(i);
    if (i === card.quiz.correctIndex) haptics.success();
    else haptics.error();
    // Give a beat to see the correct/wrong colours, then reveal the full
    // explanation on the back — same rhythm as a Duolingo-style quiz.
    autoFlipTimer.current = window.setTimeout(() => {
      setFlipped(true);
    }, 900);
  };

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
      // On an unanswered quiz card, a plain tap shouldn't skip straight to
      // the answer — picking an option is the primary interaction.
      if (card.quiz && quizSelected === null && !flipped) return;
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
  const badge = showCategoryBadge
    ? { label: category.shortName, color: from }
    : undefined;

  return (
    <div className="relative h-full w-full snap-start shrink-0 overflow-hidden bg-[#0a1830]">
      <div
        className="relative h-full w-full"
        onClick={handleTap}
        style={{ perspective: 1600 }}
      >
        <motion.div
          className="preserve-3d relative h-full w-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          {/* FRONT — question, full-bleed cover art with an IG-caption overlay */}
          <div className="backface-hidden absolute inset-0 overflow-hidden">
            <CoverArt
              category={card.category}
              from={from}
              to={to}
              image={card.media?.frontImage}
              imageAlt={card.media?.frontImageAlt}
            />
            <TopScrim />
            <TopOverlay index={index} total={total} badge={badge} />
            <BottomScrim tall={!!card.quiz} />
            <div
              className={
                card.quiz
                  ? "absolute inset-x-0 bottom-0 flex max-h-[74%] flex-col gap-3 overflow-y-auto no-scrollbar px-5 pb-28 pt-24"
                  : "absolute inset-x-0 bottom-0 flex flex-col gap-2.5 px-5 pb-28 pt-24"
              }
            >
              <Eyebrow category={category.shortName} tag={card.tags?.[0]} quiz={!!card.quiz} />
              <p
                className={
                  card.quiz
                    ? "text-[20px] font-bold leading-[1.25] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-[23px]"
                    : "text-[25px] font-bold leading-[1.2] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-[29px]"
                }
              >
                {card.question}
              </p>
              {card.quiz ? (
                <QuizOptions
                  options={card.quiz.options}
                  correctIndex={card.quiz.correctIndex}
                  selected={quizSelected}
                  onSelect={handleQuizSelect}
                />
              ) : (
                <p className="text-[13px] font-medium text-white/60">
                  Tap to flip · double-tap to master
                </p>
              )}
            </div>
          </div>

          {/* BACK — answer, same cover art dimmed further for a long-text read */}
          <div
            className="backface-hidden absolute inset-0 overflow-hidden"
            style={{ transform: "rotateY(180deg)" }}
          >
            <CoverArt
              category={card.category}
              from={from}
              to={to}
              image={card.media?.image}
              imageAlt={card.media?.imageAlt}
              dim
            />
            <TopScrim />
            <TopOverlay index={index} total={total} badge={badge} />
            <BottomScrim tall />
            <div className="absolute inset-x-0 bottom-0 flex max-h-[72%] flex-col gap-4 overflow-y-auto no-scrollbar px-5 pb-28 pt-24">
              <Eyebrow category={category.shortName} tag={card.tags?.[0]} answer />
              {card.quiz && quizSelected !== null && (
                <QuizResult correct={quizSelected === card.quiz.correctIndex} />
              )}
              <p className="text-[17px] leading-relaxed text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
                {card.answer}
              </p>
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
      <div className="absolute bottom-32 right-4 z-10 flex flex-col items-center gap-5">
        <MasteredButton mastered={mastered} onToggle={doHeartToggle} />
      </div>
    </div>
  );
}

/** The full-bleed cover behind everything: a real photo/diagram if the card has one, else a bold illustrated scene for that category — never plain text-on-gradient. */
function CoverArt({
  category,
  from,
  to,
  image,
  imageAlt,
  dim,
}: {
  category: FlashcardData["category"];
  from: string;
  to: string;
  image?: string;
  imageAlt?: string;
  dim?: boolean;
}) {
  return (
    <div className="absolute inset-0">
      {/* Always render the illustrated scene as the ambient backdrop, even
          when a custom diagram exists — it's drawn as a landscape "contained"
          graphic with its own baked-in labels, so it's overlaid centered
          rather than cropped edge-to-edge over it. */}
      <CategoryScene category={category} from={from} to={to} className="h-full w-full" />
      {image && (
        <div
          className="absolute inset-x-0 top-0 flex items-center justify-center px-6"
          style={{ height: "58%", paddingTop: "calc(env(safe-area-inset-top) + 100px)" }}
        >
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="h-full w-full object-contain drop-shadow-2xl"
            draggable={false}
          />
        </div>
      )}
      {dim && <div className="absolute inset-0 bg-[#050c19]/45" />}
    </div>
  );
}

function TopScrim() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-40"
      style={{
        background:
          "linear-gradient(to bottom, rgba(5,10,20,0.55), rgba(5,10,20,0))",
      }}
    />
  );
}

function BottomScrim({ tall }: { tall: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0"
      style={{
        height: tall ? "78%" : "62%",
        background: tall
          ? "linear-gradient(to top, rgba(4,9,18,0.97) 0%, rgba(4,9,18,0.86) 38%, rgba(4,9,18,0.35) 75%, rgba(4,9,18,0) 100%)"
          : "linear-gradient(to top, rgba(4,9,18,0.92) 0%, rgba(4,9,18,0.55) 55%, rgba(4,9,18,0) 100%)",
      }}
    />
  );
}

function QuizResult({ correct }: { correct: boolean }) {
  return (
    <div
      className={
        correct
          ? "inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/25 px-3 py-1 text-sm font-semibold text-emerald-100"
          : "inline-flex w-fit items-center gap-1.5 rounded-full bg-rose-500/25 px-3 py-1 text-sm font-semibold text-rose-100"
      }
    >
      {correct ? "✓ Nice — that's right" : "✕ Not quite — here's why"}
    </div>
  );
}

function Eyebrow({
  category,
  tag,
  answer,
  quiz,
}: {
  category: string;
  tag?: string;
  answer?: boolean;
  quiz?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
      <span className="text-white/70">{answer ? "Answer" : category}</span>
      {quiz && (
        <span className="rounded-full bg-fuchsia-500/25 px-2.5 py-0.5 normal-case tracking-normal text-fuchsia-100">
          Quiz
        </span>
      )}
      {tag && (
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 normal-case tracking-normal text-white/80">
          {tag}
        </span>
      )}
    </div>
  );
}

function TopOverlay({
  index,
  total,
  badge,
}: {
  index: number;
  total: number;
  badge?: { label: string; color: string };
}) {
  return (
    <div
      className="pointer-events-none absolute inset-x-4 z-10 flex items-center justify-between text-xs font-medium text-white/70"
      style={{ top: "calc(env(safe-area-inset-top) + 76px)" }}
    >
      <span className="rounded-full bg-black/30 px-2.5 py-1 backdrop-blur-sm">
        {index + 1} / {total}
      </span>
      {badge && (
        <span
          className="rounded-full px-2.5 py-1 font-semibold backdrop-blur-sm"
          style={{
            color: badge.color,
            backgroundColor: `${badge.color}22`,
            border: `1px solid ${badge.color}55`,
          }}
        >
          {badge.label}
        </span>
      )}
    </div>
  );
}
