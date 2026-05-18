/**
 * Mocks centralizados para autenticação em testes unitários.
 * Permite simular diferentes estados de usuário de forma consistente.
 */
import { vi } from 'vitest';
import type { AuthContextType } from '@/features/auth/AuthContext';
import type { PlayerProfile } from '@/services/auth.service';

/** Perfil gamer completo para testes. */
export const completeGameProfile = {
  mainGame: 'valorant',
  nickname: 'TestOperator',
  currentRank: 'diamante',
  mainRole: 'duelista',
  secondaryRole: 'controlador',
  playStyle: 'agressivo',
  sessionFocus: 'competitivo',
  availability: 'noite',
  preferredModes: ['competitivo', 'ranqueado'],
  microphone: true,
  region: 'br',
  bio: 'Teste',
};

/** Perfil gamer incompleto — falta campos obrigatórios. */
export const incompleteGameProfile = {
  mainGame: 'valorant',
};

/** PlayerProfile completo para testes. */
export const mockPlayerProfile: PlayerProfile = {
  id: 'user-test-123',
  name: 'Test User',
  nickname: 'testuser',
  avatar_url: null,
  trust_score: 75,
  status: 'online',
  is_premium: false,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  game_profile: completeGameProfile,
  metadata: {},
};

/** PlayerProfile com perfil gamer incompleto. */
export const mockIncompleteProfile: PlayerProfile = {
  ...mockPlayerProfile,
  game_profile: incompleteGameProfile,
};

/** Contexto de auth para usuário deslogado. */
export const unauthenticatedContext: AuthContextType = {
  user: null,
  session: null,
  profile: null,
  isLoading: false,
  isAuthenticated: false,
  signIn: vi.fn().mockResolvedValue({ success: false }),
  signUp: vi.fn().mockResolvedValue({ success: false, sessionCreated: false }),
  signOut: vi.fn(),
  refreshProfile: vi.fn(),
};

/** Contexto de auth para usuário autenticado com perfil completo. */
export const authenticatedContext: AuthContextType = {
  user: { id: 'user-test-123', email: 'test@duoloot.com' } as import('@supabase/supabase-js').User,
  session: { access_token: 'mock-token' } as import('@supabase/supabase-js').Session,
  profile: mockPlayerProfile,
  isLoading: false,
  isAuthenticated: true,
  signIn: vi.fn().mockResolvedValue({ success: true }),
  signUp: vi.fn().mockResolvedValue({ success: true, sessionCreated: true }),
  signOut: vi.fn(),
  refreshProfile: vi.fn(),
};

/** Contexto de auth para usuário autenticado com perfil incompleto. */
export const incompleteProfileContext: AuthContextType = {
  ...authenticatedContext,
  profile: mockIncompleteProfile,
};

/** Contexto de auth em estado de carregamento. */
export const loadingContext: AuthContextType = {
  ...unauthenticatedContext,
  isLoading: true,
};

/**
 * Aplica mock do useAuth para retornar o contexto desejado.
 * Deve ser chamado ANTES do import do componente sob teste.
 */
export function mockUseAuth(context: AuthContextType) {
  vi.doMock('@/features/auth/useAuth', () => ({
    useAuth: () => context,
    default: () => context,
  }));
}
