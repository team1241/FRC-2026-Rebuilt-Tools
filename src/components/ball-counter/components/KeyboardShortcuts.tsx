export default function KeyboardShortcuts() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-soft p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-muted">
        Keyboard shortcuts
      </h3>
      <div className="mt-3 grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2">
          <span>Mark shot</span>
          <span className="font-mono text-ink">B</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2">
          <span>Undo last mark</span>
          <span className="font-mono text-ink">U</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2">
          <span>Back 5s</span>
          <span className="font-mono text-ink">Left</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2">
          <span>Forward 5s</span>
          <span className="font-mono text-ink">Right</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2">
          <span>Back 1 frame</span>
          <span className="font-mono text-ink">,</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2">
          <span>Forward 1 frame</span>
          <span className="font-mono text-ink">.</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2">
          <span>Start cycle</span>
          <span className="font-mono text-ink">Q</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2">
          <span>End cycle</span>
          <span className="font-mono text-ink">E</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2">
          <span>Shot type: shooting</span>
          <span className="font-mono text-ink">S</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-surface px-3 py-2">
          <span>Shot type: feeding</span>
          <span className="font-mono text-ink">F</span>
        </div>
      </div>
    </div>
  );
}
