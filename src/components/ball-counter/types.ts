export type ShotMark = {
  id: string;
  time: number;
  shotType: ShotType;
};

export type ShotType = "shooting" | "feeding";

export type Cycle = {
  cycleNumber: number;
  startTimestamp: string;
  endTimestamp: string;
  numberOfBalls: number;
  cycleType: ShotType;
};

export type CycleUi = {
  id: string;
  startTimestamp: number;
  endTimestamp: number;
  numberOfBalls: number;
  shotType: ShotType;
  tagColor: string;
};
