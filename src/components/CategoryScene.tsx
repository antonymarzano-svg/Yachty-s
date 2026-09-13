import type { CategoryId } from "../data/types";

interface CategorySceneProps {
  category: CategoryId;
  from: string;
  to: string;
  className?: string;
}

/**
 * Full-bleed, poster-style illustration used as a card's cover art when it
 * has no custom photo — one bold, colorful scene per category instead of a
 * faint line-icon watermark, so every card in the feed has something to
 * actually look at (flat-illustration/"IG infographic carousel" style,
 * not a photo, but unmistakably an image rather than plain text-on-color).
 */
export function CategoryScene({ category, from, to, className }: CategorySceneProps) {
  const uid = `scene-${category}`;

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
        <radialGradient id={`${uid}-glow`} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="700" fill="#0a1830" />
      <rect width="400" height="700" fill={`url(#${uid}-bg)`} />
      <rect width="400" height="700" fill={`url(#${uid}-glow)`} />

      {renderScene(category, from, to, uid)}

      {/* fine grain of stars for depth on every scene */}
      {STAR_DOTS.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#ffffff" opacity={0.25} />
      ))}
    </svg>
  );
}

const STAR_DOTS: Array<[number, number, number]> = [
  [30, 60, 1.4], [90, 40, 1], [340, 70, 1.6], [370, 130, 1],
  [20, 180, 1], [360, 220, 1.3], [50, 260, 1], [320, 40, 1.2],
  [200, 30, 1], [270, 90, 1.4], [130, 55, 1], [380, 300, 1],
];

function renderScene(category: CategoryId, from: string, to: string, uid: string) {
  switch (category) {
    case "oow3000":
      return <OowScene from={from} to={to} uid={uid} />;
    case "gsk":
      return <GskScene from={from} to={to} />;
    case "nav-radar":
      return <NavRadarScene from={from} to={to} />;
    case "aec":
      return <AecScene from={from} to={to} />;
    case "gmdss":
      return <GmdssScene from={from} to={to} />;
    default:
      return null;
  }
}

/** COLREGS — an aerial view of two cargo vessels on crossing courses, styled after real drone/satellite ship photography. */
function OowScene({ to, uid }: { from: string; to: string; uid: string }) {
  return (
    <g>
      {/* soft sun glow, upper right — aerial-photo lighting, not a flat disc */}
      <defs>
        <radialGradient id={`${uid}-sun`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="320" cy="140" r="110" fill={`url(#${uid}-sun)`} />

      {/* ocean ripple texture across the whole frame */}
      {Array.from({ length: 10 }).map((_, i) => {
        const y = 40 + i * 68;
        return (
          <path
            key={y}
            d={`M-20 ${y} Q 80 ${y - 16} 180 ${y} T 420 ${y}`}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.06}
            strokeWidth="2"
          />
        );
      })}

      <TopDownShip x={272} y={230} rotate={100} hull="#16233b" deck={to} scale={1} />
      <TopDownShip x={118} y={470} rotate={10} hull="#1e293b" deck={to} scale={0.92} />

      {/* dashed heading indicators, like a chart-plotter course line */}
      <path d="M272 300 L272 380" stroke="#e2e8f0" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="5 6" />
      <path d="M118 400 L118 340" stroke="#e2e8f0" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="5 6" />
    </g>
  );
}

/** A stylised aerial cargo-ship silhouette: pointed bow, container stacks, stern accommodation block, trailing wake. */
function TopDownShip({
  x,
  y,
  rotate,
  hull,
  deck,
  scale = 1,
}: {
  x: number;
  y: number;
  rotate: number;
  hull: string;
  deck: string;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {/* wake, trailing from the stern */}
      <path d="M-16 92 L16 92 L40 175 L-40 175 Z" fill="#ffffff" opacity="0.1" />
      {/* hull — pointed bow at top, flat stern at bottom */}
      <path
        d="M0 -100 C 24 -100 28 -68 28 -38 L28 82 C28 93 19 100 0 100 C -19 100 -28 93 -28 82 L-28 -38 C -28 -68 -24 -100 0 -100 Z"
        fill={hull}
        stroke="#000000"
        strokeOpacity="0.25"
        strokeWidth="1.5"
      />
      {/* bow deck line */}
      <path d="M0 -100 C 24 -100 28 -68 28 -38 L28 10 L-28 10 L-28 -38 C -28 -68 -24 -100 0 -100 Z" fill="#000000" opacity="0.08" />
      {/* COLREGS sidelights at the bow — port (red, left of the ship's own heading) and starboard (green, right) */}
      <circle cx="-17" cy="-78" r="6" fill="#ef4444" opacity="0.35" />
      <circle cx="-17" cy="-78" r="3.2" fill="#ef4444" />
      <circle cx="17" cy="-78" r="6" fill="#34d399" opacity="0.35" />
      <circle cx="17" cy="-78" r="3.2" fill="#34d399" />
      {/* accommodation block, near the stern */}
      <rect x="-15" y="55" width="30" height="30" rx="4" fill="#0a1830" opacity="0.7" />
      <rect x="-9" y="61" width="6" height="6" fill="#fde68a" opacity="0.8" />
      <rect x="3" y="61" width="6" height="6" fill="#fde68a" opacity="0.8" />
      {/* container stacks, two columns down the deck */}
      {[-75, -50, -25, 0, 25].map((cy) => (
        <g key={cy}>
          <rect x="-22" y={cy} width="17" height="20" rx="2" fill={deck} opacity="0.85" />
          <rect x="5" y={cy} width="17" height="20" rx="2" fill={deck} opacity="0.65" />
        </g>
      ))}
    </g>
  );
}

