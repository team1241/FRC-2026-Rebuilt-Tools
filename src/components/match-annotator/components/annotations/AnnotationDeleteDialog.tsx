"use client";

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

type AnnotationDeleteDialogProps = {
  open: boolean;
  timeLabel?: string;
  annotationText?: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function AnnotationDeleteDialog({
  open,
  timeLabel,
  annotationText,
  onOpenChange,
  onConfirm,
}: AnnotationDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this annotation?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                This will permanently delete the annotation
                {timeLabel ? ` at ${timeLabel}` : ""} and any replies. This
                cannot be undone.
              </p>
              {annotationText ? (
                <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-foreground">
                  &ldquo;{annotationText}&rdquo;
                </p>
              ) : null}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Delete annotation
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
