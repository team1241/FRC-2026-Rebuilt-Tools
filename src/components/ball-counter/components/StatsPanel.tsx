import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type {
  CycleUi,
  ShotMark,
  ShotType,
} from "@/components/ball-counter/types";
import ShotTimeline from "./ShotTimeline";
import { formatTime } from "@/lib/time";
import SaveMetadataModal from "./SaveMetadataModal";

type StatsPanelProps = {
  marks: ShotMark[];
  averageBps: number;
  cycles: CycleUi[];
  activeCycleStart: number | null;
  videoUrl: string;
  shotType: ShotType;
  onShotTypeChange: (shotType: ShotType) => void;
  onClearMarks: () => void;
  onRemoveMark: (id: string) => void;
  onStartCycle: () => void;
  onEndCycle: () => void;
  onRemoveCycle: (id: string) => void;
};

export default function StatsPanel({
  marks,
  averageBps,
  cycles,
  activeCycleStart,
  videoUrl,
  shotType,
  onShotTypeChange,
  onClearMarks,
  onRemoveMark,
  onStartCycle,
  onEndCycle,
  onRemoveCycle,
}: StatsPanelProps) {
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [cycleToDelete, setCycleToDelete] = useState<CycleUi | null>(null);
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  const activeCycleMarks =
    activeCycleStart === null
      ? 0
      : marks.filter((mark) => mark.time >= activeCycleStart).length;

  const countMarksInRange = (start: number, end: number) =>
    marks.filter((mark) => mark.time >= start && mark.time <= end).length;

  useEffect(() => {
    if (!cycleToDelete && !isClearConfirmOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCycleToDelete(null);
        setIsClearConfirmOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cycleToDelete, isClearConfirmOpen]);

  return (
    <section className="flex flex-col gap-6 rounded-[28px] border border-border bg-surface/90 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-ink">Stats</h2>
        <div className="flex flex-wrap items-center gap-2">
          {videoUrl && (
            <button
              type="button"
              onClick={() => setIsSaveOpen(true)}
              className="rounded-full border border-accent bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-surface transition hover:-translate-y-0.5 hover:border-accent-strong hover:bg-accent-strong"
            >
              Save data
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setCycleToDelete(null);
              setIsClearConfirmOpen(true);
            }}
            className="rounded-full border border-danger bg-danger px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-surface transition hover:-translate-y-0.5 hover:border-danger-strong hover:bg-danger-strong"
          >
            Clear all marks
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Shots marked" value={marks.length.toString()} />
        <StatCard
          label="Average balls / second"
          value={averageBps ? averageBps.toFixed(2) : "0.00"}
        />
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface-muted p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-ink">Shot type</h3>
            <p className="text-sm text-ink-muted">
              Track whether marks are for shooting or feeding.
            </p>
          </div>
          <div className="flex gap-2">
            {(["shooting", "feeding"] as const).map((type) => {
              const isActive = shotType === type;
              const colorClasses =
                type === "shooting"
                  ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                  : "border-orange-200 bg-orange-100 text-orange-700";
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onShotTypeChange(type)}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                    isActive
                      ? colorClasses
                      : "border-border bg-surface text-ink-muted hover:text-ink"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                      isActive ? colorClasses : "border-border bg-surface"
                    }`}
                    aria-hidden="true"
                  >
                    {isActive ? (
                      <span className="h-2 w-2 rounded-xs bg-current" />
                    ) : null}
                  </span>
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-surface-muted p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-ink">Cycle counter</h3>
            <p className="text-sm text-ink-muted">
              Group shots into cycles to measure pace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onStartCycle}
              disabled={activeCycleStart !== null}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              Start cycle (Q)
            </button>
            <button
              type="button"
              onClick={onEndCycle}
              disabled={activeCycleStart === null}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              End cycle (E)
            </button>
          </div>
        </div>
        {activeCycleStart === null ? (
          <p className="mt-3 text-sm text-ink-muted">No active cycle.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-1 rounded-2xl border border-success-border bg-linear-to-r from-success-soft to-success-mist px-4 py-3 text-sm">
            <span className="rounded-full py-1 text-sm font-semibold uppercase tracking-[0.2em] text-ink">
              Active cycle
            </span>
            <div className="flex justify-between items-center font-semibold">
              <p className="text-md">Since {formatTime(activeCycleStart)}</p>
              <p className="text-lg">{activeCycleMarks} marks</p>
            </div>
          </div>
        )}
        {cycles.length ? (
          <ul className="mt-4 space-y-2">
            {cycles.map((cycle, index) => {
              const markCount = countMarksInRange(
                cycle.startTimestamp,
                cycle.endTimestamp,
              );
              const duration = cycle.endTimestamp - cycle.startTimestamp;
              const bps = duration > 0 ? markCount / duration : 0;

              return (
                <li
                  key={cycle.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-3 text-sm"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-ink">
                      Cycle {index + 1} · {formatTime(cycle.startTimestamp)}–
                      {formatTime(cycle.endTimestamp)}
                    </p>
                    <p className="text-xs text-ink-muted">
                      Duration {formatTime(duration)} · {markCount} marks
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-sky-200 bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                      {bps.toFixed(2)} bps
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        cycle.shotType === "shooting"
                          ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                          : "border-orange-200 bg-orange-100 text-orange-700"
                      }`}
                    >
                      {cycle.shotType}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCycleToDelete(cycle)}
                      className="cursor-pointer rounded-full border border-danger/40 bg-danger/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-danger transition hover:border-danger hover:bg-danger/20"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-ink-muted">
            Start a cycle to capture balls-per-second groups.
          </p>
        )}
      </div>

      <ShotTimeline marks={marks} cycles={cycles} onRemoveMark={onRemoveMark} />
      {isClearConfirmOpen ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl border border-border-subtle bg-surface p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-lg font-semibold text-ink">
                Clear all marks?
              </h4>
              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(false)}
                className="rounded-full border border-transparent p-2 text-ink-muted transition hover:border-border hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-sm text-ink-muted">
              This removes all shot marks and clears the timeline.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(false)}
                className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearMarks();
                  setIsClearConfirmOpen(false);
                }}
                className="rounded-full bg-danger px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-surface shadow-sm transition hover:-translate-y-0.5 hover:bg-danger-strong hover:shadow-md"
              >
                Clear marks
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {cycleToDelete ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl border border-border-subtle bg-surface p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-lg font-semibold text-ink">Delete cycle?</h4>
              <button
                type="button"
                onClick={() => setCycleToDelete(null)}
                className="rounded-full border border-transparent p-2 text-ink-muted transition hover:border-border hover:text-ink"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-sm text-ink-muted">
              This removes the cycle and any balls marked within{" "}
              {formatTime(cycleToDelete.startTimestamp)}–
              {formatTime(cycleToDelete.endTimestamp)} (
              {countMarksInRange(
                cycleToDelete.startTimestamp,
                cycleToDelete.endTimestamp,
              )}{" "}
              marks).
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCycleToDelete(null)}
                className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:border-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onRemoveCycle(cycleToDelete.id);
                  setCycleToDelete(null);
                }}
                className="rounded-full bg-linear-to-br from-accent-strong to-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Delete cycle
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <SaveMetadataModal
        isOpen={isSaveOpen}
        onClose={() => setIsSaveOpen(false)}
        videoUrl={videoUrl}
      />
    </section>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-muted p-4 flex flex-col justify-between gap-1">
      <span className="text-xs uppercase tracking-[0.2em] text-ink-muted">
        {label}
      </span>
      <p className="text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
