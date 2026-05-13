import { Review } from '@/schemas/review.schema';

export const mockReviews: Review[] = [
  {
    id: '3dfe2348-2dbe-4c53-9176-7be045412111',
    authorNickname: 'DuoRush',
    targetType: 'coach',
    targetId: '33333333-3333-3333-3333-333333333333',
    rating: 5,
    sentiment: 'positive',
    comment: 'Sessao objetiva, corrige erro de entrada e passa rotina pratica.',
    createdAt: new Date('2026-05-05T18:20:00Z').toISOString(),
  },
  {
    id: '43dd6bf1-4f35-47d7-924d-7e7ee8100001',
    authorNickname: 'TrustMain',
    targetType: 'player',
    targetId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    rating: 5,
    sentiment: 'positive',
    comment: 'Comunicacao limpa e zero abandono nas partidas.',
    createdAt: new Date('2026-05-09T21:00:00Z').toISOString(),
  },
];
