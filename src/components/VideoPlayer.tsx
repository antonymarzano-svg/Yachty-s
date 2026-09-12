import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  label?: string;
  /** Whether this player is allowed to keep playing (e.g. only the active card). */
  active: boolean;
}

const SKIP_SECONDS = 10;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * A custom video player styled to match the flashcard — no default browser
 * chrome. Nothing is downloaded until the learner taps play (`preload="none"`),
 * which matters for longer clips (lecture walkthroughs, full maneuvers, etc.)
 * that are best hosted externally rather than bundled into the app.
 */
export function VideoPlayer({ src, poster, label, active }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!active && videoRef.current) {
      videoRef.current.pause();
      setPlaying(false);
    }
  }, [active]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onTime = () => setCurrentTime(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onPlay = () => {
      setPlaying(true);
      setStarted(true);
    };
    const onPause = () => setPlaying(false);
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const togglePlay = (e: React.SyntheticEvent) => {
    stop(e);
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  const skip = (delta: number) => (e: React.SyntheticEvent) => {
    stop(e);
    const el = videoRef.current;
    if (!el) return;
    const max = duration || el.duration || Infinity;
    el.currentTime = Math.min(Math.max(0, el.currentTime + delta), max);
  };

  const toggleMute = (e: React.SyntheticEvent) => {
    stop(e);
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  const toggleFullscreen = (e: React.SyntheticEvent) => {
    stop(e);
    const el = videoRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    stop(e);
    const el = videoRef.current;
    const bar = e.currentTarget;
    if (!el || !duration) return;
    const rect = bar.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    el.currentTime = fraction * duration;
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div
      onClick={stop}
      className="w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black"
    >
      <div className="relative aspect-video w-full" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          preload="none"
          playsInline
          className="h-full w-full object-contain"
        />

        {!poster && !started && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950" />
        )}

        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl active:scale-90 transition-transform">
              <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[1px]" fill="currentColor">
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 bg-white/5 px-3 py-2.5 backdrop-blur-md">
        {label && (
          <p className="truncate text-xs font-medium text-white/70">{label}</p>
        )}

        <div
          onClick={seek}
          className="h-1.5 w-full cursor-pointer rounded-full bg-white/15"
        >
          <div
            className="h-full rounded-full bg-white transition-[width] duration-100 ease-linear"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-white/80">
            <button
              type="button"
              onClick={skip(-SKIP_SECONDS)}
              aria-label={`Back ${SKIP_SECONDS} seconds`}
              className="active:scale-90 transition-transform"
            >
              <SkipIcon direction="back" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={playing ? "Pause video" : "Play video"}
              className="active:scale-90 transition-transform"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M7 4.5v15l13-7.5z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={skip(SKIP_SECONDS)}
              aria-label={`Forward ${SKIP_SECONDS} seconds`}
              className="active:scale-90 transition-transform"
            >
              <SkipIcon direction="forward" />
            </button>
            <span className="text-[11px] tabular-nums text-white/50">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-white/80">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="active:scale-90 transition-transform"
            >
              {muted ? <MuteIcon /> : <VolumeIcon />}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className="active:scale-90 transition-transform"
            >
              <FullscreenIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkipIcon({ direction }: { direction: "back" | "forward" }) {
  // Two distinct paths (not a mirrored CSS transform) so the "10" label
  // never renders backwards.
  const arrowPath =
    direction === "back" ? "M9 5V9H5" : "M15 5V9H19";
  const arcPath =
    direction === "back"
      ? "M9 7A8 8 0 1 0 12 20"
      : "M15 7A8 8 0 1 1 12 20";
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={arrowPath} />
      <path d={arcPath} />
      <text
        x="12"
        y="17.5"
        fontSize="7"
        fill="currentColor"
        stroke="none"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontWeight="700"
      >
        10
      </text>
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
      <path d="M4 9v6h4l5 5V4L8 9H4z" />
      <path
        d="M17 8.5a5 5 0 0 1 0 7"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
      <path d="M4 9v6h4l5 5V4L8 9H4z" />
      <path
        d="M16 9l5 6M21 9l-5 6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 4H4v4M16 4h4v4M8 20H4v-4M16 20h4v-4" />
    </svg>
  );
}
