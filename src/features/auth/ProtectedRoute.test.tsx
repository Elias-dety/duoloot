import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import React from 'react';

// Mocks devem vir antes dos imports de componentes
vi.mock('@/features/auth/useAuth');
vi.mock('@/lib/supabase', () => ({
  supabase: {},
  isSupabaseConfigured: true,
  assertSupabaseConfigured: vi.fn(),
}));
vi.mock('@/services/onboarding.service', () => ({
  isGameProfileComplete: vi.fn(),
}));

import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { useAuth } from '@/features/auth/useAuth';
import { isGameProfileComplete } from '@/services/onboarding.service';
import * as supabaseModule from '@/lib/supabase';

const mockedUseAuth = vi.mocked(useAuth);
const mockedIsComplete = vi.mocked(isGameProfileComplete);

function renderWithRouter(initialEntry: string = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        <Route path="/onboarding" element={<div data-testid="onboarding-page">Onboarding</div>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div data-testid="protected-content">Dashboard Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: Supabase configurado
    Object.defineProperty(supabaseModule, 'isSupabaseConfigured', { value: true, writable: true });
  });

  it('renderiza estado de carregamento quando isLoading é true', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      session: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
    });

    renderWithRouter();
    expect(screen.getByText(/DECIPHERING OPERATOR SESSION/i)).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('redireciona para login quando não autenticado', () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
    });

    renderWithRouter();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('redireciona para onboarding quando perfil gamer incompleto', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'u1' } as import('@supabase/supabase-js').User,
      session: {} as import('@supabase/supabase-js').Session,
      profile: { game_profile: { mainGame: 'valorant' } } as import('@/services/auth.service').PlayerProfile,
      isLoading: false,
      isAuthenticated: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
    });

    mockedIsComplete.mockReturnValue(false);

    renderWithRouter();
    expect(screen.getByTestId('onboarding-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('renderiza children quando autenticado com perfil completo', () => {
    mockedUseAuth.mockReturnValue({
      user: { id: 'u1' } as import('@supabase/supabase-js').User,
      session: {} as import('@supabase/supabase-js').Session,
      profile: {
        id: 'u1', name: 'Test', nickname: 'test', avatar_url: null, trust_score: 50,
        status: 'online', is_premium: false, created_at: '', updated_at: '',
        game_profile: { mainGame: 'valorant', nickname: 'tst', currentRank: 'ouro', mainRole: 'duelista', playStyle: 'agressivo', availability: 'noite', preferredModes: ['comp'] },
        metadata: {},
      } as import('@/services/auth.service').PlayerProfile,
      isLoading: false,
      isAuthenticated: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      refreshProfile: vi.fn(),
    });

    mockedIsComplete.mockReturnValue(true);

    renderWithRouter();
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
