import { AnimatePresence, motion } from "framer-motion";

interface RankUpToastProps {
  rankName: string | null;
}

/** A brief, celebratory full-screen overlay when you cross into a new rank — a real event, not a quiet badge update. */
export function RankUpToast({ rankName }: RankUpToastProps) {
  return (
    <AnimatePresence>
      {rankName && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <motion.div
            className="relative flex flex-col items-center gap-2 rounded-3xl border border-amber-300/40 bg-[#0a1830]/95 px-8 py-7 text-center shadow-2xl"
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="text-5xl">🎉</span>
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">
              Rank up!
            </p>
            <p className="text-2xl font-bold text-white">You're now {startsWithVowel(rankName) ? "an" : "a"} {rankName}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function startsWithVowel(word: string) {
  return /^[aeiou]/i.test(word);
}
