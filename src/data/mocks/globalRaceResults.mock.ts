import type { GlobalRaceResult } from '@/types/global-races.types';

export const mockGlobalRaceResults: GlobalRaceResult[] = [
  {
    id: 'grr-001',
    raceId: 'gr-002-live-headshots',
    teamId: 'grt-001',
    status: 'processing',
    missionProgress: 72,
    score: 22,
    verificationRequestedAt: new Date('2026-05-23T22:07:00Z').toISOString(),
    source: 'mock',
  },
  {
    id: 'grr-002',
    raceId: 'gr-002-live-headshots',
    teamId: 'grt-002',
    status: 'completed',
    missionProgress: 100,
    score: 30,
    completionSeconds: 1840,
    verificationRequestedAt: new Date('2026-05-23T22:02:00Z').toISOString(),
    completedAt: new Date('2026-05-23T22:00:40Z').toISOString(),
    source: 'mock',
  },
  {
    id: 'grr-003',
    raceId: 'gr-004-finished-mvp',
    teamId: 'grt-003',
    status: 'completed',
    missionProgress: 100,
    score: 1,
    completionSeconds: 1920,
    verificationRequestedAt: new Date('2026-05-22T20:32:00Z').toISOString(),
    completedAt: new Date('2026-05-22T20:31:45Z').toISOString(),
    source: 'mock',
  },
];
