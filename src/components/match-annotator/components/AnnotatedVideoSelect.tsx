"use client";

import { useMemo } from "react";
import type { AnnotatedVideoSummary } from "@/components/match-annotator/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Id } from "@/convex/_generated/dataModel";
import { scheduleDocumentScrollRestore } from "@/lib/scroll-lock";

type AnnotatedVideoSelectProps = {
  annotatedVideoId: Id<"annotatedVideo"> | null;
  videos: AnnotatedVideoSummary[] | undefined;
  onSelect: (id: Id<"annotatedVideo"> | null) => void;
};

export default function AnnotatedVideoSelect({
  annotatedVideoId,
  videos,
  onSelect,
}: AnnotatedVideoSelectProps) {
  const selectItems = useMemo(
    () =>
      (videos ?? []).map((video) => ({
        value: video._id,
        label: video.title,
      })),
    [videos],
  );

  return (
    <Select
      value={annotatedVideoId ?? ""}
      items={selectItems}
      onValueChange={(value) => {
        onSelect(value ? (value as Id<"annotatedVideo">) : null);
      }}
      onOpenChange={(open) => {
        if (!open) {
          scheduleDocumentScrollRestore();
        }
      }}
    >
      <SelectTrigger className="w-72">
        <SelectValue placeholder="Select an annotated video" />
      </SelectTrigger>
      <SelectContent className="w-72">
        <SelectGroup>
          {videos?.length ? (
            videos.map((video) => (
              <SelectItem key={video._id} value={video._id}>
                {video.title}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-videos" disabled>
              {videos === undefined ? "Loading videos..." : "No saved videos"}
            </SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
