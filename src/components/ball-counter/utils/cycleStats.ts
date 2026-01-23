import type {
  CycleUi,
  ShotMark,
} from "@/components/ball-counter/types";

export const calculateAverageBps = (cycles: CycleUi[], marks: ShotMark[]) => {
  if (!cycles.length) return 0;
  const { totalDuration, totalMarks } = cycles.reduce(
    (acc, cycle) => {
      const duration = Math.max(0, cycle.endTimestamp - cycle.startTimestamp);
      if (duration <= 0) return acc;
      const markCount = marks.filter(
        (mark) => mark.time >= cycle.startTimestamp && mark.time <= cycle.endTimestamp,
      ).length;
      acc.totalDuration += duration;
      acc.totalMarks += markCount;
      return acc;
    },
    { totalDuration: 0, totalMarks: 0 },
  );
  if (!totalDuration) return 0;
  return totalMarks / totalDuration;
};
