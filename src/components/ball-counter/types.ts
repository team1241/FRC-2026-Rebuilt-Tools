export type ShotMark = {
  id: string;
  time: number;
  shotType: ShotType;
};

export type ShotType = "shooting" | "feeding";

export type Cycle = {
  id: string;
  startTime: number;
  endTime: number;
  shotType: ShotType;
  tagColor: string;
};
