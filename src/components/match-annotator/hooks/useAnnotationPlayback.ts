import { useEffect, useState } from "react";
import type { AnnotationRecord } from "@/components/match-annotator/types";

type UseAnnotationPlaybackOptions = {
  annotations: AnnotationRecord[];
  getCurrentTime: () => number | null;
  pollIntervalMs?: number;
};

export default function useAnnotationPlayback({
  annotations,
  getCurrentTime,
  pollIntervalMs = 500,
}: UseAnnotationPlaybackOptions) {
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      const current = getCurrentTime();
      if (current === null) {
        setActiveAnnotationId(null);
        return;
      }

      const active = annotations.find((annotation) => {
        const end = annotation.endTimeSeconds ?? annotation.startTimeSeconds;
        return (
          current >= annotation.startTimeSeconds &&
          current <= end + 0.25
        );
      });

      setActiveAnnotationId(active?._id ?? null);
    }, pollIntervalMs);

    return () => window.clearInterval(interval);
  }, [annotations, getCurrentTime, pollIntervalMs]);

  return { activeAnnotationId };
}
