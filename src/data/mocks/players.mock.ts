import { Player } from '@/schemas/player.schema';

export const mockPlayers: Player[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'FalleN',
    avatarUrl: 'https://ui-avatars.com/api/?name=FalleN&background=random',
    trustScore: 98,
    status: 'online',
    gameProfile: {
      rank: 'Radiante',
      mainRole: 'Duelista',
      secondaryRole: 'Iniciador',
    },
    stats: {
      matchesPlayed: 1250,
      winRate: 65.5,
    },
    preferences: {
      micRequired: true,
      playStyle: 'Agressivo',
    },
    isPremium: true,
    metadata: {
      team: 'LOUD',
    },
    createdAt: new Date('2025-01-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-05-12T15:30:00Z').toISOString(),
  },
  {
    id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    name: 'Sacy',
    avatarUrl: 'https://ui-avatars.com/api/?name=Sacy&background=random',
    trustScore: 85,
    status: 'in-game',
    gameProfile: {
      rank: 'Imortal 3',
      mainRole: 'Iniciador',
    },
    stats: {
      matchesPlayed: 980,
      winRate: 58.2,
    },
    preferences: {
      micRequired: true,
      playStyle: 'Tático',
    },
    isPremium: false,
    createdAt: new Date('2025-02-15T14:20:00Z').toISOString(),
    updatedAt: new Date('2026-05-10T11:45:00Z').toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Aspas',
    avatarUrl: 'https://ui-avatars.com/api/?name=Aspas&background=random',
    trustScore: 72,
    status: 'offline',
    gameProfile: {
      rank: 'Imortal 1',
      mainRole: 'Duelista',
      secondaryRole: 'Controlador',
    },
    stats: {
      matchesPlayed: 450,
      winRate: 52.1,
    },
    preferences: {
      micRequired: false,
      playStyle: 'Flex',
    },
    isPremium: false,
    createdAt: new Date('2025-08-20T09:10:00Z').toISOString(),
    updatedAt: new Date('2026-04-28T18:22:00Z').toISOString(),
  }
];
