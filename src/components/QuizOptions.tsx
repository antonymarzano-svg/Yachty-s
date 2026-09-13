import { motion } from "framer-motion";
import clsx from "clsx";

interface QuizOptionsProps {
  options: string[];
  correctIndex: number;
  selected: number | null;
  onSelect: (index: number) => void;
}

const LETTERS = ["A", "B", "C", "D"];

/**
 * Tap-an-answer multiple-choice options, shown in the bottom caption panel
 * of a quiz card. Once `selected` is set, the correct option turns green
 * and (if the tap was wrong) the tapped option turns red — Duolingo-style
 * instant feedback — and every button locks.
 */
export function QuizOptions({
  options,
  correctIndex,
  selected,
  onSelect,
}: QuizOptionsProps) {
  const answered = selected !== null;

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt, i) => {
        const isCorrect = i === correctIndex;
        const isPicked = i === selected;
        const reveal = answered && (isCorrect || isPicked);

        return (
          <motion.button
            key={i}
            type="button"
            disabled={answered}
            onClick={(e) => {
              e.stopPropagation();
              if (!answered) onSelect(i);
            }}
            initial={false}
            animate={
              isPicked && !isCorrect
                ? { x: [0, -6, 6, -4, 4, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.35 }}
            className={clsx(
              "flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-[15px] font-medium backdrop-blur-md transition-colors",
              reveal && isCorrect
                ? "border-emerald-400/70 bg-emerald-500/25 text-emerald-50"
                : reveal && isPicked
                  ? "border-rose-400/70 bg-rose-500/25 text-rose-50"
                  : "border-white/20 bg-black/35 text-white/90 active:bg-white/10",
            )}
          >
            <span
              className={clsx(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                reveal && isCorrect
                  ? "bg-emerald-400 text-emerald-950"
                  : reveal && isPicked
                    ? "bg-rose-400 text-rose-950"
                    : "bg-white/15 text-white/70",
              )}
            >
              {reveal && isCorrect ? "✓" : reveal && isPicked ? "✕" : LETTERS[i]}
            </span>
            <span className="leading-snug">{opt}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
