import type { GlobalRace, GlobalRaceRankingEntry, GlobalRaceResult, GlobalRaceTeam } from '@/types/global-races.types';

const getRewardForPosition = (race: GlobalRace | undefined, position: number) =>
  race?.rewards.find((reward) => position >= reward.positionFrom && position <= reward.positionTo);

const getResultWeight = (result: GlobalRaceResult) => {
  if (result.status === 'completed') return 0;
  if (result.status === 'processing') return 1;
  if (result.status === 'pending') return 2;
  if (result.status === 'disputed') return 3;
  return 4;
};

const compareOptionalDates = (first?: string, second?: string) => {
  if (!first && !second) return 0;
  if (!first) return 1;
  if (!second) return -1;
  return new Date(first).getTime() - new Date(second).getTime();
};

export function calculateGlobalRaceRanking(
  race: GlobalRace | undefined,
  teams: GlobalRaceTeam[],
  results: GlobalRaceResult[]
): GlobalRaceRankingEntry[] {
  const teamsById = new Map(teams.map((team) => [team.id, team]));

  const orderedResults = results
    .filter((result) => !race || result.raceId === race.id)
    .filter((result) => teamsById.has(result.teamId))
    .toSorted((first, second) => {
      const statusDiff = getResultWeight(first) - getResultWeight(second);
      if (statusDiff !== 0) return statusDiff;

      const completionDiff = (first.completionSeconds ?? Number.MAX_SAFE_INTEGER) - (second.completionSeconds ?? Number.MAX_SAFE_INTEGER);
      if (completionDiff !== 0) return completionDiff;

      const completedAtDiff = compareOptionalDates(first.completedAt, second.completedAt);
      if (completedAtDiff !== 0) return completedAtDiff;

      const scoreDiff = second.score - first.score;
      if (scoreDiff !== 0) return scoreDiff;

      return new Date(first.verificationRequestedAt).getTime() - new Date(second.verificationRequestedAt).getTime();
    });

  return orderedResults.map((result, index) => {
    const position = index + 1;
    const team = teamsById.get(result.teamId);

    return {
      raceId: result.raceId,
      teamId: result.teamId,
      teamName: team?.name ?? 'Dupla desconhecida',
      position,
      status: result.status,
      score: result.score,
      missionProgress: result.missionProgress,
      completionSeconds: result.completionSeconds,
      verifiedAt: result.verificationRequestedAt,
      completedAt: result.completedAt,
      participants: team?.participants ?? [],
      reward: getRewardForPosition(race, position),
    };
  });
}
