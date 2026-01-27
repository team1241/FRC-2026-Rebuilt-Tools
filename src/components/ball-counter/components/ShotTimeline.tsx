import { useEffect, useRef } from "react";
import type { CycleUi, ShotMark } from "@/components/ball-counter/types";
import { formatTime } from "@/lib/time";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ShotTimelineProps = {
  marks: ShotMark[];
  cycles: CycleUi[];
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
      (cycle) => time >= cycle.startTimestamp && time <= cycle.endTimestamp,
    );
    if (index === -1) return null;
    return { index: index + 1, cycle: cycles[index] };
  };

  return (
    <div
      ref={listRef}
      className="rounded-2xl border border-border bg-card p-4 grow overflow-scroll max-h-[550px]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Shot timeline</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
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
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-foreground">
                    #{String(index + 1).padStart(2, "0")} ·{" "}
                    {formatTime(mark.time)}
                  </span>
                  <Badge
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                      mark.shotType === "shooting"
                        ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                        : "border-orange-200 bg-orange-100 text-orange-700"
                    }`}
                  >
                    {mark.shotType}
                  </Badge>
                  {cycleInfo ? (
                    <Badge
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${cycleInfo.cycle.tagColor}`}
                    >
                      Cycle {cycleInfo.index}
                    </Badge>
                  ) : (
                    <Badge className="rounded-full border border-dashed border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      No cycle
                    </Badge>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={() => onRemoveMark(mark.id)}
                  variant="destructive"
                >
                  Remove
                </Button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Marks appear here with timestamped shot data.
        </p>
      )}
    </div>
  );
}
