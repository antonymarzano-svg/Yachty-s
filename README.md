# Yachty'S

A mobile-first study app for OOW (Officer of the Watch) deck officer exam
prep — a vertical, swipeable feed of flashcards styled and animated like
Instagram Reels / TikTok rather than a traditional quiz app.

- Full-screen vertical snap-scroll feed (native momentum + snap, not a
  custom drag re-implementation)
- Tap a card to flip it with a 3D animation (front = question, back =
  answer)
- Double-tap, or tap the heart, to mark a card "mastered" — with an IG-style
  heart pop
- Haptic feedback on flip / swipe / mastering (via Capacitor Haptics, with
  an automatic web fallback so it also works in a plain browser)
- Dark mode with a warm, per-category nautical color palette (port-red →
  starboard-green for COLREGS, teal/blue for GSK, ocean blue/indigo for
  Nav & Radar, lighthouse amber/orange for AEC) plus a large low-opacity
  nautical icon watermarked behind every plain-text card, so the feed feels
  illustrated even before any custom artwork is added
- Category pills for **OOW 3000**, **GSK**, **Nav & Radar**, **AEC**, each
  showing live "mastered" progress
- "Unmastered only" filter per category
- Cards can carry a scene-setting illustration on the front (e.g. two boats
  shown crossing for a Rule 15 question), a diagram/photo revealed with the
  answer on the back, and/or an inline audio clip (e.g. COLREGS sound
  signals) with a custom-styled play button
- All progress is stored on-device (`localStorage`) — no login/backend for
  v1
- Structured for [Capacitor](https://capacitorjs.com) so it can be wrapped
  into a native iOS app later

## ⚠️ About the content

This build ships with a full set of original flashcards (20 per category,
80 total) written from standard COLREGS / SOLAS / MARPOL / GSK / navigation
reference material, **not** from a source PDF — none was attached to the
task that produced this app. Since **AEC** isn't a universally standard
acronym in the OOW syllabus, it was interpreted here as **"Anchoring,
Emergencies & Communications"**; adjust the category name/description in
`src/data/categories.ts` if your notes define it differently.

When you share the real notes PDF, the content can be dropped straight into
the JSON files described below — no component code needs to change.

## Adding / editing content

All flashcard content is plain JSON, kept separate from the UI code:

```
src/data/
  types.ts           # Flashcard / Category TypeScript types
  categories.ts       # The 4 category definitions (name, description, gradient)
  cards/
    oow3000.json       # COLREGS / rules of the road
    gsk.json            # General Ship Knowledge
    nav-radar.json      # Navigation & Radar / chartwork
    aec.json             # Anchoring, Emergencies & Communications
    index.ts             # aggregates the JSON files into one list
```

To add a card, append an object to the relevant JSON file:

```json
{
  "id": "gsk-021",
  "category": "gsk",
  "question": "What is squat?",
  "answer": "The combined sinkage and change of trim caused by a ship's own motion through the water, increasing with speed and shallow water.",
  "tags": ["Ship handling"],
  "media": {
    "frontImage": "/images/my-scene.svg",
    "frontImageAlt": "A non-spoiling picture setting up the question",
    "image": "/images/my-diagram.svg",
    "imageAlt": "Description for accessibility",
    "audio": "/audio/my-clip.mp3",
    "audioLabel": "Label shown next to the play button"
  }
}
```

- `media` is optional; include any combination of `frontImage`, `image` and
  `audio`, or none at all.
- `frontImage` shows on the question side — use it for a scene-setting
  picture that helps the learner visualize the situation without giving the
  answer away (e.g. two boats on crossing courses for a Rule 15 question).
  `image` shows on the answer side — use it for a diagram/photo that
  illustrates or reveals the answer (e.g. the same two boats, now labelled
  give-way/stand-on). Cards without media fall back to a large, low-opacity
  nautical icon behind the question text so the card still feels part of an
  illustrated feed.
- Put image/audio files under `public/images/` and `public/audio/` and
  reference them with a leading `/` (e.g. `/images/foo.svg`).
- A handful of real (synthesized) COLREGS sound-signal `.wav` clips and
  hand-drawn `.svg` diagrams — including "situation" scenes for the
  crossing/head-on/overtaking rules — already ship under `public/audio` and
  `public/images` as examples/placeholders; swap in your own
  recordings/artwork any time.
- To add a whole new category, add an entry to `CATEGORIES` in
  `src/data/categories.ts`, create `src/data/cards/<id>.json`, and import it
  in `src/data/cards/index.ts`.

## Project structure

```
src/
  components/
    SwipeFeed.tsx        # vertical snap-scroll feed + active-card tracking
    Flashcard.tsx         # single card: 3D flip, tap/double-tap handling
    AudioPlayer.tsx        # custom inline audio player (not <audio controls>)
    MasteredButton.tsx      # heart icon toggle
    DoubleTapBurst.tsx       # big center heart pop on double-tap
    Heart.tsx                 # shared heart svg
    CategoryTabs.tsx           # top pill selector + unmastered-only toggle
  hooks/
    useMasteredStore.ts   # localStorage-backed "mastered" progress
    useHaptics.ts          # Capacitor Haptics wrapper
  data/                     # see "Adding / editing content" above
  App.tsx
```

Each piece (feed, flip, audio player) is a standalone, reusable component
with no cross-dependencies beyond the shared `Flashcard` data type.

## Running it

```bash
npm install
npm run dev       # local dev server
npm run build      # type-check + production build to dist/
npm run preview     # serve the production build locally
```

## Wrapping for iOS (Capacitor)

The project is already configured with `capacitor.config.ts`. On a machine
with Xcode installed:

```bash
npm run build
npx cap add ios      # first time only — generates the ios/ native project
npm run cap:ios        # builds, syncs, and opens the project in Xcode
```

From Xcode you can then run it on a simulator or device as normal. Haptics
already work out of the box via `@capacitor/haptics`; add further native
plugins (e.g. `@capacitor/filesystem`, `@capacitor/share`) the same way —
`npm install <plugin>` then `npx cap sync`.
