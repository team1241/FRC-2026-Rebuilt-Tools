import {
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";
import KeyboardShortcuts from "./components/KeyboardShortcuts";

type VideoPanelProps = {
  isHtml5: boolean;
  isYouTube: boolean;
  videoUrl: string;
  onVideoUrlChange: (value: string) => void;
  onLoad: () => void;
  error: string;
  loadedUrl: string;
  onVideoKeyDown: (event: ReactKeyboardEvent<HTMLVideoElement>) => void;
  videoRef: RefObject<HTMLVideoElement>;
  youtubeContainerRef: RefObject<HTMLDivElement>;
};

const buttonGhost =
  "rounded-full border border-dashed border-[var(--color-border)] bg-transparent px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-ink)] disabled:opacity-60";

export default function VideoPanel({
  isHtml5,
  isYouTube,
  videoUrl,
  onVideoUrlChange,
  onLoad,
  error,
  loadedUrl,
  onVideoKeyDown,
  videoRef,
  youtubeContainerRef,
}: VideoPanelProps) {
  return (
    <section className="flex flex-col gap-5 rounded-[28px] border border-[var(--color-border)] bg-[color:rgb(var(--color-surface-rgb)/0.9)] p-6">
      <div className="rounded-2xl bg-[var(--color-surface)]">
        <label className="text-xl font-semibold text-[var(--color-ink)]">
          Video Player
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 text-sm text-[var(--color-ink)] focus:border-[var(--color-accent)] focus:outline-none"
            placeholder="Paste a YouTube link"
            value={videoUrl}
            onChange={(event) => onVideoUrlChange(event.target.value)}
          />
          <button
            type="button"
            onClick={onLoad}
            className="rounded-full bg-gradient-to-br from-[var(--color-accent-strong)] to-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-surface)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md min-w-fit"
          >
            Load video
          </button>
        </div>
        {error ? (
          <p className="mt-3 text-sm font-medium text-[var(--color-danger)]">
            {error}
          </p>
        ) : null}
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl bg-[var(--color-video-bg)]">
        {isHtml5 && loadedUrl ? (
          <video
            ref={videoRef}
            key={loadedUrl}
            src={loadedUrl}
            controls
            preload="metadata"
            className="h-full w-full object-contain"
            onKeyDown={onVideoKeyDown}
            tabIndex={0}
          />
        ) : isYouTube ? (
          <div ref={youtubeContainerRef} className="h-full w-full" />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-[var(--color-video-text)]">
            Load a clip to start stepping through frames.
          </div>
        )}
      </div>

      <KeyboardShortcuts />
    </section>
  );
}
