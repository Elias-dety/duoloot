import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('@/features/auth/useAuth');
vi.mock('@/templates/VaultTemplate', () => ({
  VaultTemplate: (props: { errorMessage?: string; event?: unknown; missions?: unknown[] }) => (
    <div data-testid="vault-template">
      {props.errorMessage ? <span data-testid="error-message">{props.errorMessage}</span> : null}
      <span data-testid="event-status">{props.event ? 'active' : 'null'}</span>
      <span data-testid="missions-count">{String(props.missions?.length ?? 0)}</span>
    </div>
  ),
}));
vi.mock('@/lib/supabase', () => ({
  supabase: {
    channel: vi.fn().mockReturnValue({ on: vi.fn().mockReturnThis(), subscribe: vi.fn().mockReturnThis() }),
    removeChannel: vi.fn(),
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
  },
  isSupabaseConfigured: true,
}));
vi.mock('@/services/vault-progress.service');

import { useAuth } from '@/features/auth/useAuth';
import * as vaultService from '@/services/vault-progress.service';
import * as supabaseModule from '@/lib/supabase';

const mockedUseAuth = vi.mocked(useAuth);
const mockedGetActiveVault = vi.mocked(vaultService.getActiveVault);
const mockedGetVaultOverview = vi.mocked(vaultService.getVaultOverview);
const mockedGetMyVaultProgress = vi.mocked(vaultService.getMyVaultProgress);
const mockedGetVaultLeaderboard = vi.mocked(vaultService.getVaultLeaderboard);
const mockedGetMyVaultRank = vi.mocked(vaultService.getMyVaultRank);
const mockedGetVaultWinners = vi.mocked(vaultService.getVaultWinners);
const mockedGetVaultSeasons = vi.mocked(vaultService.getVaultSeasons);

function defaultAuth() {
  return {
    user: null, session: null, profile: null, isLoading: false, isAuthenticated: false,
    signIn: vi.fn(), signUp: vi.fn(), signOut: vi.fn(), refreshProfile: vi.fn(),
  };
}

function resetVaultMocks() {
  mockedGetActiveVault.mockResolvedValue(null);
  mockedGetVaultOverview.mockResolvedValue(null);
  mockedGetMyVaultProgress.mockResolvedValue(null);
  mockedGetVaultLeaderboard.mockResolvedValue([]);
  mockedGetMyVaultRank.mockResolvedValue(null);
  mockedGetVaultWinners.mockResolvedValue([]);
  mockedGetVaultSeasons.mockResolvedValue([]);
}

describe('VaultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseAuth.mockReturnValue(defaultAuth());
    resetVaultMocks();
    Object.defineProperty(supabaseModule, 'isSupabaseConfigured', { value: true, writable: true });
  });

  it('exibe erro quando Supabase ausente', async () => {
    Object.defineProperty(supabaseModule, 'isSupabaseConfigured', { value: false, writable: true });
    const VaultPage = (await import('@/pages/VaultPage')).default;
    render(<VaultPage />);
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Configuracao do Supabase ausente');
    });
  });

  it('sem evento ativo renderiza event null', async () => {
    const VaultPage = (await import('@/pages/VaultPage')).default;
    render(<VaultPage />);
    await waitFor(() => {
      expect(screen.getByTestId('event-status')).toHaveTextContent('null');
    });
  });

  it('deslogado não busca progresso individual', async () => {
    const evt = { id: 'e1', title: 'T', description: '', status: 'active', prize_pool: 1, prize_currency: 'R$', starts_at: '', ends_at: '', created_at: '' };
    mockedGetActiveVault.mockResolvedValue(evt as never);
    mockedGetVaultOverview.mockResolvedValue({ event: evt as never, missions: [], participantCount: 1 });
    const VaultPage = (await import('@/pages/VaultPage')).default;
    render(<VaultPage />);
    await waitFor(() => { expect(screen.getByTestId('event-status')).toHaveTextContent('active'); });
    expect(mockedGetMyVaultProgress).not.toHaveBeenCalled();
  });

  it('logado participante carrega progresso individual', async () => {
    mockedUseAuth.mockReturnValue({ ...defaultAuth(), user: { id: 'u1' } as never, session: {} as never, isAuthenticated: true });
    const evt = { id: 'e1', title: 'T', description: '', status: 'active', prize_pool: 1, prize_currency: 'R$', starts_at: '', ends_at: '', created_at: '' };
    mockedGetActiveVault.mockResolvedValue(evt as never);
    mockedGetVaultOverview.mockResolvedValue({ event: evt as never, missions: [], participantCount: 1 });
    mockedGetMyVaultProgress.mockResolvedValue({ participant: null, missionProgress: [], totalPoints: 0, percentage: 0 });
    const VaultPage = (await import('@/pages/VaultPage')).default;
    render(<VaultPage />);
    await waitFor(() => { expect(mockedGetMyVaultProgress).toHaveBeenCalledWith('e1'); });
  });
});
