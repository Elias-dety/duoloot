import React from 'react';
import { Player } from '@/schemas/player.schema';
import { DashboardSummary as DashboardSummaryType } from '@/schemas/dashboardSummary.schema';
import { DashboardSummary } from '@/components/organisms/DashboardSummary';
import { TrustScorePanel } from '@/features/dashboard/components/TrustScorePanel';
import { RecentPerformancePanel } from '@/features/dashboard/components/RecentPerformancePanel';
import { DashboardVaultProgress } from '@/features/dashboard/components/DashboardVaultProgress';
import { RecommendedLobbies } from '@/features/dashboard/components/RecommendedLobbies';
import { SkeletonBlock, Button } from '@/components/atoms';
import { AlertCircle } from 'lucide-react';

export interface DashboardTemplateProps {
  player: Player | null;
  summary: DashboardSummaryType | null;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
}

export default function DashboardTemplate({
  player,
  summary,
  isLoading,
  isError,
  isEmpty,
}: DashboardTemplateProps) {
  
  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[1240px] flex-col items-center justify-center space-y-6 pb-12">
        <div className="w-10 h-10 border-2 border-[var(--dl-tactical-green)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--dl-tactical-muted)] text-[12px] font-bold uppercase tracking-[0.12em]">Acessando dados...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dl-panel mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16" style={{ borderColor: 'rgba(255,51,102,0.3)' }}>
        <p className="mb-4 text-lg font-bold text-[var(--dl-tactical-red)] font-['Rajdhani'] uppercase">Erro ao carregar o Dashboard.</p>
        <button type="button" className="dl-btn dl-btn-red" onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  if (isEmpty || !player || !summary) {
    return (
      <div className="dl-panel mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 text-lg font-bold text-[var(--dl-tactical-muted)] font-['Rajdhani'] uppercase">Nenhum dado encontrado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 md:px-6">
      {/* Header HUD do Dashboard */}
      <div className="dl-panel relative overflow-hidden p-[18px] mb-6 md:p-[28px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(56,242,139,0.14),transparent_20rem),linear-gradient(120deg,transparent,rgba(56,242,139,0.04),transparent)]" />
        <div className="relative z-[2]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="dl-hud-label" style={{ color: 'var(--dl-tactical-green)', borderColor: 'rgba(56,242,139,0.34)', background: 'rgba(56,242,139,0.08)' }}>
              PLAYER COMMAND // OPERATOR DASHBOARD
            </span>
          </div>
          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            Painel do{' '}
            <span className="text-[var(--dl-tactical-green)] drop-shadow-[0_0_24px_rgba(56,242,139,0.3)]">
              Jogador
            </span>
          </h1>
          <p className="dl-muted max-w-[600px] text-[14px] leading-[1.65]">
            Sua central de operações. Analise sua performance, gerencie seu trust score e acompanhe seu progresso no cofre.
          </p>
        </div>
      </div>

      {/* Top Section - User Summary */}
      <DashboardSummary player={player} summary={summary} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Trust Score & Performance (Takes up half the space on desktop) */}
        <div className="lg:col-span-1 xl:col-span-1">
          <TrustScorePanel trustScore={player.trustScore} />
        </div>
        
        <div className="lg:col-span-1 xl:col-span-1">
          <RecentPerformancePanel />
        </div>

        {/* Vault Connection */}
        <div className="lg:col-span-1 xl:col-span-1">
          <DashboardVaultProgress />
        </div>

        {/* Lobbies Connection */}
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-1">
          <RecommendedLobbies />
        </div>
      </div>
    </div>
  );
}
