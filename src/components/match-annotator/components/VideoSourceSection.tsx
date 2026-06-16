"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

type VideoSourceSectionProps = {
  error: string;
  onLocalFileSelect: (file: File | null) => void;
  onOpenBlueAlliance: () => void;
};

export default function VideoSourceSection({
  error,
  onLocalFileSelect,
  onOpenBlueAlliance,
}: VideoSourceSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-row justify-between gap-4 text-left items-center">
      <p className="text-lg font-semibold text-foreground">Video source</p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={onOpenBlueAlliance}>
          Choose from Blue Alliance
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload local video
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(event) => {
            onLocalFileSelect(event.target.files?.[0] ?? null);
            event.target.value = "";
          }}
        />
      </div>

      {error ? (
        <p className="text-sm font-medium text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
