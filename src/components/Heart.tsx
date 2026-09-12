interface HeartIconProps {
  filled: boolean;
  className?: string;
}

/** A single heart glyph, filled or outline. */
export function HeartIcon({ filled, className }: HeartIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.8}
    >
      <path d="M12 20.5s-7.3-4.6-10-9.3C.4 8 1.6 4.6 4.7 3.4 7 2.5 9.4 3.3 12 6c2.6-2.7 5-3.5 7.3-2.6 3.1 1.2 4.3 4.6 2.7 7.8-2.7 4.7-10 9.3-10 9.3z" />
    </svg>
  );
}
