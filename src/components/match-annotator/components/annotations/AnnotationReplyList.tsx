"use client";

import AnnotationReplyForm from "@/components/match-annotator/components/annotations/AnnotationReplyForm";
import AnnotationReplyListItem from "@/components/match-annotator/components/annotations/AnnotationReplyListItem";
import type { AnnotationReplyRecord } from "@/components/match-annotator/types";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

type AnnotationReplyListProps = {
  replies: AnnotationReplyRecord[];
  currentUserSubject: string | null;
  replyText: string;
  editingReplyId: string | null;
  isSubmitting: boolean;
  onReplyTextChange: (value: string) => void;
  onSubmitReply: () => void;
  onCancelReplyEdit: () => void;
  onEditReply: (reply: AnnotationReplyRecord) => void;
  onDeleteReply: (replyId: AnnotationReplyRecord["_id"]) => void;
};

export default function AnnotationReplyList({
  replies,
  currentUserSubject,
  replyText,
  editingReplyId,
  isSubmitting,
  onReplyTextChange,
  onSubmitReply,
  onCancelReplyEdit,
  onEditReply,
  onDeleteReply,
}: AnnotationReplyListProps) {
  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-3">
      {replies.length === 0 ? (
        <p className="text-xs text-muted-foreground">No replies yet.</p>
      ) : (
        replies.map((reply) => (
          <AnnotationReplyListItem
            key={reply._id}
            reply={reply}
            canEdit={currentUserSubject === reply.authorSubject}
            onEdit={onEditReply}
            onDelete={onDeleteReply}
          />
        ))
      )}

      <Authenticated>
        <AnnotationReplyForm
          text={replyText}
          isSubmitting={isSubmitting}
          editingReplyId={editingReplyId}
          onTextChange={onReplyTextChange}
          onSubmit={onSubmitReply}
          onCancel={onCancelReplyEdit}
        />
      </Authenticated>

      <Unauthenticated>
        <SignInButton mode="modal">
          <Button type="button" size="sm" variant="outline">
            Sign in to reply
          </Button>
        </SignInButton>
      </Unauthenticated>
    </div>
  );
}
