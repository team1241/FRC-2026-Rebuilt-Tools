"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";

const TEAM_KEY = "frc1241";

const tbaEventValidator = v.object({
  eventKey: v.string(),
  name: v.string(),
  city: v.optional(v.string()),
  stateProv: v.optional(v.string()),
  startDate: v.optional(v.string()),
});

const tbaVideoValidator = v.object({
  youtubeId: v.string(),
});

const tbaMatchValidator = v.object({
  matchKey: v.string(),
  compLevel: v.string(),
  matchNumber: v.number(),
  label: v.string(),
  redTeams: v.array(v.number()),
  blueTeams: v.array(v.number()),
  redScore: v.optional(v.number()),
  blueScore: v.optional(v.number()),
  winningAlliance: v.optional(
    v.union(v.literal("red"), v.literal("blue"), v.literal(""))
  ),
  videos: v.array(tbaVideoValidator),
});

function getTbaApiKey() {
  const apiKey = process.env.TBA_API_KEY;
  if (!apiKey) {
    throw new Error("TBA_API_KEY is not configured in the Convex environment");
  }
  return apiKey;
}

async function fetchTba<T>(path: string): Promise<T> {
  const response = await fetch(`https://www.thebluealliance.com/api/v3${path}`, {
    headers: {
      "X-TBA-Auth-Key": getTbaApiKey(),
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `TBA API error for ${path}: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as T;
}

function getString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function getNumber(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function parseAllianceScore(alliance: Record<string, unknown> | undefined) {
  const score = getNumber(alliance ?? {}, "score");
  if (score === undefined || score < 0) return undefined;
  return score;
}

function parseWinningAlliance(value: unknown): "red" | "blue" | "" | undefined {
  if (value === "red" || value === "blue") return value;
  if (value === "") return "";
  return undefined;
}

function parseTeamNumbers(alliance: unknown): number[] {
  if (!Array.isArray(alliance)) return [];
  return alliance
    .map((team) => {
      if (typeof team === "string") {
        const match = team.match(/(\d+)$/);
        return match ? Number(match[1]) : undefined;
      }
      if (typeof team === "number") return team;
      return undefined;
    })
    .filter((team): team is number => team !== undefined);
}

function parseYoutubeVideos(videos: unknown) {
  if (!Array.isArray(videos)) return [];

  return videos
    .filter((video) => {
      if (!video || typeof video !== "object" || Array.isArray(video)) {
        return false;
      }
      const record = video as Record<string, unknown>;
      return record.type === "youtube" && typeof record.key === "string";
    })
    .map((video) => ({
      youtubeId: (video as Record<string, unknown>).key as string,
    }));
}

function formatMatchLabel(compLevel: string, matchNumber: number) {
  const level = compLevel.toLowerCase();
  if (level === "qm") return `QM ${matchNumber}`;
  if (level === "sf") return `SF ${matchNumber}`;
  if (level === "f") return `Final ${matchNumber}`;
  return `${compLevel.toUpperCase()} ${matchNumber}`;
}

const COMP_LEVEL_ORDER: Record<string, number> = {
  qm: 0,
  ef: 1,
  qf: 2,
  sf: 3,
  f: 4,
};

export const getTeam1241Events = action({
  args: {},
  returns: v.array(tbaEventValidator),
  handler: async () => {
    const year = new Date().getFullYear();
    const events = await fetchTba<unknown[]>(
      `/team/${TEAM_KEY}/events/${year}`
    );

    if (!Array.isArray(events)) return [];

    return events
      .map((event) => {
        if (!event || typeof event !== "object" || Array.isArray(event)) {
          return null;
        }
        const record = event as Record<string, unknown>;
        const eventKey = getString(record, "key");
        const name = getString(record, "name");
        if (!eventKey || !name) return null;

        return {
          eventKey,
          name,
          city: getString(record, "city"),
          stateProv: getString(record, "state_prov"),
          startDate: getString(record, "start_date"),
        };
      })
      .filter((event): event is NonNullable<typeof event> => event !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const getTeam1241Matches = action({
  args: { eventKey: v.string() },
  returns: v.array(tbaMatchValidator),
  handler: async (_ctx, args) => {
    const eventKey = args.eventKey.trim();
    if (!eventKey) return [];

    const matches = await fetchTba<unknown[]>(
      `/team/${TEAM_KEY}/event/${eventKey}/matches`
    );

    if (!Array.isArray(matches)) return [];

    return matches
      .map((match) => {
        if (!match || typeof match !== "object" || Array.isArray(match)) {
          return null;
        }
        const record = match as Record<string, unknown>;
        const matchKey = getString(record, "key");
        const compLevel = getString(record, "comp_level");
        const matchNumber = getNumber(record, "match_number");
        if (!matchKey || !compLevel || matchNumber === undefined) return null;

        const alliances = record.alliances as
          | Record<string, Record<string, unknown>>
          | undefined;
        const videos = parseYoutubeVideos(record.videos);
        if (videos.length === 0) return null;

        const redAlliance = alliances?.red;
        const blueAlliance = alliances?.blue;
        const redScore = parseAllianceScore(redAlliance);
        const blueScore = parseAllianceScore(blueAlliance);
        const winningAlliance = parseWinningAlliance(record.winning_alliance);

        return {
          matchKey,
          compLevel,
          matchNumber,
          label: formatMatchLabel(compLevel, matchNumber),
          redTeams: parseTeamNumbers(redAlliance?.team_keys),
          blueTeams: parseTeamNumbers(blueAlliance?.team_keys),
          redScore,
          blueScore,
          winningAlliance,
          videos,
        };
      })
      .filter((match): match is NonNullable<typeof match> => match !== null)
      .sort((a, b) => {
        const levelDiff =
          (COMP_LEVEL_ORDER[a.compLevel.toLowerCase()] ?? 99) -
          (COMP_LEVEL_ORDER[b.compLevel.toLowerCase()] ?? 99);
        if (levelDiff !== 0) return levelDiff;
        return a.matchNumber - b.matchNumber;
      });
  },
});
