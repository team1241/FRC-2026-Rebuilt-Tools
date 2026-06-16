"use client";

import AnnotationReplyList from "@/components/match-annotator/components/annotations/AnnotationReplyList";
import type {
  AnnotationRecord,
  AnnotationReplyRecord,
} from "@/components/match-annotator/types";
import { formatTimecodeRange } from "@/components/match-annotator/utils/format-timecode";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Play, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

type AnnotationListItemProps = {
  annotation: AnnotationRecord;
  isActive: boolean;
  isEditing: boolean;
  isExpanded: boolean;
  canEdit: boolean;
  replies: AnnotationReplyRecord[];
  currentUserSubject: string | null;
  replyText: string;
  editingReplyId: string | null;
  isSubmittingReply: boolean;
  onToggleExpand: () => void;
  onSeek: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onReplyTextChange: (value: string) => void;
  onSubmitReply: () => void;
  onCancelReplyEdit: () => void;
  onEditReply: (reply: AnnotationReplyRecord) => void;
  onDeleteReply: (replyId: AnnotationReplyRecord["_id"]) => void;
};

export default function AnnotationListItem({
  annotation,
  isActive,
  isEditing,
  isExpanded,
  canEdit,
  replies,
  currentUserSubject,
  replyText,
  editingReplyId,
  isSubmittingReply,
  onToggleExpand,
  onSeek,
  onEdit,
  onDelete,
  onReplyTextChange,
  onSubmitReply,
  onCancelReplyEdit,
  onEditReply,
  onDeleteReply,
}: AnnotationListItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (isActive && !wasActiveRef.current) {
      itemRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    wasActiveRef.current = isActive;
  }, [isActive]);

  return (
    <div
      ref={itemRef}
      className={cn(
        "rounded-xl border px-3 py-3 transition-colors",
        isEditing
          ? "border-primary/40 bg-primary/5"
          : isActive
            ? "border-primary/50 bg-primary/5"
            : "border-border bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-medium text-primary">
              {formatTimecodeRange(
                annotation.startTimeSeconds,
                annotation.endTimeSeconds,
              )}
            </p>
            {isEditing ? (
              <Badge className="bg-green-600 text-[10px] text-white">
                Editing
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-foreground">{annotation.text}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {annotation.authorName ?? "Anonymous"}
          </p>
        </div>
        {canEdit ? (
          <div className="flex shrink-0 gap-0.5">
            <Button
              type="button"
              size="icon"
              variant={isEditing ? "default" : "ghost"}
              className={cn("h-8 w-8", !isEditing && "text-muted-foreground")}
              onClick={onEdit}
              aria-label={isEditing ? "Cancel editing" : "Edit annotation"}
              aria-pressed={isEditing}
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={onDelete}
              disabled={isEditing}
              aria-label="Delete annotation"
              title={
                isEditing
                  ? "Finish or cancel editing before deleting"
                  : "Delete annotation"
              }
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <Button type="button" size="sm" variant="success" onClick={onSeek}>
          <Play className="h-3.5 w-3.5" aria-hidden="true" />
          Jump to timestamp
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onToggleExpand}
        >
          {isExpanded ? "Hide replies" : "See replies"}
        </Button>
      </div>

      {isExpanded ? (
        <AnnotationReplyList
          replies={replies}
          currentUserSubject={currentUserSubject}
          replyText={replyText}
          editingReplyId={editingReplyId}
          isSubmitting={isSubmittingReply}
          onReplyTextChange={onReplyTextChange}
          onSubmitReply={onSubmitReply}
          onCancelReplyEdit={onCancelReplyEdit}
          onEditReply={onEditReply}
          onDeleteReply={onDeleteReply}
        />
      ) : null}
    </div>
  );
}
