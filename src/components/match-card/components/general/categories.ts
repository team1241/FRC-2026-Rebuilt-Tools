
export const GENERAL_MATCH_CARD_CATEGORIES: {
  label: string;
  dataKey: string;
  type: "number" | "boolean" | "input";
  showTotal: boolean;
}[] = [
    {
      label: "Matches",
      dataKey: "matches",
      type: "number",
      showTotal: false,
    },
    // Assume auto climb input,
    // Assume teleop climb input
    {
      label: "Average Fuel Scored",
      dataKey: "avgShootingSeconds",
      type: "number",
      showTotal: true,
    },
    {
      label: "Max Fuel Scored",
      dataKey: "maxShootingSeconds",
      type: "number",
      showTotal: true,
    },
    {
      label: "Average Fuel Fed",
      dataKey: "avgFeedingSeconds",
      type: "number",
      showTotal: true,
    },
    {
      label: "Latest BPS",
      dataKey: "latestBPS",
      type: "number",
      showTotal: false,
    },
    {
      label: "Max BPS",
      dataKey: "maxBPS",
      type: "number",
      showTotal: false,
    },
    { label: "Trench", dataKey: "trench", type: "boolean", showTotal: false },
    { label: "Bump", dataKey: "bump", type: "boolean", showTotal: false },
    {
      label: "Feed (Half Field from Neutral)",
      dataKey: "halfFieldFromNeutral",
      type: "boolean",
      showTotal: false,
    },
    {
      label: "Feed (Half Field from Opponent)",
      dataKey: "halfFieldFromOpponent",
      type: "boolean",
      showTotal: false,
    },
    { label: "Feed (Full Field)", dataKey: "fullField", type: "boolean", showTotal: false },
    { label: "L3 Count", dataKey: "L3Climbs", type: "number", showTotal: true },
    { label: "L2 Count", dataKey: "L2Climbs", type: "number", showTotal: true },
    { label: "L1 Count", dataKey: "L1Climbs", type: "number", showTotal: true },
    // Climb L3 with teammate boolean
    // Climb L1 with teammate boolean
  ]
