"use client";

import type { TbaEvent } from "@/components/match-annotator/types";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type BlueAllianceEventStepProps = {
  events: TbaEvent[];
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSelectEvent: (event: TbaEvent) => void;
};

export default function BlueAllianceEventStep({
  events,
  isLoading,
  searchQuery,
  onSearchQueryChange,
  onSelectEvent,
}: BlueAllianceEventStepProps) {
  const filteredEvents = events.filter((event) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      event.name.toLowerCase().includes(query) ||
      event.eventKey.toLowerCase().includes(query) ||
      event.city?.toLowerCase().includes(query) ||
      event.stateProv?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        placeholder="Search events..."
      />
      <div className="max-h-100 space-y-2 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No events found for team 1241 this year.
          </p>
        ) : (
          filteredEvents.map((event) => (
            <button
              key={event.eventKey}
              type="button"
              className={cn(
                "w-full rounded-xl cursor-pointer border border-border px-3 py-3 text-left transition-colors hover:bg-muted/40",
              )}
              onClick={() => onSelectEvent(event)}
            >
              <p className="font-medium text-foreground">{event.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {event.eventKey}
                {event.city || event.stateProv
                  ? ` · ${[event.city, event.stateProv].filter(Boolean).join(", ")}`
                  : ""}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
