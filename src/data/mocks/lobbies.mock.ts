import { Lobby } from '@/schemas/lobby.schema';

export const mockLobbies: Lobby[] = [
  {
    id: 'c878d462-8929-4e56-b097-71b3e8281358',
    owner: {
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
    },
    slotsTotal: 5,
    slotsFilled: 3, // vagas = 2
    mode: 'Competitivo',
    queue: 'Ranqueada',
    minRank: 'Imortal 1',
    maxRank: 'Radiante',
    compatibilityScore: 92,
    status: 'open',
    metadata: {
      premiumOnly: true,
      voiceChannel: 'https://discord.gg/duoloot-mock',
    },
    createdAt: new Date('2026-05-12T20:15:00Z').toISOString(),
  },
  {
    id: '8a1c3132-723a-4464-9a00-1c888d3e8e25',
    owner: {
      id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
      name: 'Sacy',
      avatarUrl: 'https://ui-avatars.com/api/?name=Sacy&background=random',
      trustScore: 85,
      status: 'in-game',
      gameProfile: {
        rank: 'Imortal 3',
        mainRole: 'Iniciador',
      },
    },
    slotsTotal: 2,
    slotsFilled: 2, // vagas = 0
    mode: 'Duo Queue',
    queue: 'Ranqueada',
    minRank: 'Ascendente 3',
    maxRank: 'Imortal 3',
    compatibilityScore: 78,
    status: 'full',
    createdAt: new Date('2026-05-12T18:45:00Z').toISOString(),
  },
  {
    id: '1e220a2e-5034-406a-a1c2-3e2b3c4d5e6f',
    owner: {
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
    },
    slotsTotal: 5,
    slotsFilled: 1, // vagas = 4
    mode: 'Sem Classificação',
    queue: 'Casual',
    minRank: 'Ferro 1',
    maxRank: 'Radiante',
    status: 'closed',
    createdAt: new Date('2026-05-11T12:00:00Z').toISOString(),
  }
];
