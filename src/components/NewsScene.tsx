import type { NewsTopic } from "../data/news";

interface NewsSceneProps {
  topic: NewsTopic;
  from: string;
  to: string;
  className?: string;
}

/** Full-bleed poster art for a news card, one scene per topic — same visual language as CategoryScene. */
export function NewsScene({ topic, from, to, className }: NewsSceneProps) {
  const uid = `news-${topic}`;
  return (
    <svg
      viewBox="0 0 400 700"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={from} stopOpacity="0.55" />
          <stop offset="100%" stopColor={to} stopOpacity="0.55" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="25%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="700" fill="#0a1830" />
      <rect width="400" height="700" fill={`url(#${uid}-bg)`} />
      <rect width="400" height="700" fill={`url(#${uid}-glow)`} />
      {renderTopic(topic)}
    </svg>
  );
}

function renderTopic(topic: NewsTopic) {
  switch (topic) {
    case "regulation":
      return (
        <g>
          <circle cx="200" cy="230" r="90" fill="#ffffff" opacity="0.06" />
          {/* certificate / document */}
          <rect x="130" y="150" width="140" height="180" rx="8" fill="#e2e8f0" opacity="0.85" />
          <circle cx="200" cy="200" r="26" fill="none" stroke="#f59e0b" strokeWidth="4" opacity="0.8" />
          <path d="M188 200 l8 8 l16 -18" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {[240, 260, 280, 300].map((y) => (
            <line key={y} x1="150" y1={y} x2="250" y2={y} stroke="#0a1830" strokeOpacity="0.25" strokeWidth="4" />
          ))}
          {/* waves at base */}
          {[520, 570, 620].map((y, i) => (
            <path key={y} d={`M0 ${y} Q 100 ${y - 16} 200 ${y} T 400 ${y}`} fill="none" stroke="#ffffff" strokeOpacity={0.12 - i * 0.02} strokeWidth="3" />
          ))}
        </g>
      );
    case "racing":
      return (
        <g>
          {/* foiling catamaran silhouette with spinnaker */}
          <path d="M200 150 L260 420 L200 460 L140 420 Z" fill="#e2e8f0" opacity="0.85" />
          <path d="M200 165 L230 400 L200 420 L170 400 Z" fill="#0a1830" opacity="0.4" />
          {/* speed lines */}
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={80 - i * 10} y1={250 + i * 60} x2={160 - i * 10} y2={250 + i * 60} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <line key={`r${i}`} x1={240 + i * 10} y1={250 + i * 60} x2={320 + i * 10} y2={250 + i * 60} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
          ))}
          {/* wake */}
          {[520, 560, 600].map((y, i) => (
            <path key={y} d={`M120 ${y} Q 200 ${y + 20} 280 ${y}`} fill="none" stroke="#ffffff" strokeOpacity={0.25 - i * 0.06} strokeWidth="4" />
          ))}
        </g>
      );
    case "careers":
      return (
        <g>
          {/* sunrise over a marina */}
          <circle cx="200" cy="280" r="80" fill="#fde68a" opacity="0.55" />
          <rect x="0" y="500" width="400" height="200" fill="#04263a" opacity="0.4" />
          {/* dock / marina pilings */}
          {[60, 140, 220, 300, 380].map((x) => (
            <rect key={x} x={x - 5} y="480" width="10" height="120" fill="#e2e8f0" opacity="0.4" />
          ))}
          {/* duffel bag */}
          <g transform="translate(200 560)">
            <rect x="-50" y="-10" width="100" height="60" rx="16" fill="#e2e8f0" opacity="0.85" />
            <path d="M-25 -10 Q -25 -35 0 -35 Q 25 -35 25 -10" fill="none" stroke="#e2e8f0" strokeOpacity="0.85" strokeWidth="6" />
          </g>
        </g>
      );
    case "superyachts":
      return (
        <g>
          {/* skyline of harbour lights */}
          {[40, 90, 150, 250, 310, 360].map((x, i) => (
            <rect key={x} x={x} y={340 + (i % 2) * 20} width="14" height={120 - (i % 2) * 20} fill="#e2e8f0" opacity="0.15" />
          ))}
          {/* big yacht silhouette */}
          <path d="M60 480 L340 480 L300 560 L100 560 Z" fill="#e2e8f0" opacity="0.85" />
          <rect x="140" y="420" width="120" height="60" rx="6" fill="#e2e8f0" opacity="0.85" />
          <rect x="170" y="380" width="60" height="40" rx="4" fill="#e2e8f0" opacity="0.85" />
          {[160, 190, 220, 250].map((x) => (
            <rect key={x} x={x} y="430" width="14" height="14" fill="#0a1830" opacity="0.4" />
          ))}
          {[500, 540].map((y, i) => (
            <path key={y} d={`M20 ${y} Q 100 ${y - 12} 200 ${y} T 380 ${y}`} fill="none" stroke="#ffffff" strokeOpacity={0.15 - i * 0.05} strokeWidth="3" />
          ))}
        </g>
      );
    default:
      return null;
  }
}
