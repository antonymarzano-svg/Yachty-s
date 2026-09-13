import { NEWS_ITEMS } from "../data/news";
import { NewsCard } from "./NewsCard";

/** Vertical snap-scroll feed of real yachting news — same feel as the study feed, no flip/mastery. */
export function NewsFeed() {
  return (
    <div
      className="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll"
      style={{ touchAction: "pan-y", overscrollBehaviorY: "contain" }}
    >
      {NEWS_ITEMS.map((item, i) => (
        <NewsCard key={item.id} item={item} index={i} total={NEWS_ITEMS.length} />
      ))}
    </div>
  );
}
