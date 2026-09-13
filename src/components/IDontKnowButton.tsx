interface IDontKnowButtonProps {
  onPress: () => void;
}

/**
 * The "I don't know this" counterpart to the heart — earns no points,
 * un-masters the card if needed, and always reveals the answer so the tap
 * visibly does something even when the card wasn't mastered to begin with.
 */
export function IDontKnowButton({ onPress }: IDontKnowButtonProps) {
  return (
    <button
      type="button"
      aria-label="I don't know this one — show the answer"
      onClick={(e) => {
        e.stopPropagation();
        onPress();
      }}
      className="flex flex-col items-center gap-1 text-white/80 drop-shadow-lg active:scale-90 transition-transform"
    >
      <CrossIcon className="h-8 w-8 text-rose-400" />
      <span className="text-[11px] font-semibold tracking-wide text-white/70">
        I don't know
      </span>
    </button>
  );
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
    >
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}
