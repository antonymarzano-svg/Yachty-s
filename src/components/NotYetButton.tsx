interface NotYetButtonProps {
  onPress: () => void;
}

/**
 * The "I don't know this one yet" counterpart to the heart — earns no
 * points and (if the card was mastered) un-masters it, so a wrong
 * self-assessment can be corrected honestly.
 */
export function NotYetButton({ onPress }: NotYetButtonProps) {
  return (
    <button
      type="button"
      aria-label="Not mastered yet — keep studying this one"
      onClick={(e) => {
        e.stopPropagation();
        onPress();
      }}
      className="flex flex-col items-center gap-1 text-white/80 drop-shadow-lg active:scale-90 transition-transform"
    >
      <RefreshIcon className="h-8 w-8" />
      <span className="text-[11px] font-semibold tracking-wide text-white/70">
        Not yet
      </span>
    </button>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
