import React from 'react';
import { Player } from '@/schemas/player.schema';
import { DashboardSummary as DashboardSummaryType } from '@/schemas/dashboardSummary.schema';
import { DashboardSummary } from '@/components/organisms/DashboardSummary';
import { TrustScorePanel } from '@/features/dashboard/components/TrustScorePanel';
import { RecentPerformancePanel } from '@/features/dashboard/components/RecentPerformancePanel';
import { DashboardVaultProgress } from '@/features/dashboard/components/DashboardVaultProgress';
import { RecommendedLobbies } from '@/features/dashboard/components/RecommendedLobbies';
import { RecommendedPlayersPanel } from '@/features/recommendations/components/RecommendedPlayersPanel';
import { PendingInvitesPanel } from '@/features/invites/components/PendingInvitesPanel';
import { MyConnectionsPanel } from '@/features/connections/components/MyConnectionsPanel';
import { DuolootButton, DuolootCard, DuolootSectionTitle } from '@/components/duoloot';

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
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--dl-red)] border-t-transparent" />
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[var(--dl-muted-light)]">Carregando dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <DuolootCard variant="danger" className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 font-['Rajdhani'] text-lg font-bold uppercase text-white">Erro ao carregar o dashboard.</p>
        <DuolootButton variant="secondary" onClick={() => window.location.reload()}>Tentar novamente</DuolootButton>
      </DuolootCard>
    );
  }

  if (isEmpty || !player || !summary) {
    return (
      <DuolootCard variant="muted" className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-muted-light)]">Nenhum dado encontrado.</p>
      </DuolootCard>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 md:px-6">
      <DuolootCard variant="accent" className="mb-6 px-5 py-6 md:px-8 md:py-8">
        <DuolootSectionTitle
          eyebrow="Dashboard"
          title="Seu hub Red Vault."
          subtitle="Acompanhe performance, confiança, lobbies recomendados e progresso do Vault no mesmo painel."
        />
      </DuolootCard>

      <DashboardSummary player={player} summary={summary} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-1 xl:col-span-1">
          <TrustScorePanel trustScore={player.trustScore} />
        </div>
        <div className="lg:col-span-1 xl:col-span-1">
          <RecentPerformancePanel />
        </div>
        <div className="lg:col-span-1 xl:col-span-1">
          <DashboardVaultProgress />
        </div>
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-1">
          <RecommendedLobbies />
        </div>
      </div>

      <div className="mt-8">
        <PendingInvitesPanel />
      </div>
      <div className="mt-8">
        <MyConnectionsPanel />
      </div>
      <div className="mt-8">
        <RecommendedPlayersPanel />
      </div>
    </div>
  );
}
