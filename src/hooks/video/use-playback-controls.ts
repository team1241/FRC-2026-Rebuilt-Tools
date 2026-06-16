import type { RefObject } from "react";
import { DEFAULT_FPS } from "@/hooks/video/constants";
import {
  getReadyYouTubePlayer,
  type YouTubePlayer,
} from "@/hooks/video/use-youtube-player";

type UsePlaybackControlsOptions = {
  isHtml5: boolean;
  isYouTube: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  youtubePlayerRef: RefObject<YouTubePlayer | null>;
};

export default function usePlaybackControls({
  isHtml5,
  isYouTube,
  videoRef,
  youtubePlayerRef,
}: UsePlaybackControlsOptions) {
  const getCurrentTime = () => {
    const youtubePlayer = getReadyYouTubePlayer(youtubePlayerRef.current);
    if (isYouTube && youtubePlayer) {
      return youtubePlayer.getCurrentTime();
    }
    if (isHtml5 && videoRef.current) {
      return videoRef.current.currentTime;
    }
    return null;
  };

  const getDuration = () => {
    const youtubePlayer = getReadyYouTubePlayer(youtubePlayerRef.current);
    if (isYouTube && youtubePlayer) {
      const duration = youtubePlayer.getDuration();
      return Number.isFinite(duration) && duration > 0 ? duration : null;
    }
    if (isHtml5 && videoRef.current) {
      const duration = videoRef.current.duration;
      return Number.isFinite(duration) && duration > 0 ? duration : null;
    }
    return null;
  };

  const seekTo = (seconds: number) => {
    const target = Math.max(0, seconds);
    const youtubePlayer = getReadyYouTubePlayer(youtubePlayerRef.current);
    if (isYouTube && youtubePlayer) {
      youtubePlayer.seekTo(target, true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = target;
  };

  const stepFrame = (direction: number) => {
    if (isHtml5) {
      const video = videoRef.current;
      if (!video) return;
      const step = 1 / Math.max(1, DEFAULT_FPS);
      video.currentTime = Math.max(0, video.currentTime + step * direction);
      return;
    }
    const youtubePlayer = getReadyYouTubePlayer(youtubePlayerRef.current);
    if (isYouTube && youtubePlayer) {
      const current = youtubePlayer.getCurrentTime();
      const step = 1 / DEFAULT_FPS;
      youtubePlayer.pauseVideo();
      youtubePlayer.seekTo(
        Math.max(0, current + step * direction),
        true
      );
    }
  };

  const jumpSeconds = (delta: number) => {
    const youtubePlayer = getReadyYouTubePlayer(youtubePlayerRef.current);
    if (isYouTube && youtubePlayer) {
      const current = youtubePlayer.getCurrentTime();
      youtubePlayer.seekTo(Math.max(0, current + delta), true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime + delta);
  };

  return { getCurrentTime, getDuration, seekTo, jumpSeconds, stepFrame };
}
