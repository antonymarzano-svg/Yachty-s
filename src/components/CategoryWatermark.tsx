import type { CSSProperties } from "react";
import type { CategoryId } from "../data/types";

interface CategoryWatermarkProps {
  category: CategoryId;
  className?: string;
  style?: CSSProperties;
}

/**
 * A large, low-opacity nautical icon used as background texture on cards
 * that don't have a specific illustration — keeps the plain-text cards
 * feeling like part of the same fun, illustrated feed instead of a bare
 * quiz screen.
 */
export function CategoryWatermark({
  category,
  className,
  style,
}: CategoryWatermarkProps) {
  const common = {
    className,
    style,
    viewBox: "0 0 100 100",
    fill: "none",
    stroke: "currentColor",
  };

  switch (category) {
    case "oow3000":
      // ship's helm / wheel — rules of the road
      return (
        <svg {...common} strokeWidth={2.5}>
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="7" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const x1 = 50 + Math.cos(angle) * 30;
            const y1 = 50 + Math.sin(angle) * 30;
            const x2 = 50 + Math.cos(angle) * 40;
            const y2 = 50 + Math.sin(angle) * 40;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
      );
    case "gsk":
      // ship hull cross-section — general ship knowledge
      return (
        <svg {...common} strokeWidth={2.5}>
          <path d="M15 55 L85 55 L75 82 L25 82 Z" />
          <line x1="30" y1="55" x2="30" y2="30" />
          <line x1="70" y1="55" x2="70" y2="30" />
          <line x1="15" y1="55" x2="85" y2="55" />
          <path d="M30 30 L50 18 L70 30" />
          <line x1="20" y1="65" x2="80" y2="65" strokeDasharray="4 4" />
        </svg>
      );
    case "nav-radar":
      // compass rose
      return (
        <svg {...common} strokeWidth={2.5}>
          <circle cx="50" cy="50" r="32" />
          <path d="M50 22 L57 46 L50 78 L43 46 Z" />
          <path d="M22 50 L46 43 L78 50 L46 57 Z" opacity="0.5" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
      );
    case "aec":
      // gear / cog — auxiliary equipment & construction (engineering)
      return (
        <svg {...common} strokeWidth={2.5}>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const cx = 50 + Math.cos(angle) * 34;
            const cy = 50 + Math.sin(angle) * 34;
            const deg = (angle * 180) / Math.PI;
            return (
              <rect
                key={i}
                x={cx - 5}
                y={cy - 4}
                width="10"
                height="8"
                transform={`rotate(${deg} ${cx} ${cy})`}
              />
            );
          })}
          <circle cx="50" cy="50" r="26" />
          <circle cx="50" cy="50" r="11" />
        </svg>
      );
    default:
      return null;
  }
}
