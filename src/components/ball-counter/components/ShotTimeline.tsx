import { useEffect, useRef } from "react";
import type { Cycle, ShotMark } from "@/components/ball-counter/types";
import { formatTime } from "@/lib/time";

type ShotTimelineProps = {
  marks: ShotMark[];
  cycles: Cycle[];
  onRemoveMark: (id: string) => void;
};

export default function ShotTimeline({
  marks,
  cycles,
  onRemoveMark,
}: ShotTimelineProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [marks.length]);

  const getCycleInfo = (time: number) => {
    const index = cycles.findIndex(
      (cycle) => time >= cycle.startTime && time <= cycle.endTime,
    );
    if (index === -1) return null;
    return { index: index + 1, cycle: cycles[index] };
  };

  return (
    <div
      ref={listRef}
      className="rounded-2xl border border-border bg-surface p-4 grow overflow-scroll max-h-[550px]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">Shot timeline</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-ink-muted">
          {marks.length} entries
        </span>
      </div>
      {marks.length ? (
        <ul className="mt-4 space-y-2">
          {marks.map((mark, index) => {
            const cycleInfo = getCycleInfo(mark.time);
            return (
              <li
                key={mark.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-soft bg-surface-muted px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-ink">
                    #{String(index + 1).padStart(2, "0")} ·{" "}
                    {formatTime(mark.time)}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                      mark.shotType === "shooting"
                        ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                        : "border-orange-200 bg-orange-100 text-orange-700"
                    }`}
                  >
                    {mark.shotType}
                  </span>
                  {cycleInfo ? (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${cycleInfo.cycle.tagColor}`}
                    >
                      Cycle {cycleInfo.index}
                    </span>
                  ) : (
                    <span className="rounded-full border border-dashed border-border bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
                      No cycle
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveMark(mark.id)}
                  className="cursor-pointer rounded-full border border-danger/40 bg-danger/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-danger transition hover:border-danger hover:bg-danger/20"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-ink-muted">
          Marks appear here with timestamped shot data.
        </p>
      )}
    </div>
  );
}
