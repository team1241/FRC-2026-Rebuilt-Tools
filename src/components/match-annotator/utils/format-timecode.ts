export function formatTimecode(seconds: number) {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function formatTimecodeRange(
  startTimeSeconds: number,
  endTimeSeconds?: number
) {
  if (endTimeSeconds === undefined) {
    return formatTimecode(startTimeSeconds);
  }
  return `${formatTimecode(startTimeSeconds)} – ${formatTimecode(endTimeSeconds)}`;
}