/** General Ship Knowledge — hull cross-section + weather above deck. */
function GskScene({ to }: { from: string; to: string }) {
  return (
    <g>
      {/* clouds + rain, for meteorology */}
      <g opacity="0.8">
        <ellipse cx="110" cy="120" rx="60" ry="26" fill="#e2e8f0" opacity="0.5" />
        <ellipse cx="160" cy="105" rx="46" ry="22" fill="#e2e8f0" opacity="0.4" />
        {[100, 130, 160, 190].map((x) => (
          <line key={x} x1={x} y1="150" x2={x - 10} y2="185" stroke="#bae6fd" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
        ))}
      </g>
      <circle cx="320" cy="90" r="34" fill="#fde68a" opacity="0.7" />

      {/* waterline */}
      <rect x="0" y="470" width="400" height="230" fill="#04263a" opacity="0.4" />

      {/* hull cross-section, cutaway showing decks */}
      <g transform="translate(60 380)">
        <path d="M0 60 L280 60 L250 190 L30 190 Z" fill={to} fillOpacity="0.35" stroke="#e2e8f0" strokeOpacity="0.4" strokeWidth="2" />
        <line x1="30" y1="60" x2="30" y2="10" stroke="#e2e8f0" strokeOpacity="0.5" strokeWidth="3" />
        <line x1="220" y1="60" x2="220" y2="10" stroke="#e2e8f0" strokeOpacity="0.5" strokeWidth="3" />
        <path d="M30 10 L125 -30 L220 10" fill="none" stroke="#e2e8f0" strokeOpacity="0.5" strokeWidth="3" />
        {/* deck lines */}
        <line x1="10" y1="100" x2="270" y2="100" stroke="#0a1830" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="5 6" />
        <line x1="20" y1="140" x2="260" y2="140" stroke="#0a1830" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="5 6" />
        {/* portholes */}
        {[60, 100, 140, 180].map((x) => (
          <circle key={x} cx={x} cy="120" r="8" fill="#0a1830" fillOpacity="0.5" stroke="#e2e8f0" strokeOpacity="0.4" />
        ))}
      </g>
    </g>
  );
}

/** Nav & Radar — radar sweep with contacts over a chart grid. */
function NavRadarScene({ from, to }: { from: string; to: string }) {
  return (
    <g>
      {/* faint chart grid */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={`h${i}`} x1="0" y1={80 + i * 100} x2="400" y2={80 + i * 100} stroke="#ffffff" strokeOpacity="0.05" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={`v${i}`} x1={40 + i * 90} y1="0" x2={40 + i * 90} y2="700" stroke="#ffffff" strokeOpacity="0.05" />
      ))}

      {/* radar rings centred mid-screen */}
      <g transform="translate(200 340)">
        {[170, 130, 90, 50].map((r) => (
          <circle key={r} r={r} fill="none" stroke={to} strokeOpacity="0.3" strokeWidth="1.5" />
        ))}
        {/* sweep wedge */}
        <path d="M0 0 L0 -170 A170 170 0 0 1 120 -120 Z" fill={from} opacity="0.28" />
        <line x1="0" y1="0" x2="0" y2="-170" stroke="#e0f2fe" strokeOpacity="0.6" strokeWidth="2" />
        {/* contacts */}
        <circle cx="70" cy="-100" r="4" fill="#facc15" />
        <circle cx="-110" cy="60" r="4" fill="#f87171" />
        <circle cx="40" cy="130" r="4" fill="#e0f2fe" />
        <circle cx="0" cy="0" r="5" fill="#e0f2fe" />
      </g>

      {/* compass rose, upper area */}
      <g transform="translate(320 130)" opacity="0.6">
        <circle r="44" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
        <path d="M0 -44 L8 -10 L0 0 L-8 -10 Z" fill="#ffffff" fillOpacity="0.55" />
        <path d="M0 44 L8 10 L0 0 L-8 10 Z" fill="#ffffff" fillOpacity="0.25" />
      </g>
    </g>
  );
}

