import {
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";
import KeyboardShortcuts from "./KeyboardShortcuts";

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
    <section className="flex flex-col gap-5 rounded-[28px] border border-border bg-surface/90 p-6">
      <div className="rounded-2xl bg-surface">
        <label className="text-xl font-semibold text-ink">Video Player</label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            type="url"
            className="w-full rounded-2xl border border-border bg-surface-soft px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
            placeholder="Paste a YouTube link"
            value={videoUrl}
            onChange={(event) => onVideoUrlChange(event.target.value)}
          />
          <button
            type="button"
            onClick={onLoad}
            className="rounded-full bg-linear-to-br from-accent-strong to-accent px-5 py-2 text-sm font-semibold text-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md min-w-fit"
          >
            Load video
          </button>
        </div>
        {error ? (
          <p className="mt-3 text-sm font-medium text-danger">{error}</p>
        ) : null}
      </div>

      <div className="relative aspect-video overflow-hidden rounded-2xl bg-video-bg">
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
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-video-text">
            Load a clip to start stepping through frames.
          </div>
        )}
      </div>

      <KeyboardShortcuts />
    </section>
  );
}
