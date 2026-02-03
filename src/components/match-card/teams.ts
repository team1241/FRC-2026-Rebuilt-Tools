export type AllianceTeam = {
  number: number;
  name: string;
};

const TEAM_POOL = [
  33, 67, 118, 125, 148, 167, 171, 195, 217, 233, 254, 359, 441, 469, 494, 610,
  716, 971, 1258, 1318, 1477, 1678, 2056, 2337, 2468, 2549, 2992, 3476, 3847,
  4911, 5436, 6328, 6940, 7056, 8708,
];

function hashSeed(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 2147483647;
  }
  return hash;
}

export function generateAllianceTeams(
  eventId: string,
  matchNumber: number,
  alliance: "red" | "blue",
) {
  const seed = hashSeed(`${eventId}-${matchNumber}-${alliance}`) || 1;
  const used = new Set<number>();
  const teams: AllianceTeam[] = [];
  let cursor = seed;

  while (teams.length < 3) {
    cursor = (cursor * 48271) % 2147483647;
    const index = cursor % TEAM_POOL.length;
    const teamNumber = TEAM_POOL[index];
    if (used.has(teamNumber)) continue;
    used.add(teamNumber);
    teams.push({
      number: teamNumber,
      name: `Team ${teamNumber}`,
    });
  }

  return teams;
}