/** AEC — engine-room gears, gauges and pipework. */
function AecScene({ from, to }: { from: string; to: string }) {
  return (
    <g>
      <rect x="0" y="0" width="400" height="700" fill="#1c1006" opacity="0.15" />
      {/* pipes */}
      <path d="M0 560 H120 V500 H400" fill="none" stroke="#e2e8f0" strokeOpacity="0.18" strokeWidth="10" />
      <path d="M0 620 H80 V660 H400" fill="none" stroke="#e2e8f0" strokeOpacity="0.14" strokeWidth="8" />

      {/* big interlocking gears */}
      <Gear cx={140} cy={280} r={80} teeth={10} fill={from} opacity={0.5} />
      <Gear cx={255} cy={220} r={52} teeth={8} fill={to} opacity={0.55} />
      <Gear cx={110} cy={400} r={40} teeth={8} fill="#e2e8f0" opacity={0.28} />

      {/* pressure gauge */}
      <g transform="translate(300 460)">
        <circle r="46" fill="#0a1830" fillOpacity="0.5" stroke="#e2e8f0" strokeOpacity="0.4" strokeWidth="3" />
        <circle r="46" fill="none" stroke={to} strokeOpacity="0.6" strokeWidth="3" strokeDasharray="220 400" transform="rotate(-90)" />
        <line x1="0" y1="0" x2="22" y2="-22" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" />
        <circle r="4" fill="#e2e8f0" />
      </g>
    </g>
  );
}

function Gear({
  cx, cy, r, teeth, fill, opacity,
}: { cx: number; cy: number; r: number; teeth: number; fill: string; opacity: number }) {
  const toothLen = r * 0.22;
  return (
    <g transform={`translate(${cx} ${cy})`} opacity={opacity}>
      {Array.from({ length: teeth }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / teeth;
        const deg = (angle * 180) / Math.PI;
        return (
          <rect
            key={i}
            x={-r * 0.09}
            y={-r - toothLen}
            width={r * 0.18}
            height={toothLen + 6}
            fill={fill}
            transform={`rotate(${deg})`}
          />
        );
      })}
      <circle r={r} fill={fill} />
      <circle r={r * 0.35} fill="#0a1830" fillOpacity="0.6" />
    </g>
  );
}

/** GMDSS — radio mast broadcasting signal arcs into a night sky with a satellite. */
function GmdssScene({ from, to }: { from: string; to: string }) {
  return (
    <g>
      {/* orbiting satellite */}
      <g transform="translate(300 120)" opacity="0.75">
        <rect x="-6" y="-6" width="12" height="12" fill="#e2e8f0" />
        <rect x="-22" y="-3" width="14" height="6" fill={to} />
        <rect x="8" y="-3" width="14" height="6" fill={to} />
      </g>
      <path d="M60 60 Q 200 -10 340 110" fill="none" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="2 6" />

      {/* mast */}
      <line x1="200" y1="240" x2="200" y2="560" stroke="#e2e8f0" strokeOpacity="0.55" strokeWidth="5" />
      <path d="M170 560 L200 240 L230 560 Z" fill="none" stroke="#e2e8f0" strokeOpacity="0.25" strokeWidth="2" />
      <circle cx="200" cy="234" r="6" fill="#f87171" />

      {/* signal arcs radiating from mast top */}
      {[50, 90, 130, 170].map((r, i) => (
        <path
          key={r}
          d={`M ${200 - r} 240 A ${r} ${r} 0 0 1 ${200 + r} 240`}
          fill="none"
          stroke={from}
          strokeOpacity={0.5 - i * 0.09}
          strokeWidth="3"
        />
      ))}

      {/* base building */}
      <rect x="150" y="560" width="100" height="70" fill={to} fillOpacity="0.35" stroke="#e2e8f0" strokeOpacity="0.3" strokeWidth="2" />
      <rect x="180" y="590" width="18" height="40" fill="#0a1830" fillOpacity="0.5" />

      {/* morse-style dot/dash strip */}
      <g transform="translate(40 650)" opacity="0.5">
        <rect x="0" y="0" width="10" height="6" fill="#e2e8f0" />
        <rect x="18" y="0" width="26" height="6" fill="#e2e8f0" />
        <rect x="52" y="0" width="10" height="6" fill="#e2e8f0" />
        <rect x="70" y="0" width="10" height="6" fill="#e2e8f0" />
        <rect x="88" y="0" width="26" height="6" fill="#e2e8f0" />
      </g>
    </g>
  );
}
