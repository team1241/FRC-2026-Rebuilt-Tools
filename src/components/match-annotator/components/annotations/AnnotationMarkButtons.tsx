"use client";

import { EDIT_MODE_BUTTON_CLASS } from "@/components/match-annotator/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnnotationMarkButtonsProps = {
  isEditing: boolean;
  onMarkIn: () => void;
  onMarkOut: () => void;
  onUseCurrentTime: () => void;
  showRangeControls: boolean;
};

export default function AnnotationMarkButtons({
  isEditing,
  onMarkIn,
  onMarkOut,
  onUseCurrentTime,
  showRangeControls,
}: AnnotationMarkButtonsProps) {
  const editButtonClass = cn(isEditing && EDIT_MODE_BUTTON_CLASS);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={editButtonClass}
        onClick={onUseCurrentTime}
      >
        Use current time
      </Button>
      {showRangeControls ? (
        <>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={editButtonClass}
            onClick={onMarkIn}
          >
            Mark start
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className={editButtonClass}
            onClick={onMarkOut}
          >
            Mark end
          </Button>
        </>
      ) : null}
    </div>
  );
}
