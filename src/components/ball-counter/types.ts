export type ShotMark = {
  id: string;
  time: number;
  shotType: ShotType;
};

export type ShotType = "shooting" | "feeding";

export type Cycle = {
  cycleNumber: number;
  startTimestamp: number;
  endTimestamp: number;
  numberOfBalls: number;
  bps: number;
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
