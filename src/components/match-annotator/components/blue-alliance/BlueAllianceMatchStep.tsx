"use client";

import TbaMatchAlliances from "@/components/match-annotator/components/blue-alliance/TbaMatchAlliances";
import type { TbaMatch } from "@/components/match-annotator/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type BlueAllianceMatchStepProps = {
  eventName: string;
  matches: TbaMatch[];
  isLoading: boolean;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onBack: () => void;
  onSelectMatch: (match: TbaMatch) => void;
};

function matchMatchesQuery(match: TbaMatch, query: string) {
  if (!query) return true;

  const teamNumbers = [...match.redTeams, ...match.blueTeams]
    .map(String)
    .join(" ");
  const scores = [match.redScore, match.blueScore]
    .filter((score) => score !== undefined && score >= 0)
    .map(String)
    .join(" ");

  const haystack = [
    match.label,
    match.matchKey,
    match.compLevel,
    String(match.matchNumber),
    teamNumbers,
    scores,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export default function BlueAllianceMatchStep({
  eventName,
  matches,
  isLoading,
  searchQuery,
  onSearchQueryChange,
  onBack,
  onSelectMatch,
}: BlueAllianceMatchStepProps) {
  const query = searchQuery.trim().toLowerCase();
  const filteredMatches = matches.filter((match) =>
    matchMatchesQuery(match, query),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{eventName}</p>
        <Button type="button" size="sm" variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>

      <Input
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
        placeholder="Search matches, teams, or scores..."
      />

      <div className="max-h-80 space-y-3 overflow-y-auto">
        {matches.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No matches with YouTube videos found for this event.
          </p>
        ) : filteredMatches.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No matches match your search.
          </p>
        ) : (
          filteredMatches.map((match) => (
            <button
              key={match.matchKey}
              type="button"
              className={cn(
                "w-full rounded-xl border border-border px-3 py-3 text-left transition-colors hover:bg-muted/40 cursor-pointer",
              )}
              onClick={() => onSelectMatch(match)}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">{match.label}</p>
                <Badge variant="secondary">
                  {match.videos.length} video
                  {match.videos.length === 1 ? "" : "s"}
                </Badge>
              </div>
              <div className="mt-3">
                <TbaMatchAlliances
                  redTeams={match.redTeams}
                  blueTeams={match.blueTeams}
                  redScore={match.redScore}
                  blueScore={match.blueScore}
                  winningAlliance={match.winningAlliance}
                  compact
                />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
