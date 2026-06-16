import type { Id } from "@/convex/_generated/dataModel";

export type AnnotationMode = "point" | "range";

export type AnnotatedVideoRecord = {
  _id: Id<"annotatedVideo">;
  sourceKey: string;
  sourceType: "youtube" | "local";
  title: string;
  youtubeId?: string;
  youtubeUrl?: string;
  eventKey?: string;
  matchKey?: string;
  compLevel?: string;
  matchNumber?: number;
  localLabel?: string;
  aiSummary?: string;
  createdBySubject: string;
  createdAt: string;
  updatedAt: string;
};

export type AnnotationRecord = {
  _id: Id<"annotations">;
  annotatedVideoId: Id<"annotatedVideo">;
  authorSubject: string;
  authorName?: string;
  text: string;
  startTimeSeconds: number;
  endTimeSeconds?: number;
  createdAt: string;
  updatedAt: string;
};

export type AnnotationReplyRecord = {
  _id: Id<"annotationReplies">;
  annotationId: Id<"annotations">;
  authorSubject: string;
  authorName?: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type TbaEvent = {
  eventKey: string;
  name: string;
  city?: string;
  stateProv?: string;
  startDate?: string;
};

export type TbaMatch = {
  matchKey: string;
  compLevel: string;
  matchNumber: number;
  label: string;
  redTeams: number[];
  blueTeams: number[];
  redScore?: number;
  blueScore?: number;
  winningAlliance?: "red" | "blue" | "";
  videos: { youtubeId: string }[];
};

export type BlueAllianceStep = "event" | "match" | "video";

export type AnnotatedVideoSummary = {
  _id: Id<"annotatedVideo">;
  title: string;
  sourceType: "youtube" | "local";
  youtubeId?: string;
  localLabel?: string;
  eventKey?: string;
  matchKey?: string;
  compLevel?: string;
  matchNumber?: number;
  updatedAt: string;
  annotationCount: number;
};
