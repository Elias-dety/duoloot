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
import { DuolootCard, DuolootSectionTitle, DuolootLoadingState, DuolootEmptyState } from '@/components/duoloot';
import { RiotConnectPanel } from '@/features/riot/components/RiotConnectPanel';
import { PlayerStatsOverview } from '@/features/riot/components/PlayerStatsOverview';
import { MatchHistoryList } from '@/features/riot/components/MatchHistoryList';
import { AgentStatsGrid } from '@/features/riot/components/AgentStatsGrid';
import { MapStatsGrid } from '@/features/riot/components/MapStatsGrid';

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
    return <DuolootLoadingState message="Carregando dashboard..." />;
  }

  if (isError) {
    return (
      <DuolootEmptyState 
        icon="error" 
        title="Erro ao carregar" 
        description="Ocorreu um problema ao buscar os dados do seu Dashboard."
        actionLabel="Tentar novamente"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (isEmpty || !player || !summary) {
    return (
      <DuolootEmptyState 
        title="Dashboard Vazio" 
        description="Nenhum dado encontrado para exibir no momento."
      />
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-1">
          <RiotConnectPanel />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
          {/* Usando dados mockados como exemplo */}
          <PlayerStatsOverview 
            stats={{
              winRate: 58.5,
              kda: 1.45,
              headshotRate: 22.4,
              matchesPlayed: 45,
              wins: 26,
              losses: 19,
              averageScore: 235,
              currentRank: "Ascendente 1"
            }} 
          />
        </div>
      </div>

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <MatchHistoryList 
            matches={[
              { id: '1', result: 'VICTORY', agent: 'Jett', agentImageUrl: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png', map: 'Ascent', score: '13 - 10', kda: '21/14/5', kdRatio: 1.5, combatScore: 285, date: 'Há 2 horas' },
              { id: '2', result: 'DEFEAT', agent: 'Omen', agentImageUrl: 'https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png', map: 'Bind', score: '11 - 13', kda: '15/18/8', kdRatio: 0.8, combatScore: 195, date: 'Há 5 horas' },
              { id: '3', result: 'VICTORY', agent: 'Jett', agentImageUrl: 'https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png', map: 'Haven', score: '13 - 6', kda: '25/9/2', kdRatio: 2.7, combatScore: 310, date: 'Ontem' },
            ]}
          />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <AgentStatsGrid 
            stats={[
              { agentName: 'Jett', agentRole: 'Duelist', winRate: 62.5, matchesPlayed: 24, kda: 1.8 },
              { agentName: 'Omen', agentRole: 'Controller', winRate: 45.0, matchesPlayed: 12, kda: 1.1 },
            ]}
          />
          <MapStatsGrid 
            stats={[
              { mapName: 'Ascent', winRate: 68.0, matchesPlayed: 15 },
              { mapName: 'Bind', winRate: 42.0, matchesPlayed: 10 },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
