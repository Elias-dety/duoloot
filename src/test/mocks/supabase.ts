/**
 * Mocks centralizados para o módulo @/lib/supabase usado em testes unitários.
 * Permite simular cenários de Supabase configurado vs. ausente.
 */
import { vi } from 'vitest';

/**
 * Cria mock do módulo @/lib/supabase com estado configurável.
 * @param configured — se true, isSupabaseConfigured retorna true.
 */
export function mockSupabaseModule(configured: boolean = true) {
  const channelMock = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
  };

  const supabaseMock = {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
    }),
    rpc: vi.fn(),
    channel: vi.fn().mockReturnValue(channelMock),
    removeChannel: vi.fn(),
  };

  vi.doMock('@/lib/supabase', () => ({
    supabase: supabaseMock,
    isSupabaseConfigured: configured,
    assertSupabaseConfigured: configured
      ? vi.fn()
      : vi.fn(() => {
          throw new Error('Configuração do Supabase ausente.');
        }),
  }));

  return supabaseMock;
}
