export default function KeyboardShortcuts() {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Keyboard shortcuts
      </h3>
      <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2">
          <span>Mark shot</span>
          <span className="font-mono text-foreground">B</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2">
          <span>Undo last mark</span>
          <span className="font-mono text-foreground">U</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2">
          <span>Back 5s</span>
          <span className="font-mono text-foreground">Left</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2">
          <span>Forward 5s</span>
          <span className="font-mono text-foreground">Right</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2">
          <span>Back 1 frame</span>
          <span className="font-mono text-foreground">,</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2">
          <span>Forward 1 frame</span>
          <span className="font-mono text-foreground">.</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2">
          <span>Start cycle</span>
          <span className="font-mono text-foreground">Q</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2">
          <span>End cycle</span>
          <span className="font-mono text-foreground">E</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2">
          <span>Shot type: shooting</span>
          <span className="font-mono text-foreground">S</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-2">
          <span>Shot type: feeding</span>
          <span className="font-mono text-foreground">F</span>
        </div>
      </div>
    </div>
  );
}
