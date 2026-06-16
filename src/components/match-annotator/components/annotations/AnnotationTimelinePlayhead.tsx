"use client";

type AnnotationTimelinePlayheadProps = {
  leftPercent: number;
};

export default function AnnotationTimelinePlayhead({
  leftPercent,
}: AnnotationTimelinePlayheadProps) {
  return (
    <div
      className="pointer-events-none absolute top-0 z-10 h-full w-0.5 -translate-x-1/2 bg-foreground"
      style={{ left: `${leftPercent}%` }}
      aria-hidden="true"
    />
  );
}
