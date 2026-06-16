"use client";

import { cn } from "@/lib/utils";

type AnnotationTimelineRangeProps = {
  leftPercent: number;
  widthPercent: number;
  isActive: boolean;
  onClick: () => void;
};

export default function AnnotationTimelineRange({
  leftPercent,
  widthPercent,
  isActive,
  onClick,
}: AnnotationTimelineRangeProps) {
  return (
    <button
      type="button"
      className={cn(
        "absolute top-1 h-[calc(100%-0.5rem)] rounded-sm cursor-pointer transition-colors",
        isActive ? "bg-primary/50" : "bg-primary/25 hover:bg-primary/40"
      )}
      style={{
        left: `${leftPercent}%`,
        width: `${Math.max(widthPercent, 0.5)}%`,
      }}
      onClick={onClick}
      aria-label="Seek to annotation range"
    />
  );
}
