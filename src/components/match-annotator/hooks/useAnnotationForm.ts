import { useCallback, useState } from "react";
import type { AnnotationMode } from "@/components/match-annotator/types";

type UseAnnotationFormOptions = {
  getCurrentTime: () => number | null;
};

export default function useAnnotationForm({
  getCurrentTime,
}: UseAnnotationFormOptions) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<AnnotationMode>("point");
  const [markIn, setMarkIn] = useState<number | null>(null);
  const [markOut, setMarkOut] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = useCallback(() => {
    setText("");
    setMode("point");
    setMarkIn(null);
    setMarkOut(null);
    setEditingId(null);
  }, []);

  const captureMarkIn = useCallback(() => {
    const time = getCurrentTime();
    if (time === null) return;
    setMarkIn(time);
    setMode("range");
  }, [getCurrentTime]);

  const captureMarkOut = useCallback(() => {
    const time = getCurrentTime();
    if (time === null) return;
    setMarkOut(time);
  }, [getCurrentTime]);

  const useCurrentTime = useCallback(() => {
    const time = getCurrentTime();
    if (time === null) return;
    if (mode === "point") {
      setMarkIn(time);
      setMarkOut(null);
      return;
    }
    if (markIn === null) {
      setMarkIn(time);
      return;
    }
    setMarkOut(time);
  }, [getCurrentTime, markIn, mode]);

  const startEditing = useCallback(
    (args: {
      id: string;
      text: string;
      startTimeSeconds: number;
      endTimeSeconds?: number;
    }) => {
      setEditingId(args.id);
      setText(args.text);
      setMarkIn(args.startTimeSeconds);
      setMarkOut(args.endTimeSeconds ?? null);
      setMode(args.endTimeSeconds === undefined ? "point" : "range");
    },
    []
  );

  const resolvedStartTime =
    markIn ?? getCurrentTime() ?? 0;

  const resolvedEndTime =
    mode === "range" ? (markOut ?? getCurrentTime() ?? undefined) : undefined;

  return {
    text,
    setText,
    mode,
    setMode,
    markIn,
    markOut,
    editingId,
    resetForm,
    captureMarkIn,
    captureMarkOut,
    useCurrentTime,
    startEditing,
    resolvedStartTime,
    resolvedEndTime,
  };
}
