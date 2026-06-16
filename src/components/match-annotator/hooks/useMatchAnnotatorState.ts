"use client";

import useAnnotatedVideoSession from "@/components/match-annotator/hooks/useAnnotatedVideoSession";
import useAnnotationForm from "@/components/match-annotator/hooks/useAnnotationForm";
import useAnnotationPlayback from "@/components/match-annotator/hooks/useAnnotationPlayback";
import type {
  AnnotationRecord,
  AnnotationReplyRecord,
  BlueAllianceStep,
  TbaEvent,
  TbaMatch,
} from "@/components/match-annotator/types";
import { formatTimecodeRange } from "@/components/match-annotator/utils/format-timecode";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import usePlaybackControls from "@/hooks/video/use-playback-controls";
import useVideoSource from "@/hooks/video/use-video-source";
import useYouTubePlayer from "@/hooks/video/use-youtube-player";
import { useAuth, useUser } from "@clerk/nextjs";
import { useAction, useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function useMatchAnnotatorState() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { user } = useUser();
  const { userId } = useAuth();

  const {
    annotatedVideoId,
    annotatedVideo,
    createYoutubeSession,
    createLocalSession,
    openExistingSession,
    setAnnotatedVideoId,
  } = useAnnotatedVideoSession();

  const {
    error,
    loadedUrl,
    loadedVideoLabel,
    clearVideo,
    loadFromFile,
    loadFromYoutubeId,
    sourceType,
    youtubeId,
  } = useVideoSource();

  const isYouTube = sourceType === "youtube";
  const isHtml5 = sourceType === "html5";

  const { youtubeContainerRef, youtubePlayerRef } = useYouTubePlayer({
    isYouTube,
    youtubeId,
  });

  const { getCurrentTime, getDuration, seekTo } = usePlaybackControls({
    isHtml5,
    isYouTube,
    videoRef,
    youtubePlayerRef,
  });

  const annotations = useQuery(
    api.annotations.listAnnotations,
    annotatedVideoId ? { annotatedVideoId } : "skip"
  );

  const savedVideos = useQuery(api.annotatedVideos.listMyAnnotatedVideos);

  const createAnnotation = useMutation(api.annotations.createAnnotation);
  const updateAnnotation = useMutation(api.annotations.updateAnnotation);
  const removeAnnotation = useMutation(api.annotations.removeAnnotation);
  const createAnnotationReply = useMutation(
    api.annotationReplies.createAnnotationReply
  );
  const updateAnnotationReply = useMutation(
    api.annotationReplies.updateAnnotationReply
  );
  const removeAnnotationReply = useMutation(
    api.annotationReplies.removeAnnotationReply
  );
  const saveAnnotatedVideoSummary = useMutation(
    api.annotatedVideos.saveAnnotatedVideoSummary
  );
  const deleteAnnotatedVideoSummary = useMutation(
    api.annotatedVideos.deleteAnnotatedVideoSummary
  );
  const removeAnnotatedVideo = useMutation(
    api.annotatedVideos.removeAnnotatedVideo
  );

  const getTeam1241Events = useAction(api.tba.getTeam1241Events);
  const getTeam1241Matches = useAction(api.tba.getTeam1241Matches);

  const annotationForm = useAnnotationForm({ getCurrentTime });
  const { activeAnnotationId } = useAnnotationPlayback({
    annotations: annotations ?? [],
    getCurrentTime,
  });

  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSubmittingAnnotation, setIsSubmittingAnnotation] = useState(false);
  const [expandedAnnotationId, setExpandedAnnotationId] = useState<string | null>(
    null
  );
  const [repliesCacheByAnnotationId, setRepliesCacheByAnnotationId] = useState<
    Record<string, AnnotationReplyRecord[]>
  >({});
  const [replyTextByAnnotationId, setReplyTextByAnnotationId] = useState<
    Record<string, string>
  >({});
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingReplyAnnotationId, setEditingReplyAnnotationId] = useState<
    string | null
  >(null);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const [blueAllianceOpen, setBlueAllianceOpen] = useState(false);
  const [blueAllianceStep, setBlueAllianceStep] =
    useState<BlueAllianceStep>("event");
  const [tbaEvents, setTbaEvents] = useState<TbaEvent[]>([]);
  const [tbaMatches, setTbaMatches] = useState<TbaMatch[]>([]);
  const [selectedTbaEvent, setSelectedTbaEvent] = useState<TbaEvent | null>(
    null
  );
  const [selectedTbaMatch, setSelectedTbaMatch] = useState<TbaMatch | null>(
    null
  );
  const [isLoadingTbaEvents, setIsLoadingTbaEvents] = useState(false);
  const [isLoadingTbaMatches, setIsLoadingTbaMatches] = useState(false);
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [matchSearchQuery, setMatchSearchQuery] = useState("");

  const [annotationPendingDelete, setAnnotationPendingDelete] = useState<{
    id: Id<"annotations">;
    text: string;
    timeLabel: string;
  } | null>(null);
  const [annotatedVideoPendingDelete, setAnnotatedVideoPendingDelete] =
    useState(false);
  const [isDeletingAnnotatedVideo, setIsDeletingAnnotatedVideo] = useState(false);
  const [pendingLocalReload, setPendingLocalReload] = useState(false);
  const [annotationSummary, setAnnotationSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isSavingSummary, setIsSavingSummary] = useState(false);
  const [isDeletingSummary, setIsDeletingSummary] = useState(false);
  const restoredVideoIdRef = useRef<string | null>(null);
  const openingVideoIdRef = useRef<Id<"annotatedVideo"> | null>(null);
  const loadedSummaryVideoIdRef = useRef<string | null>(null);

  const expandedReplies = useQuery(
    api.annotationReplies.listAnnotationReplies,
    expandedAnnotationId
      ? { annotationId: expandedAnnotationId as Id<"annotations"> }
      : "skip"
  );

  useEffect(() => {
    setRepliesCacheByAnnotationId({});
    setExpandedAnnotationId(null);
    loadedSummaryVideoIdRef.current = null;
    setAnnotationSummary(null);
  }, [annotatedVideoId]);

  useEffect(() => {
    if (!annotatedVideoId || annotatedVideo === undefined) return;
    if (loadedSummaryVideoIdRef.current === annotatedVideoId) return;

    loadedSummaryVideoIdRef.current = annotatedVideoId;
    setAnnotationSummary(annotatedVideo?.aiSummary ?? null);
  }, [annotatedVideoId, annotatedVideo]);

  useEffect(() => {
    if (!expandedAnnotationId || expandedReplies === undefined) return;

    setRepliesCacheByAnnotationId((current) => ({
      ...current,
      [expandedAnnotationId]: expandedReplies,
    }));
  }, [expandedAnnotationId, expandedReplies]);

  useEffect(() => {
    setCurrentTime(0);
  }, [annotatedVideoId, loadedUrl, youtubeId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDuration(getDuration());
      const time = getCurrentTime();
      if (time !== null) {
        setCurrentTime(time);
      }
    }, 250);
    return () => window.clearInterval(interval);
  }, [getCurrentTime, getDuration, isHtml5, isYouTube, youtubeId, loadedUrl]);

  useEffect(() => {
    if (!annotatedVideo) return;

    if (openingVideoIdRef.current !== null) {
      if (annotatedVideo._id !== openingVideoIdRef.current) return;
      openingVideoIdRef.current = null;
    }

    if (restoredVideoIdRef.current === annotatedVideo._id) return;

    if (annotatedVideo.sourceType === "youtube" && annotatedVideo.youtubeId) {
      loadFromYoutubeId(annotatedVideo.youtubeId, annotatedVideo.title);
      restoredVideoIdRef.current = annotatedVideo._id;
      setPendingLocalReload(false);
      return;
    }

    if (annotatedVideo.sourceType === "local") {
      restoredVideoIdRef.current = annotatedVideo._id;
      setPendingLocalReload(!loadedUrl);
    }
  }, [annotatedVideo, loadFromYoutubeId, loadedUrl]);

  const handleLocalFileSelect = useCallback(
    async (file: File | null) => {
      if (!loadFromFile(file)) return;

      if (annotatedVideo?.sourceType === "local" && annotatedVideoId) {
        setPendingLocalReload(false);
        return;
      }

      try {
        await createLocalSession({ localLabel: file!.name });
        setPendingLocalReload(false);
      } catch (loadError) {
        toast.error(
          loadError instanceof Error ? loadError.message : "Failed to save video"
        );
      }
    },
    [
      annotatedVideo,
      annotatedVideoId,
      createLocalSession,
      loadFromFile,
    ]
  );

  const handleSubmitAnnotation = useCallback(async () => {
    if (!annotatedVideoId) {
      toast.error("Load a video before adding annotations.");
      return;
    }

    setIsSubmittingAnnotation(true);
    try {
      const startTimeSeconds = annotationForm.resolvedStartTime;
      const endTimeSeconds = annotationForm.resolvedEndTime;

      if (annotationForm.editingId) {
        await updateAnnotation({
          annotationId: annotationForm.editingId as Id<"annotations">,
          text: annotationForm.text,
          startTimeSeconds,
          endTimeSeconds,
        });
        toast.success("Annotation updated");
      } else {
        await createAnnotation({
          annotatedVideoId,
          text: annotationForm.text,
          startTimeSeconds,
          endTimeSeconds,
          authorName: user?.fullName ?? user?.username ?? undefined,
        });
        toast.success("Annotation added");
      }
      annotationForm.resetForm();
    } catch (submitError) {
      toast.error(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save annotation"
      );
    } finally {
      setIsSubmittingAnnotation(false);
    }
  }, [
    annotatedVideoId,
    annotationForm,
    createAnnotation,
    updateAnnotation,
    user,
  ]);

  const handleDeleteAnnotation = useCallback(
    async (annotationId: Id<"annotations">) => {
      try {
        await removeAnnotation({ annotationId });
        setRepliesCacheByAnnotationId((current) => {
          const next = { ...current };
          delete next[annotationId];
          return next;
        });
        if (expandedAnnotationId === annotationId) {
          setExpandedAnnotationId(null);
        }
        if (annotationForm.editingId === annotationId) {
          annotationForm.resetForm();
        }
        toast.success("Annotation deleted");
      } catch (deleteError) {
        toast.error(
          deleteError instanceof Error
            ? deleteError.message
            : "Failed to delete annotation"
        );
      }
    },
    [annotationForm, expandedAnnotationId, removeAnnotation]
  );

  const requestDeleteAnnotation = useCallback((annotation: AnnotationRecord) => {
    setAnnotationPendingDelete({
      id: annotation._id,
      text: annotation.text,
      timeLabel: formatTimecodeRange(
        annotation.startTimeSeconds,
        annotation.endTimeSeconds
      ),
    });
  }, []);

  const confirmDeleteAnnotation = useCallback(async () => {
    if (!annotationPendingDelete) return;
    const annotationId = annotationPendingDelete.id;
    setAnnotationPendingDelete(null);
    await handleDeleteAnnotation(annotationId);
  }, [annotationPendingDelete, handleDeleteAnnotation]);

  const cancelDeleteAnnotation = useCallback(() => {
    setAnnotationPendingDelete(null);
  }, []);

  const handleToggleExpand = useCallback((annotationId: string) => {
    setExpandedAnnotationId((current) =>
      current === annotationId ? null : annotationId
    );
    setEditingReplyId(null);
    setEditingReplyAnnotationId(null);
  }, []);

  const handleReplyTextChange = useCallback(
    (annotationId: string, value: string) => {
      setReplyTextByAnnotationId((current) => ({
        ...current,
        [annotationId]: value,
      }));
    },
    []
  );

  const handleSubmitReply = useCallback(
    async (annotationId: string) => {
      const text = replyTextByAnnotationId[annotationId]?.trim();
      if (!text) return;

      setIsSubmittingReply(true);
      try {
        if (editingReplyId && editingReplyAnnotationId === annotationId) {
          await updateAnnotationReply({
            replyId: editingReplyId as Id<"annotationReplies">,
            text,
          });
          toast.success("Reply updated");
        } else {
          await createAnnotationReply({
            annotationId: annotationId as Id<"annotations">,
            text,
            authorName: user?.fullName ?? user?.username ?? undefined,
          });
          toast.success("Reply added");
        }
        setReplyTextByAnnotationId((current) => ({
          ...current,
          [annotationId]: "",
        }));
        setEditingReplyId(null);
        setEditingReplyAnnotationId(null);
      } catch (replyError) {
        toast.error(
          replyError instanceof Error ? replyError.message : "Failed to save reply"
        );
      } finally {
        setIsSubmittingReply(false);
      }
    },
    [
      createAnnotationReply,
      editingReplyAnnotationId,
      editingReplyId,
      replyTextByAnnotationId,
      updateAnnotationReply,
      user,
    ]
  );

  const handleEditReply = useCallback((reply: AnnotationReplyRecord) => {
    setEditingReplyId(reply._id);
    setEditingReplyAnnotationId(reply.annotationId);
    setReplyTextByAnnotationId((current) => ({
      ...current,
      [reply.annotationId]: reply.text,
    }));
  }, []);

  const handleDeleteReply = useCallback(
    async (replyId: Id<"annotationReplies">) => {
      try {
        await removeAnnotationReply({ replyId });
        toast.success("Reply deleted");
      } catch (deleteError) {
        toast.error(
          deleteError instanceof Error
            ? deleteError.message
            : "Failed to delete reply"
        );
      }
    },
    [removeAnnotationReply]
  );

  const openBlueAlliance = useCallback(async () => {
    setBlueAllianceOpen(true);
    setBlueAllianceStep("event");
    setSelectedTbaEvent(null);
    setSelectedTbaMatch(null);
    setEventSearchQuery("");
    setMatchSearchQuery("");
    setIsLoadingTbaEvents(true);
    try {
      const events = await getTeam1241Events({});
      setTbaEvents(events);
    } catch (loadError) {
      toast.error(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load Blue Alliance events"
      );
    } finally {
      setIsLoadingTbaEvents(false);
    }
  }, [getTeam1241Events]);

  const handleSelectTbaEvent = useCallback(
    async (event: TbaEvent) => {
      setSelectedTbaEvent(event);
      setBlueAllianceStep("match");
      setMatchSearchQuery("");
      setIsLoadingTbaMatches(true);
      try {
        const matches = await getTeam1241Matches({ eventKey: event.eventKey });
        setTbaMatches(matches);
      } catch (loadError) {
        toast.error(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load matches"
        );
      } finally {
        setIsLoadingTbaMatches(false);
      }
    },
    [getTeam1241Matches]
  );

  const handleSelectTbaMatch = useCallback((match: TbaMatch) => {
    setSelectedTbaMatch(match);
    setBlueAllianceStep("video");
  }, []);

  const handleSelectTbaVideo = useCallback(
    async (selectedYoutubeId: string) => {
      loadFromYoutubeId(selectedYoutubeId);
      setBlueAllianceOpen(false);

      try {
        await createYoutubeSession({
          youtubeId: selectedYoutubeId,
          eventKey: selectedTbaEvent?.eventKey,
          matchKey: selectedTbaMatch?.matchKey,
          compLevel: selectedTbaMatch?.compLevel,
          matchNumber: selectedTbaMatch?.matchNumber,
        });
      } catch (loadError) {
        toast.error(
          loadError instanceof Error ? loadError.message : "Failed to save video"
        );
      }
    },
    [
      createYoutubeSession,
      loadFromYoutubeId,
      selectedTbaEvent,
      selectedTbaMatch,
    ]
  );

  const handleSelectAnnotatedVideo = useCallback(
    async (id: Id<"annotatedVideo"> | null) => {
      if (id === annotatedVideoId) return;

      clearVideo();
      restoredVideoIdRef.current = null;
      setPendingLocalReload(false);
      annotationForm.resetForm();

      if (!id) {
        openingVideoIdRef.current = null;
        await setAnnotatedVideoId(null);
        return;
      }

      openingVideoIdRef.current = id;
      await openExistingSession(id);
    },
    [
      annotatedVideoId,
      annotationForm,
      clearVideo,
      openExistingSession,
      setAnnotatedVideoId,
    ]
  );

  const requestDeleteAnnotatedVideo = useCallback(() => {
    setAnnotatedVideoPendingDelete(true);
  }, []);

  const cancelDeleteAnnotatedVideo = useCallback(() => {
    setAnnotatedVideoPendingDelete(false);
  }, []);

  const confirmDeleteAnnotatedVideo = useCallback(async () => {
    if (!annotatedVideoId || isDeletingAnnotatedVideo) return;

    setIsDeletingAnnotatedVideo(true);
    try {
      await removeAnnotatedVideo({ annotatedVideoId });
      clearVideo();
      openingVideoIdRef.current = null;
      restoredVideoIdRef.current = null;
      loadedSummaryVideoIdRef.current = null;
      setPendingLocalReload(false);
      setAnnotationSummary(null);
      annotationForm.resetForm();
      setAnnotatedVideoPendingDelete(false);
      await setAnnotatedVideoId(null);
      toast.success("Annotated video deleted");
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete annotated video"
      );
    } finally {
      setIsDeletingAnnotatedVideo(false);
    }
  }, [
    annotatedVideoId,
    annotationForm,
    clearVideo,
    isDeletingAnnotatedVideo,
    removeAnnotatedVideo,
    setAnnotatedVideoId,
  ]);

  const canDeleteAnnotatedVideo =
    annotatedVideoId !== null &&
    annotatedVideo !== undefined &&
    annotatedVideo !== null &&
    annotatedVideo.createdBySubject === userId;

  const handleGenerateSummary = useCallback(async () => {
    if (!annotatedVideoId || isGeneratingSummary) return;

    setIsGeneratingSummary(true);
    setAnnotationSummary(null);

    try {
      const response = await fetch("/api/ai/annotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annotatedVideoId }),
      });

      const data = (await response.json()) as { summary?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate summary");
      }

      setAnnotationSummary(data.summary ?? null);
    } catch (generateError) {
      toast.error(
        generateError instanceof Error
          ? generateError.message
          : "Failed to generate summary"
      );
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [annotatedVideoId, isGeneratingSummary]);

  const handleDismissSummary = useCallback(() => {
    setAnnotationSummary(annotatedVideo?.aiSummary ?? null);
  }, [annotatedVideo?.aiSummary]);

  const handleSaveSummary = useCallback(async () => {
    if (!annotatedVideoId || !annotationSummary?.trim() || isSavingSummary) return;

    setIsSavingSummary(true);
    try {
      await saveAnnotatedVideoSummary({
        annotatedVideoId,
        summary: annotationSummary,
      });
      toast.success("Summary saved");
    } catch (saveError) {
      toast.error(
        saveError instanceof Error ? saveError.message : "Failed to save summary"
      );
    } finally {
      setIsSavingSummary(false);
    }
  }, [
    annotatedVideoId,
    annotationSummary,
    isSavingSummary,
    saveAnnotatedVideoSummary,
  ]);

  const handleDeleteSummary = useCallback(async () => {
    if (!annotatedVideoId || isDeletingSummary) return;

    setIsDeletingSummary(true);
    try {
      await deleteAnnotatedVideoSummary({ annotatedVideoId });
      setAnnotationSummary(null);
      toast.success("Summary deleted");
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete summary"
      );
    } finally {
      setIsDeletingSummary(false);
    }
  }, [annotatedVideoId, deleteAnnotatedVideoSummary, isDeletingSummary]);

  const isSummarySaved =
    annotationSummary !== null &&
    annotationSummary === (annotatedVideo?.aiSummary ?? null);

  return {
    annotatedVideoId,
    annotatedVideo,
    annotations: annotations ?? [],
    savedVideos,
    duration,
    currentTime,
    activeAnnotationId,
    expandedAnnotationId,
    repliesByAnnotationId: repliesCacheByAnnotationId,
    replyTextByAnnotationId,
    editingReplyId,
    isSubmittingReply,
    currentUserSubject: userId ?? null,
    videoRef,
    error,
    loadedUrl,
    loadedVideoLabel,
    isHtml5,
    isYouTube,
    youtubeContainerRef,
    pendingLocalReload: pendingLocalReload && annotatedVideo?.sourceType === "local",
    annotationForm,
    isSubmittingAnnotation,
    blueAllianceOpen,
    blueAllianceStep,
    tbaEvents,
    tbaMatches,
    selectedTbaEvent,
    selectedTbaMatch,
    isLoadingTbaEvents,
    isLoadingTbaMatches,
    eventSearchQuery,
    matchSearchQuery,
    handleSelectAnnotatedVideo,
    canDeleteAnnotatedVideo,
    annotatedVideoPendingDelete,
    isDeletingAnnotatedVideo,
    requestDeleteAnnotatedVideo,
    confirmDeleteAnnotatedVideo,
    cancelDeleteAnnotatedVideo,
    handleLocalFileSelect,
    seekTo,
    handleSubmitAnnotation,
    annotationSummary,
    isGeneratingSummary,
    isSavingSummary,
    isDeletingSummary,
    isSummarySaved,
    handleGenerateSummary,
    handleSaveSummary,
    handleDeleteSummary,
    handleDismissSummary,
    annotationPendingDelete,
    requestDeleteAnnotation,
    confirmDeleteAnnotation,
    cancelDeleteAnnotation,
    handleToggleExpand,
    handleReplyTextChange,
    handleSubmitReply,
    handleEditReply,
    handleDeleteReply,
    setEditingReplyId: () => {
      setEditingReplyId(null);
      setEditingReplyAnnotationId(null);
    },
    openBlueAlliance,
    setBlueAllianceOpen,
    setEventSearchQuery,
    setMatchSearchQuery,
    handleSelectTbaEvent,
    handleSelectTbaMatch,
    handleSelectTbaVideo,
    setBlueAllianceStep,
    setSelectedTbaEvent,
    setSelectedTbaMatch,
  };
}
