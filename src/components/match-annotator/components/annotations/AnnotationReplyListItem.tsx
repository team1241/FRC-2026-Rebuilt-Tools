"use client";

import type { AnnotationReplyRecord } from "@/components/match-annotator/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type AnnotationReplyListItemProps = {
  reply: AnnotationReplyRecord;
  canEdit: boolean;
  onEdit: (reply: AnnotationReplyRecord) => void;
  onDelete: (replyId: AnnotationReplyRecord["_id"]) => void;
};

export default function AnnotationReplyListItem({
  reply,
  canEdit,
  onEdit,
  onDelete,
}: AnnotationReplyListItemProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleEdit = () => {
    setIsConfirmingDelete(false);
    onEdit(reply);
  };

  const handleConfirmDelete = () => {
    onDelete(reply._id);
    setIsConfirmingDelete(false);
  };

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-foreground">
            {reply.authorName ?? "Anonymous"}
          </p>
          <p className="mt-1 text-foreground/90">{reply.text}</p>
        </div>
        {canEdit && !isConfirmingDelete ? (
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setIsConfirmingDelete(true)}
            >
              Delete
            </Button>
          </div>
        ) : null}
      </div>

      {canEdit && isConfirmingDelete ? (
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-border/60 pt-2">
          <p className="text-xs text-muted-foreground">Are you sure you want to delete this reply?</p>
          <div className="flex shrink-0 gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
