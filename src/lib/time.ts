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
