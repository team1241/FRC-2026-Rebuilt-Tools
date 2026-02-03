
export const GENERAL_MATCH_CARD_CATEGORIES: { label: string, dataKey: string, type: 'number' | 'boolean' | 'input' }[] = [
  {
    label: "Matches",
    dataKey: "matches",
    type: "number"
  },
  // Assume auto climb input,
  // Assume teleop climb input
  {
    label: "Average Fuel Scored",
    dataKey: "avgShootingSeconds",
    type: "number"
  },
  {
    label: "Max Fuel Scored",
    dataKey: "maxShootingSeconds",
    type: "number"
  },
  {
    label: "Average Fuel Fed",
    dataKey: "avgFeedingSeconds",
    type: "number"
  },
  {
    label: "Latest BPS",
    dataKey: "latestBPS",
    type: "number"
  },
  {
    label: "Max BPS",
    dataKey: "maxBPS",
    type: "number"
  },
  { label: "Trench", dataKey: "trench", type: "boolean" },
  { label: "Bump", dataKey: "bump", type: "boolean" },
  { label: "Feed (Half Field from Neutral)", dataKey: "halfFieldFromNeutral", type: "boolean" },
  { label: "Feed (Half Field from Opponent)", dataKey: "halfFieldFromOpponent", type: "boolean" },
  { label: "Feed (Full Field)", dataKey: "fullField", type: "boolean" },
  { label: "L3 Count", dataKey: "L3Climbs", type: "number" },
  { label: "L2 Count", dataKey: "L2Climbs", type: "number" },
  { label: "L1 Count", dataKey: "L1Climbs", type: "number" },
  // Climb L3 with teammate boolean
  // Climb L1 with teammate boolean
]