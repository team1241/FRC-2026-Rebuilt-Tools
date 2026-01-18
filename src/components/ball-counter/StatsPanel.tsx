import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Cycle, ShotMark } from "../../App";
import ShotTimeline from "./ShotTimeline";
import { formatTime } from "../../App";
import SaveMetadataModal from "./SaveMetadataModal";

type StatsPanelProps = {
  marks: ShotMark[];
  averageBps: number;
  cycles: Cycle[];
  activeCycleStart: number | null;
  videoUrl: string;
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
  onClearMarks,
  onRemoveMark,
  onStartCycle,
  onEndCycle,
  onRemoveCycle,
}: StatsPanelProps) {
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [cycleToDelete, setCycleToDelete] = useState<Cycle | null>(null);
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
    <section className="flex flex-col gap-6 rounded-[28px] border border-[var(--color-border)] bg-[color:rgb(var(--color-surface-rgb)/0.9)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-[var(--color-ink)]">Stats</h2>
        <div className="flex flex-wrap items-center gap-2">
          {videoUrl && (
            <button
              type="button"
              onClick={() => setIsSaveOpen(true)}
              className="rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-surface)] transition hover:border-[var(--color-accent-strong) hover:-translate-y-0.5 hover:bg-[var(--color-accent-strong)]"
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
            className="rounded-full border border-[var(--color-danger)] bg-[var(--color-danger)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-surface)] transition hover:-translate-y-0.5 hover:border-[var(--color-danger-strong)] hover:bg-[var(--color-danger-strong)]"
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

      <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[var(--color-ink)]">
              Cycle counter
            </h3>
            <p className="text-sm text-[var(--color-ink-muted)]">
              Group shots into cycles to measure pace.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onStartCycle}
              disabled={activeCycleStart !== null}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)] transition hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Start cycle (Q)
            </button>
            <button
              type="button"
              onClick={onEndCycle}
              disabled={activeCycleStart === null}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)] transition hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              End cycle (E)
            </button>
          </div>
        </div>
        {activeCycleStart === null ? (
          <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
            No active cycle.
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-1 rounded-2xl border border-[color:var(--color-success-border)] bg-gradient-to-r from-[var(--color-success-soft)] to-[var(--color-success-mist)] px-4 py-3 text-sm">
            <span className="rounded-full py-1 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]">
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
                cycle.startTime,
                cycle.endTime,
              );
              const duration = cycle.endTime - cycle.startTime;
              const bps = duration > 0 ? markCount / duration : 0;

              return (
                <li
                  key={cycle.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-4 py-3 text-sm"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-[var(--color-ink)]">
                      Cycle {index + 1} · {formatTime(cycle.startTime)}–
                      {formatTime(cycle.endTime)}
                    </p>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      Duration {formatTime(duration)} · {markCount} marks
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]">
                      {bps.toFixed(2)} bps
                    </span>
                    <button
                      type="button"
                      onClick={() => setCycleToDelete(cycle)}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
            Start a cycle to capture balls-per-second groups.
          </p>
        )}
      </div>

      <ShotTimeline marks={marks} cycles={cycles} onRemoveMark={onRemoveMark} />
      {isClearConfirmOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-lg font-semibold text-[var(--color-ink)]">
                Clear all marks?
              </h4>
              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(false)}
                className="rounded-full border border-transparent p-2 text-[var(--color-ink-muted)] transition hover:border-[var(--color-border)] hover:text-[var(--color-ink)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              This removes all shot marks and clears the timeline.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsClearConfirmOpen(false)}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearMarks();
                  setIsClearConfirmOpen(false);
                }}
                className="rounded-full bg-[var(--color-danger)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-surface)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-danger-strong)] hover:shadow-md"
              >
                Clear marks
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {cycleToDelete ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-lg font-semibold text-[var(--color-ink)]">
                Delete cycle?
              </h4>
              <button
                type="button"
                onClick={() => setCycleToDelete(null)}
                className="rounded-full border border-transparent p-2 text-[var(--color-ink-muted)] transition hover:border-[var(--color-border)] hover:text-[var(--color-ink)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              This removes the cycle and any balls marked within{" "}
              {formatTime(cycleToDelete.startTime)}–
              {formatTime(cycleToDelete.endTime)} (
              {countMarksInRange(
                cycleToDelete.startTime,
                cycleToDelete.endTime,
              )}{" "}
              marks).
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setCycleToDelete(null)}
                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onRemoveCycle(cycleToDelete.id);
                  setCycleToDelete(null);
                }}
                className="rounded-full bg-gradient-to-br from-[var(--color-accent-strong)] to-[var(--color-accent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-surface)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
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
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] p-4 flex flex-col justify-between gap-1">
      <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
        {label}
      </span>
      <p className="text-2xl font-semibold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
