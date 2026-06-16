"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { Check, Loader2, RefreshCcw, Save, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

type AnnotationSummaryPanelProps = {
  summary: string | null;
  isGenerating: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isSaved: boolean;
  canGenerate: boolean;
  annotationCount: number;
  onGenerate: () => void;
  onSave: () => void;
  onDelete: () => void;
  onDismiss: () => void;
};

export default function AnnotationSummaryPanel({
  summary,
  isGenerating,
  isSaving,
  isDeleting,
  isSaved,
  canGenerate,
  annotationCount,
  onGenerate,
  onSave,
  onDelete,
  onDismiss,
}: AnnotationSummaryPanelProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const hasSummary = summary !== null;
  const hasUnsavedSummary = hasSummary && !isSaved;
  const isBusy = isGenerating || isSaving || isDeleting;

  return (
    <>
      <div className="flex max-h-[min(45vh,24rem)] min-h-0 flex-col gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              <h3 className="text-sm font-semibold">AI match summary</h3>
              {hasSummary && isSaved && !isGenerating ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <Check className="size-3" aria-hidden="true" />
                  Saved
                </span>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              Synthesizes all annotations and replies into one overview.
            </p>
          </div>

          <Authenticated>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              {hasUnsavedSummary ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                  disabled={isBusy}
                >
                  Clear
                </Button>
              ) : null}
              {hasUnsavedSummary ? (
                <Button
                  type="button"
                  variant="success"
                  size="sm"
                  onClick={onSave}
                  disabled={isBusy}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="size-4" aria-hidden="true" />
                      Save summary
                    </>
                  )}
                </Button>
              ) : null}
              {isSaved ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isBusy}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" />
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4" aria-hidden="true" />
                      Delete
                    </>
                  )}
                </Button>
              ) : null}
              <Button
                type="button"
                size="sm"
                onClick={onGenerate}
                disabled={!canGenerate || isBusy}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    Generating…
                  </>
                ) : hasSummary ? (
                  <>
                    <RefreshCcw className="size-4" aria-hidden="true" />
                    Regenerate
                  </>
                ) : (
                  "Generate summary"
                )}
              </Button>
            </div>
          </Authenticated>
        </div>

        <Unauthenticated>
          <p className="text-sm text-muted-foreground">
            Sign in to generate an AI summary of this video&apos;s notes.
          </p>
          <SignInButton mode="modal">
            <Button type="button" variant="outline" size="sm">
              Sign in
            </Button>
          </SignInButton>
        </Unauthenticated>

        <Authenticated>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {!canGenerate && !isGenerating && !hasSummary ? (
              <p className="rounded-xl border border-dashed px-3 py-2 text-sm text-muted-foreground">
                {annotationCount === 0
                  ? "Add at least one annotation before generating a summary."
                  : "Load a saved video to generate a summary."}
              </p>
            ) : null}

            {isGenerating ? (
              <div
                className="flex flex-col gap-2 rounded-xl bg-muted/40 px-3 py-3"
                aria-live="polite"
                aria-busy="true"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Reading annotations and drafting summary…
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-[92%]" />
                <Skeleton className="h-3 w-[85%]" />
                <Skeleton className="h-3 w-[70%]" />
              </div>
            ) : null}

            {hasSummary && !isGenerating ? (
              <div
                className={cn(
                  "rounded-xl border border-primary/15 bg-primary/5 px-3 py-3",
                  "text-sm leading-relaxed text-foreground",
                )}
              >
                <p className="whitespace-pre-wrap">{summary}</p>
              </div>
            ) : null}
          </div>
        </Authenticated>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete saved summary?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the saved AI summary from this
              video. You can generate a new one later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                setDeleteDialogOpen(false);
                onDelete();
              }}
            >
              Delete summary
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
