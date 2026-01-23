import { useState } from "react";
import type {
  ShotMark,
  ShotType,
} from "@/components/ball-counter/types";
import useCycleTracking from "@/components/ball-counter/hooks/useCycleTracking";

type UseShotTrackingOptions = {
  getCurrentTime: () => number | null;
  pickCycleTagColor: (usedColors: string[]) => string;
};

export default function useShotTracking({
  getCurrentTime,
  pickCycleTagColor,
}: UseShotTrackingOptions) {
  const [marks, setMarks] = useState<ShotMark[]>([]);
  const { cycles, setCycles, activeCycleStart, setActiveCycleStart } =
    useCycleTracking();
  const [shotType, setShotType] = useState<ShotType>("shooting");

  const markShot = () => {
    const time = getCurrentTime();
    if (time === null) return;
    setMarks((prev) => {
      setCycles((cyclesPrev) =>
        cyclesPrev.map((cycle) => {
          if (time >= cycle.startTimestamp && time <= cycle.endTimestamp) {
            return {
              ...cycle,
              numberOfBalls: cycle.numberOfBalls + 1,
            };
          }
          return cycle;
        }),
      );
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          time,
          shotType,
        },
      ];
    });
  };

  const undoLastMark = () => {
    setMarks((prev) => {
      const lastMark = prev[prev.length - 1];
      if (!lastMark) return prev;
      setCycles((cyclesPrev) =>
        cyclesPrev.map((cycle) => {
          if (
            lastMark.time >= cycle.startTimestamp &&
            lastMark.time <= cycle.endTimestamp
          ) {
            return {
              ...cycle,
              numberOfBalls: Math.max(0, cycle.numberOfBalls - 1),
            };
          }
          return cycle;
        }),
      );
      return prev.slice(0, -1);
    });
  };

  const startCycle = () => {
    if (activeCycleStart !== null) return;
    const now = getCurrentTime();
    if (now === null) return;
    setActiveCycleStart(now);
  };

  const endCycle = () => {
    if (activeCycleStart === null) return;
    const now = getCurrentTime();
    if (now === null) return;
    const endTime = Math.max(now, activeCycleStart);
    const numberOfBalls = marks.filter(
      (mark) => mark.time >= activeCycleStart && mark.time <= endTime,
    ).length;
    setCycles((prev) => {
      const tagColor = pickCycleTagColor(prev.map((cycle) => cycle.tagColor));
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          startTimestamp: activeCycleStart,
          endTimestamp: endTime,
          numberOfBalls,
          shotType,
          tagColor,
        },
      ];
    });
    setActiveCycleStart(null);
  };

  const clearAll = () => {
    setMarks([]);
    setCycles([]);
    setActiveCycleStart(null);
  };

  const removeMark = (id: string) => {
    setMarks((prev) => {
      const markToRemove = prev.find((mark) => mark.id === id);
      if (!markToRemove) return prev;
      setCycles((cyclesPrev) =>
        cyclesPrev.map((cycle) => {
          if (
            markToRemove.time >= cycle.startTimestamp &&
            markToRemove.time <= cycle.endTimestamp
          ) {
            return {
              ...cycle,
              numberOfBalls: Math.max(0, cycle.numberOfBalls - 1),
            };
          }
          return cycle;
        }),
      );
      return prev.filter((mark) => mark.id !== id);
    });
  };

  const removeCycle = (id: string) => {
    setCycles((prev) => {
      const cycleIndex = prev.findIndex((cycle) => cycle.id === id);
      if (cycleIndex === -1) return prev;
      const cycle = prev[cycleIndex];
      setMarks((marksPrev) =>
        marksPrev.filter(
          (mark) =>
            mark.time < cycle.startTimestamp || mark.time > cycle.endTimestamp,
        ),
      );
      return prev.filter((cycleItem) => cycleItem.id !== id);
    });
  };

  return {
    activeCycleStart,
    clearAll,
    cycles,
    endCycle,
    markShot,
    marks,
    removeCycle,
    removeMark,
    setShotType,
    shotType,
    startCycle,
    undoLastMark,
  };
}
