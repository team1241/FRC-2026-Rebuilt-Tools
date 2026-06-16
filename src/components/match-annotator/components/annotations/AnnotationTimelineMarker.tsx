"use client";

import { cn } from "@/lib/utils";

type AnnotationTimelineMarkerProps = {
  leftPercent: number;
  isActive: boolean;
  onClick: () => void;
};

export default function AnnotationTimelineMarker({
  leftPercent,
  isActive,
  onClick,
}: AnnotationTimelineMarkerProps) {
  return (
    <button
      type="button"
      className={cn(
        "absolute top-0 h-full w-1 -translate-x-1/2 cursor-pointer transition-colors",
        isActive ? "bg-primary" : "bg-primary/60 hover:bg-primary",
      )}
      style={{ left: `${leftPercent}%` }}
      onClick={onClick}
      aria-label="Seek to annotation"
    />
  );
}
