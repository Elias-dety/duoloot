import { Event } from '@/schemas/event.schema';

export const mockEvents: Event[] = [
  {
    id: 'e1d1f053-b09e-4e4e-9137-58b688d0130f',
    title: 'Cofre Diamante V',
    description: 'Participe do torneio de final de semana para concorrer a prêmios em DuoCoins. Jogue em duo e acumule pontos de vitória.',
    prizePool: 5000,
    prizeCurrency: 'DuoCoins',
    status: 'active',
    totalParticipants: 1250,
    onlineParticipants: 342,
    startsAt: new Date('2026-05-10T00:00:00Z').toISOString(),
    endsAt: new Date('2026-05-15T23:59:59Z').toISOString(),
  },
  {
    id: '9b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
    title: 'Desafio Radiante',
    description: 'Apenas os melhores. Torneio exclusivo para jogadores com Trust Score acima de 90.',
    prizePool: 10000,
    prizeCurrency: 'Riot Points',
    status: 'scheduled',
    totalParticipants: 450,
    onlineParticipants: 0,
    startsAt: new Date('2026-05-20T18:00:00Z').toISOString(),
    endsAt: new Date('2026-05-22T23:59:59Z').toISOString(),
  }
];
