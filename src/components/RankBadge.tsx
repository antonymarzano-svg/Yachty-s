import { getRankStatus } from "../data/ranks";

interface RankBadgeProps {
  points: number;
  streak: number;
}

/** Persistent rank/points/streak pill, top-right of the app on every tab — climbs a real yacht career ladder as you earn points. */
export function RankBadge({ points, streak }: RankBadgeProps) {
  const { current, next, progress, pointsToNext } = getRankStatus(points);

  return (
    <div
      className="flex shrink-0 flex-col items-end gap-1 rounded-2xl border border-white/15 bg-black/40 px-3 py-1.5 backdrop-blur-md"
      title={
        next
          ? `${pointsToNext} pts to ${next.shortName}`
          : "Top rank reached"
      }
    >
      <div className="flex items-center gap-1.5">
        {streak > 0 && (
          <>
            <FlameIcon className="h-3.5 w-3.5 text-orange-400" />
            <span className="text-xs font-bold text-orange-300">{streak}</span>
            <span className="h-3 w-px bg-white/15" />
          </>
        )}
        <RankIcon />
        <span className="text-xs font-bold text-white">{current.shortName}</span>
        <span className="text-[11px] font-medium text-white/50">{points} pts</span>
      </div>
      <div className="h-1 w-20 overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-amber-300 transition-[width] duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

function RankIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-amber-300" fill="currentColor">
      <path d="M12 2l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 19.1l1.4-6.3-4.8-4.3 6.4-.6z" />
    </svg>
  );
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2c1 3-3 4.5-3 8a3 3 0 0 0 6 0c1 1 1.5 2.3 1.5 3.5A4.5 4.5 0 0 1 12 18a5.5 5.5 0 0 1-5.5-5.5C6.5 8 9 6 9 3.5c1.5 1 2 2.3 1.5 3.5C11.5 5 12 3.5 12 2z" />
    </svg>
  );
}
