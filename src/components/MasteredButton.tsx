import { AnimatePresence, motion } from "framer-motion";
import { HeartIcon } from "./Heart";

interface MasteredButtonProps {
  mastered: boolean;
  onToggle: () => void;
}

/**
 * The heart "mastered" toggle, styled like an IG Reels like button.
 * Pops/bounces on every state change.
 */
export function MasteredButton({ mastered, onToggle }: MasteredButtonProps) {
  return (
    <button
      type="button"
      aria-label={mastered ? "Marked as mastered" : "Mark as mastered"}
      aria-pressed={mastered}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="flex flex-col items-center gap-1 text-white drop-shadow-lg active:scale-90 transition-transform"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mastered ? "on" : "off"}
          initial={{ scale: 0.6, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className={mastered ? "text-rose-500" : "text-white"}
        >
          <HeartIcon filled={mastered} className="h-9 w-9" />
        </motion.span>
      </AnimatePresence>
      <span className="text-[11px] font-semibold tracking-wide text-white/80">
        {mastered ? "Mastered" : "Master"}
      </span>
    </button>
  );
}
