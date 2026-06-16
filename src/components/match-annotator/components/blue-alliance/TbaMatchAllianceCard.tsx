"use client";

import { TEAM_NUMBER } from "@/components/match-annotator/constants";
import { cn } from "@/lib/utils";

type TbaMatchAllianceCardProps = {
  teams: number[];
  color: "red" | "blue";
  score: number | null;
  isWinner: boolean;
  compact?: boolean;
};

export default function TbaMatchAllianceCard({
  teams,
  color,
  score,
  isWinner,
  compact,
}: TbaMatchAllianceCardProps) {
  const isRed = color === "red";

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col rounded-lg border p-2.5",
        isRed
          ? "border-red-300/80 bg-red-500/10"
          : "border-blue-300/80 bg-blue-500/10",
        isWinner && (isRed ? "ring-2 ring-red-400/60" : "ring-2 ring-blue-400/60")
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-xs font-bold uppercase tracking-wide",
            isRed ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400"
          )}
        >
          {isRed ? "Red" : "Blue"}
        </span>
        {score !== null ? (
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              isRed ? "text-red-700 dark:text-red-300" : "text-blue-700 dark:text-blue-300"
            )}
          >
            {score}
          </span>
        ) : null}
      </div>
      <div
        className={cn(
          "mt-2 flex flex-wrap",
          compact ? "gap-1" : "gap-1.5"
        )}
      >
        {teams.map((team) => (
          <span
            key={team}
            className={cn(
              "rounded-md px-2 py-0.5 font-semibold tabular-nums",
              compact ? "text-xs" : "text-sm",
              team === TEAM_NUMBER
                ? isRed
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
                : isRed
                  ? "bg-red-500/20 text-red-900 dark:text-red-100"
                  : "bg-blue-500/20 text-blue-900 dark:text-blue-100"
            )}
          >
            {team}
          </span>
        ))}
      </div>
    </div>
  );
}
