import type { NewsItem } from "../data/news";
import { NEWS_TOPIC_META } from "../data/news";
import { NewsScene } from "./NewsScene";

interface NewsCardProps {
  item: NewsItem;
  index: number;
  total: number;
}

/** Full-bleed news post — same Reels-style layout as a Flashcard, but no flip/mastery, just a real headline and a link out. */
export function NewsCard({ item, index, total }: NewsCardProps) {
  const meta = NEWS_TOPIC_META[item.topic];
  const [from, to] = meta.gradient;

  return (
    <div className="relative h-full w-full snap-start shrink-0 overflow-hidden bg-[#0a1830]">
      <NewsScene topic={item.topic} from={from} to={to} className="absolute inset-0 h-full w-full" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: "linear-gradient(to bottom, rgba(5,10,20,0.55), rgba(5,10,20,0))" }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "68%",
          background:
            "linear-gradient(to top, rgba(4,9,18,0.95) 0%, rgba(4,9,18,0.7) 45%, rgba(4,9,18,0) 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-4 z-10 flex items-center justify-between text-xs font-medium text-white/70"
        style={{ top: "calc(env(safe-area-inset-top) + 76px)" }}
      >
        <span className="rounded-full bg-black/30 px-2.5 py-1 backdrop-blur-sm">
          {index + 1} / {total}
        </span>
        <span
          className="rounded-full px-2.5 py-1 font-semibold backdrop-blur-sm"
          style={{ color: from, backgroundColor: `${from}22`, border: `1px solid ${from}55` }}
        >
          {meta.label}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 px-5 pb-28 pt-24">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/60">
          <span>{item.source}</span>
          <span className="h-1 w-1 rounded-full bg-white/40" />
          <span>{item.dateLabel}</span>
        </div>
        <p className="text-[23px] font-bold leading-[1.25] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
          {item.headline}
        </p>
        <p className="text-[15px] leading-relaxed text-white/85">{item.summary}</p>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md active:scale-95"
        >
          Read full article ↗
        </a>
      </div>
    </div>
  );
}
