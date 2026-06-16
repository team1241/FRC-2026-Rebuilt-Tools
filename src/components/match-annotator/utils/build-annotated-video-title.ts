type BuildTitleArgs = {
  sourceType: "youtube" | "local";
  youtubeId?: string;
  localLabel?: string;
  eventKey?: string;
  compLevel?: string;
  matchNumber?: number;
};

export function buildAnnotatedVideoTitle(args: BuildTitleArgs) {
  if (args.eventKey && args.compLevel && args.matchNumber !== undefined) {
    return `${args.eventKey} — ${args.compLevel.toUpperCase()} ${args.matchNumber}`;
  }
  if (args.sourceType === "local" && args.localLabel) {
    return args.localLabel;
  }
  if (args.youtubeId) {
    return `YouTube — ${args.youtubeId}`;
  }
  return "Untitled video";
}
