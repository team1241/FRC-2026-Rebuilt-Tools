"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

type LocalVideoReuploadBannerProps = {
  localLabel?: string;
  onLocalFileSelect: (file: File | null) => void;
};

export default function LocalVideoReuploadBanner({
  localLabel,
  onLocalFileSelect,
}: LocalVideoReuploadBannerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
      <p className="text-sm font-medium text-foreground">
        Re-select your local video to sync annotations
      </p>
      {localLabel ? (
        <p className="mt-1 text-xs text-muted-foreground">
          Expected file: {localLabel}
        </p>
      ) : null}
      <div className="mt-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose video file
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
    </div>
  );
}
