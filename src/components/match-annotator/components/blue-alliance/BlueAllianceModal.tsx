"use client";

import BlueAllianceEventStep from "@/components/match-annotator/components/blue-alliance/BlueAllianceEventStep";
import BlueAllianceMatchStep from "@/components/match-annotator/components/blue-alliance/BlueAllianceMatchStep";
import BlueAllianceVideoStep from "@/components/match-annotator/components/blue-alliance/BlueAllianceVideoStep";
import type {
  BlueAllianceStep,
  TbaEvent,
  TbaMatch,
} from "@/components/match-annotator/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BlueAllianceModalProps = {
  open: boolean;
  step: BlueAllianceStep;
  events: TbaEvent[];
  matches: TbaMatch[];
  selectedEvent: TbaEvent | null;
  selectedMatch: TbaMatch | null;
  isLoadingEvents: boolean;
  isLoadingMatches: boolean;
  eventSearchQuery: string;
  matchSearchQuery: string;
  onOpenChange: (open: boolean) => void;
  onEventSearchQueryChange: (value: string) => void;
  onMatchSearchQueryChange: (value: string) => void;
  onSelectEvent: (event: TbaEvent) => void;
  onSelectMatch: (match: TbaMatch) => void;
  onSelectVideo: (youtubeId: string) => void;
  onBackToEvents: () => void;
  onBackToMatches: () => void;
};

export default function BlueAllianceModal({
  open,
  step,
  events,
  matches,
  selectedEvent,
  selectedMatch,
  isLoadingEvents,
  isLoadingMatches,
  eventSearchQuery,
  matchSearchQuery,
  onOpenChange,
  onEventSearchQueryChange,
  onMatchSearchQueryChange,
  onSelectEvent,
  onSelectMatch,
  onSelectVideo,
  onBackToEvents,
  onBackToMatches,
}: BlueAllianceModalProps) {
  const title =
    step === "event"
      ? "Choose event"
      : step === "match"
        ? "Choose match"
        : "Choose video";

  const description =
    step === "event"
      ? "Select an event team 1241 competed at this year."
      : step === "match"
        ? "Select a match with YouTube video coverage."
        : "Select a YouTube video for this match.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {step === "event" ? (
          <BlueAllianceEventStep
            events={events}
            isLoading={isLoadingEvents}
            searchQuery={eventSearchQuery}
            onSearchQueryChange={onEventSearchQueryChange}
            onSelectEvent={onSelectEvent}
          />
        ) : null}

        {step === "match" && selectedEvent ? (
          <BlueAllianceMatchStep
            eventName={selectedEvent.name}
            matches={matches}
            isLoading={isLoadingMatches}
            searchQuery={matchSearchQuery}
            onSearchQueryChange={onMatchSearchQueryChange}
            onBack={onBackToEvents}
            onSelectMatch={onSelectMatch}
          />
        ) : null}

        {step === "video" && selectedMatch ? (
          <BlueAllianceVideoStep
            match={selectedMatch}
            onBack={onBackToMatches}
            onSelectVideo={onSelectVideo}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
