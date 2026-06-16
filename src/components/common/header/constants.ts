export const APP_LINKS = [
  {
    label: "Picklist",
    href: "/picklist",
    description: "Build ranked team lists and manage pick order for alliance selection.",
  },
  {
    label: "Alliance Selection",
    href: "/alliance-selection",
    description: "Track picks, availability, and strategy during elimination alliances.",
  },
  {
    label: "Match Annotator",
    href: "/match-annotator",
    description: "Review match video and add timestamped annotations with your team.",
  },
] as const;

export const NAV_LINKS = APP_LINKS.map(({ label, href }) => ({ label, href }));
