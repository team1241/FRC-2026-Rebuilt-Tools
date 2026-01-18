import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Hero from "./components/Hero";
import StatsPanel from "./components/ball-counter/StatsPanel";
import VideoPanel from "./components/ball-counter/VideoPanel";
import { PLAYBACK_RATES, DEFAULT_FPS } from "./constants";

export type ShotMark = {
  id: string;
  time: number;
};

export type Cycle = {
  id: string;
  startTime: number;
  endTime: number;
};

type FrameCallbackHandle = number | null;
type FrameCallback = (
  time: number,
  metadata: VideoFrameCallbackMetadata,
) => void;
type SourceType = "html5" | "youtube" | null;

type YouTubePlayer = {
  destroy: () => void;
  loadVideoById: (videoId: string) => void;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getAvailablePlaybackRates: () => number[];
  setPlaybackRate: (rate: number) => void;
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

export const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "--:--.--";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 100);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0",
  )}.${String(millis).padStart(2, "0")}`;
};

const parseYouTubeId = (input: string) => {
  try {
    const url = new URL(input);
    const host = url.hostname.replace("www.", "");
    if (host === "youtu.be") {
      return url.pathname.slice(1) || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.replace("/embed/", "");
      }
      if (url.pathname.startsWith("/shorts/")) {
        return url.pathname.replace("/shorts/", "");
      }
    }
  } catch (err) {
    return null;
  }
  return null;
};

export default function App() {
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
  const [playbackRate, setPlaybackRate] = useState(1);
  const [youtubeRates, setYouTubeRates] = useState<number[]>(PLAYBACK_RATES);

  const averageBps = useMemo(() => {
    if (!cycles.length) return 0;
    const totals = cycles.map((cycle) => {
      const duration = cycle.endTime - cycle.startTime;
      if (duration <= 0) return 0;
      const markCount = marks.filter(
        (mark) => mark.time >= cycle.startTime && mark.time <= cycle.endTime,
      ).length;
      return markCount / duration;
    });
    const sum = totals.reduce((acc, value) => acc + value, 0);
    return sum / totals.length;
  }, [cycles, marks]);

  const isYouTube = sourceType === "youtube";
  const isHtml5 = sourceType === "html5";
  const speedOptions = isYouTube ? youtubeRates : PLAYBACK_RATES;

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
            const rates = youtubePlayerRef.current.getAvailablePlaybackRates();
            if (rates?.length) {
              setYouTubeRates(rates);
            }
            youtubePlayerRef.current.setPlaybackRate(playbackRate);
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
  }, [isYouTube, youtubeId, playbackRate]);

  useEffect(() => {
    if (isYouTube) return;
    if (youtubePlayerRef.current) {
      youtubePlayerRef.current.destroy();
      youtubePlayerRef.current = null;
    }
  }, [isYouTube]);

  useEffect(() => {
    if (isHtml5 && videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [isHtml5, playbackRate, loadedUrl]);

  useEffect(() => {
    if (isYouTube && youtubePlayerRef.current) {
      youtubePlayerRef.current.setPlaybackRate(playbackRate);
    }
  }, [isYouTube, playbackRate]);

  useEffect(() => {
    if (!isYouTube) return;
    if (youtubeRates.length && !youtubeRates.includes(playbackRate)) {
      setPlaybackRate(youtubeRates[0]);
    }
  }, [isYouTube, youtubeRates, playbackRate]);

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
      setPlaybackRate(1);
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
        },
      ]);
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    setMarks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), time: video.currentTime },
    ]);
  }, [isYouTube]);

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
    setCycles((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        startTime: activeCycleStart,
        endTime,
      },
    ]);
    setActiveCycleStart(null);
  }, [activeCycleStart, getCurrentTime]);

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
      if (event.key === ",") {
        event.preventDefault();
        stepFrame(-1);
        return;
      }
      if (event.key === ".") {
        event.preventDefault();
        stepFrame(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [
    endCycle,
    isHtml5,
    isYouTube,
    jumpSeconds,
    markShot,
    startCycle,
    stepFrame,
    undoLastMark,
  ]);

  const handleVideoKeyDown = (event: ReactKeyboardEvent<HTMLVideoElement>) => {
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
    if (isMarkShotKey(event)) {
      markShot();
      return;
    }
    if (!isHtml5) return;
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
    if (event.key === ",") {
      event.preventDefault();
      stepFrame(-1);
      return;
    }
    if (event.key === ".") {
      event.preventDefault();
      stepFrame(1);
    }
  };

  const removeMark = (id: string) => {
    setMarks((prev) => prev.filter((mark) => mark.id !== id));
  };

  const removeCycle = (id: string) => {
    setCycles((prev) => {
      const target = prev.find((cycle) => cycle.id === id);
      if (target) {
        setMarks((prevMarks) =>
          prevMarks.filter(
            (mark) =>
              mark.time < target.startTime || mark.time > target.endTime,
          ),
        );
      }
      return prev.filter((cycle) => cycle.id !== id);
    });
  };

  const clearMarks = () => {
    setMarks([]);
    setCycles([]);
    setActiveCycleStart(null);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-6 py-12">
        <Hero />
        <main className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <VideoPanel
            isHtml5={isHtml5}
            isYouTube={isYouTube}
            videoUrl={videoUrl}
            onVideoUrlChange={setVideoUrl}
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
            onClearMarks={clearMarks}
            onRemoveMark={removeMark}
            onStartCycle={startCycle}
            onEndCycle={endCycle}
            onRemoveCycle={removeCycle}
          />
        </main>
      </div>
    </div>
  );
}
