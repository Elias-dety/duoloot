import { mockGlobalRaceResults } from '@/data/mocks/globalRaceResults.mock';
import { mockGlobalRaces } from '@/data/mocks/globalRaces.mock';
import { mockGlobalRaceEntries, mockGlobalRaceTeams } from '@/data/mocks/globalRaceTeams.mock';
import type {
  GlobalRace,
  GlobalRaceEntry,
  GlobalRaceRankingEntry,
  GlobalRaceResult,
  GlobalRaceTeam,
  JoinGlobalRacePayload,
  VerifyGlobalRaceResultPayload,
} from '@/types/global-races.types';
import { calculateGlobalRaceRanking } from '@/utils/global-races/calculateGlobalRaceRanking';

const raceEntries: GlobalRaceEntry[] = structuredClone(mockGlobalRaceEntries);
const raceTeams: GlobalRaceTeam[] = structuredClone(mockGlobalRaceTeams);
const raceResults: GlobalRaceResult[] = structuredClone(mockGlobalRaceResults);

const clone = <T>(value: T): T => structuredClone(value);

const createMockId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const findRace = (raceId: string) => mockGlobalRaces.find((race) => race.id === raceId);

const assertJoinableRace = (race: GlobalRace | undefined) => {
  if (!race) {
    throw new Error('Corrida Global nao encontrada.');
  }

  if (race.status !== 'registration_open') {
    throw new Error('Inscricoes disponiveis apenas para Corridas Globais abertas.');
  }

  if (race.registeredTeams >= race.maxTeams) {
    throw new Error('Corrida Global sem vagas disponiveis.');
  }
};

export async function listGlobalRaces(status?: GlobalRace['status']): Promise<GlobalRace[]> {
  const races = status ? mockGlobalRaces.filter((race) => race.status === status) : mockGlobalRaces;

  return clone(races).toSorted((first, second) => new Date(first.startsAt).getTime() - new Date(second.startsAt).getTime());
}

export async function getGlobalRaceById(raceId: string): Promise<GlobalRace | null> {
  const race = findRace(raceId);
  return race ? clone(race) : null;
}

export async function getGlobalRaceTeams(raceId: string): Promise<GlobalRaceTeam[]> {
  return clone(raceTeams.filter((team) => team.raceId === raceId));
}

export async function joinGlobalRace(payload: JoinGlobalRacePayload): Promise<GlobalRaceEntry> {
  const race = findRace(payload.raceId);
  assertJoinableRace(race);

  const existingEntry = raceEntries.find((entry) => entry.raceId === payload.raceId && entry.userId === payload.userId);
  if (existingEntry) {
    throw new Error('Usuario ja inscrito nesta Corrida Global.');
  }

  const now = new Date().toISOString();
  const teamId = createMockId('grt');
  const entryId = createMockId('gre');
  const partnerEntryId = payload.partnerUserId ? createMockId('gre') : undefined;

  const entry: GlobalRaceEntry = {
    id: entryId,
    raceId: payload.raceId,
    userId: payload.userId,
    teamId,
    mode: payload.mode,
    status: payload.partnerUserId ? 'team_ready' : 'waiting_partner',
    partnerUserId: payload.partnerUserId,
    createdAt: now,
    updatedAt: now,
  };

  const team: GlobalRaceTeam = {
    id: teamId,
    raceId: payload.raceId,
    name: payload.partnerUserId ? `Duo ${payload.userNickname}` : `Mercenario ${payload.userNickname}`,
    mode: payload.mode,
    status: payload.partnerUserId ? 'ready' : 'waiting_partner',
    participants: [
      {
        userId: payload.userId,
        nickname: payload.userNickname,
        rank: payload.userRank,
        trustScore: payload.userTrustScore,
        isCaptain: true,
      },
      ...(payload.partnerUserId
        ? [
            {
              userId: payload.partnerUserId,
              nickname: payload.partnerNickname ?? 'Parceiro convidado',
              rank: payload.partnerRank ?? payload.userRank,
              trustScore: payload.partnerTrustScore ?? payload.userTrustScore,
            },
          ]
        : []),
    ],
    entryIds: partnerEntryId ? [entryId, partnerEntryId] : [entryId],
    createdAt: now,
    updatedAt: now,
  };

  raceEntries.push(entry);
  if (payload.partnerUserId && partnerEntryId) {
    raceEntries.push({
      id: partnerEntryId,
      raceId: payload.raceId,
      userId: payload.partnerUserId,
      teamId,
      mode: payload.mode,
      status: 'team_ready',
      partnerUserId: payload.userId,
      createdAt: now,
      updatedAt: now,
    });
  }
  raceTeams.push(team);

  return clone(entry);
}

export async function verifyGlobalRaceResult(payload: VerifyGlobalRaceResultPayload): Promise<GlobalRaceResult> {
  const race = findRace(payload.raceId);
  if (!race) {
    throw new Error('Corrida Global nao encontrada.');
  }

  if (!['in_progress', 'awaiting_validation', 'finished'].includes(race.status)) {
    throw new Error('Verificacao disponivel apenas durante ou apos uma Corrida Global.');
  }

  const team = raceTeams.find((item) => item.id === payload.teamId && item.raceId === payload.raceId);
  if (!team) {
    throw new Error('Dupla nao encontrada nesta Corrida Global.');
  }

  const existingResult = raceResults.find((result) => result.raceId === payload.raceId && result.teamId === payload.teamId);
  if (existingResult) {
    return clone(existingResult);
  }

  const now = new Date().toISOString();
  const result: GlobalRaceResult = {
    id: createMockId('grr'),
    raceId: payload.raceId,
    teamId: payload.teamId,
    status: 'processing',
    missionProgress: 0,
    score: 0,
    verificationRequestedAt: now,
    source: 'mock',
  };

  raceResults.push(result);
  team.status = 'awaiting_validation';
  team.updatedAt = now;

  return clone(result);
}

export async function getGlobalRaceRanking(raceId: string): Promise<GlobalRaceRankingEntry[]> {
  const race = findRace(raceId);
  if (!race) {
    throw new Error('Corrida Global nao encontrada.');
  }

  const teams = raceTeams.filter((team) => team.raceId === raceId);
  const results = raceResults.filter((result) => result.raceId === raceId);

  return clone(calculateGlobalRaceRanking(race, teams, results));
}
