import { AnimatePresence, motion } from "framer-motion";
import { HeartIcon } from "./Heart";

interface DoubleTapBurstProps {
  /** Increment this number every time a burst should fire. */
  trigger: number;
}

/**
 * The big center heart that pops and fades on double-tap, IG-style.
 * Purely decorative — mastered state is toggled by the caller.
 */
export function DoubleTapBurst({ trigger }: DoubleTapBurstProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <AnimatePresence>
        {trigger > 0 && (
          <motion.div
            key={trigger}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{
              scale: [0.4, 1.15, 1],
              opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 0.9, times: [0, 0.35, 0.6, 1] }}
            className="text-rose-500 drop-shadow-2xl"
          >
            <HeartIcon filled className="h-28 w-28" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
