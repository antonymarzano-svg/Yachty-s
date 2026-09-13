export type NewsTopic = "regulation" | "racing" | "careers" | "superyachts";

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  /** Link to the publication's coverage (article-specific where we have a real URL, otherwise its news section). */
  url: string;
  dateLabel: string;
  topic: NewsTopic;
}

export const NEWS_TOPIC_META: Record<
  NewsTopic,
  { label: string; gradient: [string, string] }
> = {
  regulation: { label: "Regulation", gradient: ["#f97316", "#facc15"] },
  racing: { label: "Racing", gradient: ["#fb7185", "#f97316"] },
  careers: { label: "Careers", gradient: ["#34d399", "#facc15"] },
  superyachts: { label: "Superyachts", gradient: ["#38bdf8", "#a78bfa"] },
};

/**
 * Real, current yachting-world headlines — hand-picked and summarised by
 * Claude from live web search, NOT auto-fetched at runtime (the hosted
 * preview link can't make arbitrary outbound requests). Ask to have this
 * refreshed any time; see README for how.
 */
export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "news-001",
    headline: "MCA launches the new Yacht Unlimited Certificate of Competency",
    summary:
      "Published 18 May 2026, this new MCA qualification pathway significantly changes the route to the top for anyone whose career is entirely in yachts, rather than merchant ships. An equivalent engineering pathway is due later in 2026.",
    source: "Ardent Training",
    url: "https://blog.ardent-training.com/new-route-to-the-top-for-yacht-professionals-mca-launches-yacht-unlimited-certificate-of-competency/",
    dateLabel: "May 2026",
    topic: "regulation",
  },
  {
    id: "news-002",
    headline: "STCW's PSSR training now covers harassment and assault prevention",
    summary:
      "Following IMO Resolution MSC.560(108), the MCA has confirmed that from 2026 all new seafarers' Personal Safety & Social Responsibilities (PSSR) training includes mandatory content on preventing and responding to bullying, sexual harassment and sexual assault at sea. Certificates issued before 1 Jan 2026 stay valid — no retake required.",
    source: "Nautilus International",
    url: "https://www.nautilusint.org/en/news-insight/news/mca-clarifies-approach-to-new-imo-violence-and-harassment-training-rules/",
    dateLabel: "2026",
    topic: "regulation",
  },
  {
    id: "news-003",
    headline: "The Ocean Race Atlantic debuts as a transatlantic IMOCA sprint",
    summary:
      "September 2026 marks the first-ever point-to-point race in The Ocean Race's 50-year history: a fully-crewed, gender-balanced sprint (two women, two men, plus an onboard reporter) for foiling IMOCA boats from New York to Europe.",
    source: "The Ocean Race",
    url: "https://www.theoceanrace.com/en/news/14716_The-Ocean-Race-Atlantic-is-set-to-launch-in-2026",
    dateLabel: "Sep 2026",
    topic: "racing",
  },
  {
    id: "news-004",
    headline: "SailGP's 2026 season grows to a record 13-nation fleet",
    summary:
      "This season brings a $12.8 million total prize purse and the debut of Artemis SailGP flying Sweden's colours, led by Olympic legend Iain Percy and driven by Nathan Outteridge — foiling F50 catamarans racing worldwide.",
    source: "SailGP",
    url: "https://sailgp.com/news/25/sailgp-2026-season-what-you-need-to-know/",
    dateLabel: "2026 season",
    topic: "racing",
  },
  {
    id: "news-005",
    headline: "Superyacht crew demand stays strong — but so do the entry requirements",
    summary:
      "With global yacht build numbers high and charter demand strong through 2026, qualified deckhands and stewardesses remain in steady demand. STCW, ENG1 and Powerboat Level 2 are the baseline; secondary skills like watersports, diving, photography and wellness quals now stand out.",
    source: "UKSA / Flying Fish",
    url: "https://uksa.org/news-and-guides/how-to-become-a-superyacht-deckhand/",
    dateLabel: "2026",
    topic: "careers",
  },
  {
    id: "news-006",
    headline: "Monaco Yacht Show 2026 lines up dozens of world premieres",
    summary:
      "Fresh deliveries heading into the show include Heesen's 57m custom superyacht Project Setteesettanta, ISA Yachts' Gran Turismo 67M Sea Raider X, and Aquila's new 35 Sport power catamaran — while the 88m Feadship Zen was recently spotted cruising Seattle to Juneau, Alaska.",
    source: "SuperYacht Times",
    url: "https://www.superyachttimes.com/news",
    dateLabel: "2026",
    topic: "superyachts",
  },
];
