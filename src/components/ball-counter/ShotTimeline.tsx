import { useEffect, useRef } from "react";
import type { Cycle, ShotMark } from "../../App";
import { formatTime } from "../../App";

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

  const getCycleIndex = (time: number) => {
    const index = cycles.findIndex(
      (cycle) => time >= cycle.startTime && time <= cycle.endTime,
    );
    return index === -1 ? null : index + 1;
  };

  return (
    <div
      ref={listRef}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 grow overflow-scroll max-h-[550px]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-[var(--color-ink)]">
          Shot timeline
        </h3>
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
          {marks.length} entries
        </span>
      </div>
      {marks.length ? (
        <ul className="mt-4 space-y-2">
          {marks.map((mark, index) => (
            <li
              key={mark.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border-soft)] bg-[var(--color-surface-muted)] px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-[var(--color-ink)]">
                  #{String(index + 1).padStart(2, "0")} ·{" "}
                  {formatTime(mark.time)}
                </span>
                {getCycleIndex(mark.time) ? (
                  <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
                    Cycle {getCycleIndex(mark.time)}
                  </span>
                ) : (
                  <span className="rounded-full border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
                    No cycle
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemoveMark(mark.id)}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
          Marks appear here with timestamped shot data.
        </p>
      )}
    </div>
  );
}
