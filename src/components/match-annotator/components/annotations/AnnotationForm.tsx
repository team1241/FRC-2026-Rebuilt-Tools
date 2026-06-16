"use client";

import AnnotationMarkButtons from "@/components/match-annotator/components/annotations/AnnotationMarkButtons";
import AnnotationPointRangeToggle from "@/components/match-annotator/components/annotations/AnnotationPointRangeToggle";
import { EDIT_MODE_BUTTON_CLASS } from "@/components/match-annotator/constants";
import type { AnnotationMode } from "@/components/match-annotator/types";
import { formatTimecodeRange } from "@/components/match-annotator/utils/format-timecode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { Pencil } from "lucide-react";
import { useEffect, useRef } from "react";

type AnnotationFormProps = {
  text: string;
  mode: AnnotationMode;
  markIn: number | null;
  markOut: number | null;
  editingId: string | null;
  resolvedStartTime: number;
  resolvedEndTime: number | undefined;
  isSubmitting: boolean;
  onTextChange: (value: string) => void;
  onModeChange: (mode: AnnotationMode) => void;
  onMarkIn: () => void;
  onMarkOut: () => void;
  onUseCurrentTime: () => void;
  onSubmit: () => void;
  onCancelEdit: () => void;
};

export default function AnnotationForm({
  text,
  mode,
  markIn,
  markOut,
  editingId,
  resolvedStartTime,
  resolvedEndTime,
  isSubmitting,
  onTextChange,
  onModeChange,
  onMarkIn,
  onMarkOut,
  onUseCurrentTime,
  onSubmit,
  onCancelEdit,
}: AnnotationFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const isEditing = editingId !== null;

  const timeLabel = formatTimecodeRange(
    markIn ?? resolvedStartTime,
    mode === "range" ? (markOut ?? resolvedEndTime) : undefined,
  );

  useEffect(() => {
    if (!isEditing || !formRef.current) return;
    formRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isEditing, editingId]);

  return (
    <div
      ref={formRef}
      id="annotation-form"
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-4 transition-colors",
        isEditing ? "border-primary bg-primary/10" : "border-border bg-card",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {isEditing ? (
            <Badge className="gap-1 bg-green-600 text-white">
              <Pencil className="h-3 w-3" aria-hidden="true" />
              Editing
            </Badge>
          ) : null}
          <h3 className="text-sm font-semibold">
            {isEditing ? "Edit annotation" : "Add annotation"}
          </h3>
        </div>
        <span
          className={cn(
            "text-xs",
            isEditing ? "font-medium text-primary" : "text-muted-foreground",
          )}
        >
          {timeLabel}
        </span>
      </div>

      {isEditing ? (
        <p className="text-sm text-muted-foreground">
          Update the note below, then save or cancel to exit edit mode.
        </p>
      ) : null}

      <Authenticated>
        <AnnotationPointRangeToggle
          mode={mode}
          isEditing={isEditing}
          onChange={onModeChange}
        />
        <AnnotationMarkButtons
          isEditing={isEditing}
          onMarkIn={onMarkIn}
          onMarkOut={onMarkOut}
          onUseCurrentTime={onUseCurrentTime}
          showRangeControls={mode === "range"}
        />
        <Textarea
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder="Describe what happened at this moment..."
          rows={3}
          className={cn(isEditing && "border-primary/40 bg-background")}
        />
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !text.trim()}
          >
            {isEditing ? "Save changes" : "Add annotation"}
          </Button>
          {isEditing ? (
            <Button
              type="button"
              variant="outline"
              className={EDIT_MODE_BUTTON_CLASS}
              onClick={onCancelEdit}
            >
              Cancel editing
            </Button>
          ) : null}
        </div>
      </Authenticated>

      <Unauthenticated>
        <p className="text-sm text-muted-foreground">
          Sign in to add annotations.
        </p>
        <SignInButton mode="modal">
          <Button type="button" variant="outline">
            Sign in
          </Button>
        </SignInButton>
      </Unauthenticated>
    </div>
  );
}
