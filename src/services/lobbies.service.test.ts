import { describe, it, expect, vi } from 'vitest';

// Mock Supabase para evitar erros de import
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getUser: vi.fn() },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
    }),
    rpc: vi.fn(),
  },
  isSupabaseConfigured: true,
}));

import { calculateCompatibility } from '@/services/lobbies.service';

describe('calculateCompatibility', () => {
  const baseLobbyMeta = {
    mainGame: 'valorant',
    currentRank: 'ouro',
    mainRole: 'controlador',
    availability: 'noite',
    microphone: true,
  };

  it('retorna 50 quando não há perfil gamer', () => {
    expect(calculateCompatibility(null, baseLobbyMeta, 'comp', 'ranked')).toBe(50);
    expect(calculateCompatibility(undefined, baseLobbyMeta, 'comp', 'ranked')).toBe(50);
  });

  it('mesmo jogo soma 25 pontos', () => {
    const userGp = { mainGame: 'valorant' };
    const score = calculateCompatibility(userGp, { mainGame: 'valorant' }, '', '');
    expect(score).toBeGreaterThanOrEqual(25);
  });

  it('mesmo rank pontua mais que rank próximo', () => {
    const sameRank = calculateCompatibility(
      { mainGame: 'valorant', currentRank: 'ouro' },
      { mainGame: 'valorant', currentRank: 'ouro' },
      '', ''
    );
    const nearRank = calculateCompatibility(
      { mainGame: 'valorant', currentRank: 'ouro' },
      { mainGame: 'valorant', currentRank: 'prata' },
      '', ''
    );
    expect(sameRank).toBeGreaterThan(nearRank);
  });

  it('roles complementares (diferentes) aumentam compatibilidade', () => {
    const diffRoles = calculateCompatibility(
      { mainRole: 'duelista' },
      { mainRole: 'controlador' },
      '', ''
    );
    const sameRoles = calculateCompatibility(
      { mainRole: 'duelista' },
      { mainRole: 'duelista' },
      '', ''
    );
    expect(diffRoles).toBeGreaterThan(sameRoles);
  });

  it('score nunca passa de 100 nem fica abaixo de 0', () => {
    // Perfil maximizado
    const maxProfile = {
      mainGame: 'valorant',
      currentRank: 'ouro',
      mainRole: 'duelista',
      secondaryRole: 'sentinela',
      availability: 'noite',
      preferredModes: ['competitivo', 'ranked'],
      microphone: true,
    };
    const score = calculateCompatibility(maxProfile, baseLobbyMeta, 'competitivo', 'ranked');
    expect(score).toBeLessThanOrEqual(100);
    expect(score).toBeGreaterThanOrEqual(0);

    // Perfil vazio
    const emptyScore = calculateCompatibility({}, {}, '', '');
    expect(emptyScore).toBeGreaterThanOrEqual(0);
    expect(emptyScore).toBeLessThanOrEqual(100);
  });
});
