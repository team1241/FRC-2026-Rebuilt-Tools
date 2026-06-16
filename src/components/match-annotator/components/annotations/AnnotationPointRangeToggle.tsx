"use client";

import { EDIT_MODE_BUTTON_CLASS } from "@/components/match-annotator/constants";
import type { AnnotationMode } from "@/components/match-annotator/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnnotationPointRangeToggleProps = {
  mode: AnnotationMode;
  isEditing: boolean;
  onChange: (mode: AnnotationMode) => void;
};

export default function AnnotationPointRangeToggle({
  mode,
  isEditing,
  onChange,
}: AnnotationPointRangeToggleProps) {
  const isPointActive = mode === "point";
  const isRangeActive = mode === "range";

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        size="sm"
        variant={isPointActive ? "default" : "outline"}
        className={cn(
          isPointActive && "pointer-events-none",
          isEditing && !isPointActive && EDIT_MODE_BUTTON_CLASS
        )}
        onClick={() => onChange("point")}
      >
        Point
      </Button>
      <Button
        type="button"
        size="sm"
        variant={isRangeActive ? "default" : "outline"}
        className={cn(
          isRangeActive && "pointer-events-none",
          isEditing && !isRangeActive && EDIT_MODE_BUTTON_CLASS
        )}
        onClick={() => onChange("range")}
      >
        Range
      </Button>
    </div>
  );
}
