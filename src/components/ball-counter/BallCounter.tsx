"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Hero from "@/components/Hero";
import StatsPanel from "@/components/ball-counter/components/StatsPanel";
import VideoPanel from "@/components/ball-counter/components/VideoPanel";
import { DEFAULT_FPS } from "@/constants";
import type {
  Cycle,
  ShotMark,
  ShotType,
} from "@/components/ball-counter/types";
import { parseYouTubeId } from "@/lib/youtube";

type SourceType = "html5" | "youtube" | null;

type YouTubePlayer = {
  destroy: () => void;
  loadVideoById: (videoId: string) => void;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
};

type YouTubePlayerConstructor = new (
  element: HTMLElement,
  options: {
    videoId: string;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: () => void;
    };
  },
) => YouTubePlayer;

declare global {
  interface Window {
    YT?: {
      Player: YouTubePlayerConstructor;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function BallCounterApp() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const youtubeContainerRef = useRef<HTMLDivElement | null>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);

  const [videoUrl, setVideoUrl] = useState("");
  const [loadedUrl, setLoadedUrl] = useState("");
  const [sourceType, setSourceType] = useState<SourceType>(null);
  const [youtubeId, setYouTubeId] = useState<string | null>(null);
  const [marks, setMarks] = useState<ShotMark[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleStart, setActiveCycleStart] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [shotType, setShotType] = useState<ShotType>("shooting");

  const cycleTagColors = useMemo(
    () => [
      "border-sky-200 bg-sky-100 text-sky-700",
      "border-emerald-200 bg-emerald-100 text-emerald-700",
      "border-amber-200 bg-amber-100 text-amber-700",
      "border-rose-200 bg-rose-100 text-rose-700",
      "border-violet-200 bg-violet-100 text-violet-700",
      "border-teal-200 bg-teal-100 text-teal-700",
    ],
    [],
  );

  const pickCycleTagColor = useCallback(
    (usedColors: string[]) => {
      const available = cycleTagColors.filter(
        (color) => !usedColors.includes(color),
      );
      const palette = available.length ? available : cycleTagColors;
      return palette[Math.floor(Math.random() * palette.length)];
    },
    [cycleTagColors],
  );

  const averageBps = useMemo(() => {
    if (!cycles.length) return 0;
    const { totalDuration, totalMarks } = cycles.reduce(
      (acc, cycle) => {
        const duration = Math.max(0, cycle.endTime - cycle.startTime);
        if (duration <= 0) return acc;
        const markCount = marks.filter(
          (mark) => mark.time >= cycle.startTime && mark.time <= cycle.endTime,
        ).length;
        acc.totalDuration += duration;
        acc.totalMarks += markCount;
        return acc;
      },
      { totalDuration: 0, totalMarks: 0 },
    );
    if (!totalDuration) return 0;
    return totalMarks / totalDuration;
  }, [cycles, marks]);

  const isYouTube = sourceType === "youtube";
  const isHtml5 = sourceType === "html5";

  const isMarkShotKey = (event: KeyboardEvent | ReactKeyboardEvent) =>
    event.key?.toLowerCase() === "b" || event.code === "KeyB";

  const getCurrentTime = useCallback(() => {
    if (isYouTube && youtubePlayerRef.current) {
      return youtubePlayerRef.current.getCurrentTime();
    }
    if (isHtml5 && videoRef.current) {
      return videoRef.current.currentTime;
    }
    return null;
  }, [isHtml5, isYouTube]);

  useEffect(() => {
    if (!isYouTube || !youtubeId) return;
    let cancelled = false;

    const loadPlayer = () => {
      if (!youtubeContainerRef.current) return;
      const Player = window.YT?.Player;
      if (!Player) return;
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.loadVideoById(youtubeId);
        return;
      }

      youtubePlayerRef.current = new Player(youtubeContainerRef.current, {
        videoId: youtubeId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            if (cancelled || !youtubePlayerRef.current) return;
          },
        },
      });
    };

    const ensureYouTubeApi = () => {
      if (window.YT?.Player) {
        loadPlayer();
        return;
      }
      if (document.getElementById("youtube-iframe-api")) {
        const poll = window.setInterval(() => {
          if (window.YT?.Player) {
            window.clearInterval(poll);
            loadPlayer();
          }
        }, 100);
        return;
      }
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = () => {
        if (!cancelled) {
          loadPlayer();
        }
      };
    };

    ensureYouTubeApi();

    return () => {
      cancelled = true;
    };
  }, [isYouTube, youtubeId]);

  useEffect(() => {
    if (isYouTube) return;
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.destroy();
      youtubePlayerRef.current = null;
    }
  }, [isYouTube]);

  const handleLoad = () => {
    const trimmed = videoUrl.trim();
    if (!trimmed) {
      setError("Add a YouTube URL to load.");
      return;
    }
    const youTubeId = parseYouTubeId(trimmed);
    if (youTubeId) {
      setError("");
      setSourceType("youtube");
      setYouTubeId(youTubeId);
      setLoadedUrl("");
      setMarks([]);
      setCycles([]);
      setActiveCycleStart(null);
      return;
    }
    setError("Only YouTube links are supported.");
  };

  const stepFrame = (direction: number) => {
    if (isHtml5) {
      const video = videoRef.current;
      if (!video) return;
      const step = 1 / Math.max(1, DEFAULT_FPS);
      video.currentTime = Math.max(0, video.currentTime + step * direction);
      return;
    }
    if (isYouTube && youtubePlayerRef.current) {
      const current = youtubePlayerRef.current.getCurrentTime();
      const step = 1 / DEFAULT_FPS;
      youtubePlayerRef.current.seekTo(
        Math.max(0, current + step * direction),
        true,
      );
    }
  };

  const jumpSeconds = (delta: number) => {
    if (isYouTube && youtubePlayerRef.current) {
      const current = youtubePlayerRef.current.getCurrentTime();
      youtubePlayerRef.current.seekTo(Math.max(0, current + delta), true);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime + delta);
  };

  const markShot = useCallback(() => {
    if (isYouTube && youtubePlayerRef.current) {
      setMarks((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          time: youtubePlayerRef.current.getCurrentTime(),
          shotType,
        },
      ]);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    setMarks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), time: video.currentTime, shotType },
    ]);
  }, [isYouTube, shotType]);

  const undoLastMark = () => {
    setMarks((prev) => prev.slice(0, -1));
  };

  const startCycle = useCallback(() => {
    if (activeCycleStart !== null) return;
    const now = getCurrentTime();
    if (now === null) return;
    setActiveCycleStart(now);
  }, [activeCycleStart, getCurrentTime]);

  const endCycle = useCallback(() => {
    if (activeCycleStart === null) return;
    const now = getCurrentTime();
    if (now === null) return;
    const endTime = Math.max(now, activeCycleStart);
    setCycles((prev) => {
      const tagColor = pickCycleTagColor(prev.map((cycle) => cycle.tagColor));
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          startTime: activeCycleStart,
          endTime,
          shotType,
          tagColor,
        },
      ];
    });
    setActiveCycleStart(null);
  }, [activeCycleStart, getCurrentTime, pickCycleTagColor, shotType]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key?.toLowerCase() === "u" || event.code === "KeyU") {
        undoLastMark();
        return;
      }
      if (event.key?.toLowerCase() === "q" || event.code === "KeyQ") {
        startCycle();
        return;
      }
      if (event.key?.toLowerCase() === "e" || event.code === "KeyE") {
        endCycle();
        return;
      }
      if (event.key?.toLowerCase() === "s" || event.code === "KeyS") {
        setShotType("shooting");
        return;
      }
      if (event.key?.toLowerCase() === "f" || event.code === "KeyF") {
        setShotType("feeding");
        return;
      }
      if (isMarkShotKey(event)) {
        const active = document.activeElement;
        const wasVideoFocused = active === videoRef.current;
        markShot();
        if (wasVideoFocused && videoRef.current) {
          videoRef.current.focus();
        }
        return;
      }
      const canJump = isHtml5 || isYouTube;
      if (!canJump) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        jumpSeconds(5);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        jumpSeconds(-5);
        return;
      }
      if (event.key === ".") {
        event.preventDefault();
        stepFrame(1);
        return;
      }
      if (event.key === ",") {
        event.preventDefault();
        stepFrame(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [endCycle, isHtml5, isYouTube, markShot, startCycle]);

  const handleVideoKeyDown = (event: ReactKeyboardEvent<HTMLVideoElement>) => {
    if (!isHtml5) return;
    if (event.key === " ") {
      event.preventDefault();
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
        void video.play();
      } else {
        video.pause();
      }
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      jumpSeconds(5);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      jumpSeconds(-5);
      return;
    }
    if (event.key === ".") {
      event.preventDefault();
      stepFrame(1);
      return;
    }
    if (event.key === ",") {
      event.preventDefault();
      stepFrame(-1);
      return;
    }
    if (event.key?.toLowerCase() === "u" || event.code === "KeyU") {
      event.preventDefault();
      undoLastMark();
      return;
    }
    if (event.key?.toLowerCase() === "q" || event.code === "KeyQ") {
      event.preventDefault();
      startCycle();
      return;
    }
    if (event.key?.toLowerCase() === "e" || event.code === "KeyE") {
      event.preventDefault();
      endCycle();
      return;
    }
    if (event.key?.toLowerCase() === "s" || event.code === "KeyS") {
      event.preventDefault();
      setShotType("shooting");
      return;
    }
    if (event.key?.toLowerCase() === "f" || event.code === "KeyF") {
      event.preventDefault();
      setShotType("feeding");
      return;
    }
    if (isMarkShotKey(event)) {
      event.preventDefault();
      markShot();
    }
  };

  const handleVideoUrlChange = (value: string) => {
    setVideoUrl(value);
    setError("");
  };

  const handleClearMarks = () => {
    setMarks([]);
    setCycles([]);
    setActiveCycleStart(null);
  };

  const removeMark = (id: string) => {
    setMarks((prev) => prev.filter((mark) => mark.id !== id));
  };

  const removeCycle = (id: string) => {
    setCycles((prev) => {
      const cycleIndex = prev.findIndex((cycle) => cycle.id === id);
      if (cycleIndex === -1) return prev;
      const cycle = prev[cycleIndex];
      setMarks((marksPrev) =>
        marksPrev.filter(
          (mark) => mark.time < cycle.startTime || mark.time > cycle.endTime,
        ),
      );
      return prev.filter((cycleItem) => cycleItem.id !== id);
    });
  };

  return (
    <div className="min-h-screen px-4 pb-12 pt-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <Hero />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <VideoPanel
            isHtml5={isHtml5}
            isYouTube={isYouTube}
            videoUrl={videoUrl}
            onVideoUrlChange={handleVideoUrlChange}
            onLoad={handleLoad}
            error={error}
            loadedUrl={loadedUrl}
            onVideoKeyDown={handleVideoKeyDown}
            videoRef={videoRef}
            youtubeContainerRef={youtubeContainerRef}
          />
          <StatsPanel
            marks={marks}
            averageBps={averageBps}
            cycles={cycles}
            activeCycleStart={activeCycleStart}
            videoUrl={videoUrl}
            shotType={shotType}
            onShotTypeChange={setShotType}
            onClearMarks={handleClearMarks}
            onRemoveMark={removeMark}
            onStartCycle={startCycle}
            onEndCycle={endCycle}
            onRemoveCycle={removeCycle}
          />
        </div>
      </div>
    </div>
  );
}
