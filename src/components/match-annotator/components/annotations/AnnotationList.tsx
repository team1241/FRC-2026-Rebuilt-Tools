"use client";

import AnnotationListItem from "@/components/match-annotator/components/annotations/AnnotationListItem";
import type {
  AnnotationRecord,
  AnnotationReplyRecord,
} from "@/components/match-annotator/types";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

type AnnotationListProps = {
  annotations: AnnotationRecord[];
  activeAnnotationId: string | null;
  editingAnnotationId: string | null;
  expandedAnnotationId: string | null;
  currentUserSubject: string | null;
  repliesByAnnotationId: Record<string, AnnotationReplyRecord[]>;
  replyTextByAnnotationId: Record<string, string>;
  editingReplyId: string | null;
  isSubmittingReply: boolean;
  onToggleExpand: (annotationId: string) => void;
  onSeek: (seconds: number) => void;
  onEdit: (annotation: AnnotationRecord) => void;
  onDelete: (annotation: AnnotationRecord) => void;
  onReplyTextChange: (annotationId: string, value: string) => void;
  onSubmitReply: (annotationId: string) => void;
  onCancelReplyEdit: () => void;
  onEditReply: (reply: AnnotationReplyRecord) => void;
  onDeleteReply: (replyId: AnnotationReplyRecord["_id"]) => void;
};

export default function AnnotationList({
  annotations,
  activeAnnotationId,
  editingAnnotationId,
  expandedAnnotationId,
  currentUserSubject,
  repliesByAnnotationId,
  replyTextByAnnotationId,
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
}: AnnotationListProps) {
  if (annotations.length === 0) {
    return (
      <Empty className="rounded-2xl border border-dashed">
        <EmptyHeader>
          <EmptyTitle>No annotations yet</EmptyTitle>
          <EmptyDescription>
            Pause the video and add a note at the current timestamp.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex max-h-[32rem] flex-col gap-2 overflow-y-auto">
      {annotations.map((annotation) => (
        <AnnotationListItem
          key={annotation._id}
          annotation={annotation}
          isActive={activeAnnotationId === annotation._id}
          isEditing={editingAnnotationId === annotation._id}
          isExpanded={expandedAnnotationId === annotation._id}
          canEdit={currentUserSubject === annotation.authorSubject}
          replies={repliesByAnnotationId[annotation._id] ?? []}
          currentUserSubject={currentUserSubject}
          replyText={replyTextByAnnotationId[annotation._id] ?? ""}
          editingReplyId={editingReplyId}
          isSubmittingReply={isSubmittingReply}
          onToggleExpand={() => onToggleExpand(annotation._id)}
          onSeek={() => onSeek(annotation.startTimeSeconds)}
          onEdit={() => onEdit(annotation)}
          onDelete={() => onDelete(annotation)}
          onReplyTextChange={(value) =>
            onReplyTextChange(annotation._id, value)
          }
          onSubmitReply={() => onSubmitReply(annotation._id)}
          onCancelReplyEdit={onCancelReplyEdit}
          onEditReply={onEditReply}
          onDeleteReply={onDeleteReply}
        />
      ))}
    </div>
  );
}
