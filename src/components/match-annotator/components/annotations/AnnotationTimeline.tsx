"use client";

import AnnotationTimelineMarker from "@/components/match-annotator/components/annotations/AnnotationTimelineMarker";
import AnnotationTimelinePlayhead from "@/components/match-annotator/components/annotations/AnnotationTimelinePlayhead";
import AnnotationTimelineRange from "@/components/match-annotator/components/annotations/AnnotationTimelineRange";
import type { AnnotationRecord } from "@/components/match-annotator/types";

type AnnotationTimelineProps = {
  annotations: AnnotationRecord[];
  duration: number | null;
  currentTime: number;
  activeAnnotationId: string | null;
  onSeek: (seconds: number) => void;
};

export default function AnnotationTimeline({
  annotations,
  duration,
  currentTime,
  activeAnnotationId,
  onSeek,
}: AnnotationTimelineProps) {
  if (!duration || duration <= 0) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        Timeline appears once video duration is available.
      </div>
    );
  }

  const playheadPercent = Math.min(
    100,
    Math.max(0, (currentTime / duration) * 100),
  );

  return (
    <div className="rounded-xl border border-border bg-muted/20 p-3">
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        Annotation Timeline
      </p>
      <div className="relative h-8 rounded-md bg-muted">
        {annotations.map((annotation) => {
          const isActive = activeAnnotationId === annotation._id;
          const startPercent = (annotation.startTimeSeconds / duration) * 100;

          if (annotation.endTimeSeconds !== undefined) {
            const widthPercent =
              ((annotation.endTimeSeconds - annotation.startTimeSeconds) /
                duration) *
              100;
            return (
              <AnnotationTimelineRange
                key={annotation._id}
                leftPercent={startPercent}
                widthPercent={widthPercent}
                isActive={isActive}
                onClick={() => onSeek(annotation.startTimeSeconds)}
              />
            );
          }

          return (
            <AnnotationTimelineMarker
              key={annotation._id}
              leftPercent={startPercent}
              isActive={isActive}
              onClick={() => onSeek(annotation.startTimeSeconds)}
            />
          );
        })}
        <AnnotationTimelinePlayhead leftPercent={playheadPercent} />
      </div>
    </div>
  );
}
