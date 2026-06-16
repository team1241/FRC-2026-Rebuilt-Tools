import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
import { buildAnnotatedVideoTitle } from "@/components/match-annotator/utils/build-annotated-video-title";

type CreateYoutubeSessionArgs = {
  youtubeId: string;
  youtubeUrl?: string;
  eventKey?: string;
  matchKey?: string;
  compLevel?: string;
  matchNumber?: number;
};

type CreateLocalSessionArgs = {
  localLabel: string;
};

export default function useAnnotatedVideoSession() {
  const [annotatedVideoId, setAnnotatedVideoId] = useQueryState("annotatedVideoId");

  const annotatedVideo = useQuery(
    api.annotatedVideos.getAnnotatedVideo,
    annotatedVideoId
      ? { annotatedVideoId: annotatedVideoId as Id<"annotatedVideo"> }
      : "skip"
  );

  const getOrCreateAnnotatedVideo = useMutation(
    api.annotatedVideos.getOrCreateAnnotatedVideo
  );

  const createYoutubeSession = useCallback(
    async (args: CreateYoutubeSessionArgs) => {
      const youtubeUrl =
        args.youtubeUrl ?? `https://www.youtube.com/watch?v=${args.youtubeId}`;
      const id = await getOrCreateAnnotatedVideo({
        sourceType: "youtube",
        youtubeId: args.youtubeId,
        youtubeUrl,
        eventKey: args.eventKey,
        matchKey: args.matchKey,
        compLevel: args.compLevel,
        matchNumber: args.matchNumber,
        title: buildAnnotatedVideoTitle({
          sourceType: "youtube",
          youtubeId: args.youtubeId,
          eventKey: args.eventKey,
          compLevel: args.compLevel,
          matchNumber: args.matchNumber,
        }),
      });
      await setAnnotatedVideoId(id);
      return id;
    },
    [getOrCreateAnnotatedVideo, setAnnotatedVideoId]
  );

  const createLocalSession = useCallback(
    async (args: CreateLocalSessionArgs) => {
      const id = await getOrCreateAnnotatedVideo({
        sourceType: "local",
        localLabel: args.localLabel,
        title: buildAnnotatedVideoTitle({
          sourceType: "local",
          localLabel: args.localLabel,
        }),
      });
      await setAnnotatedVideoId(id);
      return id;
    },
    [getOrCreateAnnotatedVideo, setAnnotatedVideoId]
  );

  const openExistingSession = useCallback(
    async (id: Id<"annotatedVideo">) => {
      await setAnnotatedVideoId(id);
    },
    [setAnnotatedVideoId]
  );

  return {
    annotatedVideoId: annotatedVideoId as Id<"annotatedVideo"> | null,
    annotatedVideo,
    createYoutubeSession,
    createLocalSession,
    openExistingSession,
    setAnnotatedVideoId,
  };
}
