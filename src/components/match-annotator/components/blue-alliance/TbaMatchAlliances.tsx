"use client";

import TbaMatchAllianceCard from "@/components/match-annotator/components/blue-alliance/TbaMatchAllianceCard";
import { cn } from "@/lib/utils";

type TbaMatchAlliancesProps = {
  redTeams: number[];
  blueTeams: number[];
  redScore?: number;
  blueScore?: number;
  winningAlliance?: "red" | "blue" | "";
  compact?: boolean;
};

function formatScore(score?: number) {
  if (score === undefined || score < 0) return null;
  return score;
}

export default function TbaMatchAlliances({
  redTeams,
  blueTeams,
  redScore,
  blueScore,
  winningAlliance,
  compact,
}: TbaMatchAlliancesProps) {
  const redScoreValue = formatScore(redScore);
  const blueScoreValue = formatScore(blueScore);

  return (
    <div className={cn("grid grid-cols-2 gap-2", compact && "gap-1.5")}>
      <TbaMatchAllianceCard
        teams={redTeams}
        color="red"
        score={redScoreValue}
        isWinner={winningAlliance === "red"}
        compact={compact}
      />
      <TbaMatchAllianceCard
        teams={blueTeams}
        color="blue"
        score={blueScoreValue}
        isWinner={winningAlliance === "blue"}
        compact={compact}
      />
    </div>
  );
}
