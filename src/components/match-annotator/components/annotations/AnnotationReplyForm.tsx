"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type AnnotationReplyFormProps = {
  text: string;
  isSubmitting: boolean;
  editingReplyId: string | null;
  onTextChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export default function AnnotationReplyForm({
  text,
  isSubmitting,
  editingReplyId,
  onTextChange,
  onSubmit,
  onCancel,
}: AnnotationReplyFormProps) {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <Textarea
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="Write a reply..."
        rows={2}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          onClick={onSubmit}
          disabled={isSubmitting || !text.trim()}
        >
          {editingReplyId ? "Save reply" : "Reply"}
        </Button>
        {editingReplyId ? (
          <Button type="button" size="sm" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  );
}
