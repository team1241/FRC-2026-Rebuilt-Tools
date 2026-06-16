"use client";

import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";
import type React from "react";

type MatchAnnotatorVideoPanelProps = {
  isHtml5: boolean;
  isYouTube: boolean;
  loadedUrl: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  youtubeContainerRef: RefObject<HTMLDivElement | null>;
  onVideoKeyDown?: (event: ReactKeyboardEvent<HTMLVideoElement>) => void;
};

export default function MatchAnnotatorVideoPanel({
  isHtml5,
  isYouTube,
  loadedUrl,
  videoRef,
  youtubeContainerRef,
  onVideoKeyDown,
}: MatchAnnotatorVideoPanelProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-foreground">
      {isHtml5 && loadedUrl ? (
        <video
          ref={videoRef as React.RefObject<HTMLVideoElement>}
          key={loadedUrl}
          src={loadedUrl}
          controls
          preload="metadata"
          className="h-full w-full object-contain"
          onKeyDown={onVideoKeyDown}
          tabIndex={0}
        />
      ) : isYouTube ? (
        <div
          ref={youtubeContainerRef as React.RefObject<HTMLDivElement>}
          className="h-full w-full"
        />
      ) : (
        <div className="flex h-full items-center justify-center px-6 text-center text-sm text-background">
          Load a YouTube video, local clip, or pick from Blue Alliance to start
          annotating.
        </div>
      )}
    </div>
  );
}
