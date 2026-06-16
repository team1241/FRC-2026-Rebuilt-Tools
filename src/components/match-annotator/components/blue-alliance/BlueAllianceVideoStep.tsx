"use client";

import TbaMatchAlliances from "@/components/match-annotator/components/blue-alliance/TbaMatchAlliances";
import type { TbaMatch } from "@/components/match-annotator/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BlueAllianceVideoStepProps = {
  match: TbaMatch;
  onBack: () => void;
  onSelectVideo: (youtubeId: string) => void;
};

export default function BlueAllianceVideoStep({
  match,
  onBack,
  onSelectVideo,
}: BlueAllianceVideoStepProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{match.label}</p>
        <Button type="button" size="sm" variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>

      <TbaMatchAlliances
        redTeams={match.redTeams}
        blueTeams={match.blueTeams}
        redScore={match.redScore}
        blueScore={match.blueScore}
        winningAlliance={match.winningAlliance}
      />

      <div className="space-y-2">
        {match.videos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No YouTube videos for this match.
          </p>
        ) : (
          match.videos.map((video) => (
            <button
              key={video.youtubeId}
              type="button"
              className={cn(
                "w-full rounded-xl border border-border px-3 py-3 text-left transition-colors hover:bg-muted/40",
              )}
              onClick={() => onSelectVideo(video.youtubeId)}
            >
              <p className="font-medium text-foreground">
                YouTube — {video.youtubeId}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
