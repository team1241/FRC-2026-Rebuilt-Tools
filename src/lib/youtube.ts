export const parseYouTubeId = (input: string) => {
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
  } catch {
    return null;
  }
  return null;
};
