import React from 'react';
import { Player } from '@/schemas/player.schema';
import { ValorantMockUser } from '@/types/valorant.types';
import { DashboardSummary as DashboardSummaryType } from '@/schemas/dashboardSummary.schema';
import { DashboardSummary } from '@/components/organisms/DashboardSummary';
import { TrustScorePanel } from '@/features/dashboard/components/TrustScorePanel';
import { RecentPerformancePanel } from '@/features/dashboard/components/RecentPerformancePanel';
import { DashboardVaultProgress } from '@/features/dashboard/components/DashboardVaultProgress';
import { RecommendedLobbies } from '@/features/dashboard/components/RecommendedLobbies';
import { RecommendedPlayersPanel } from '@/features/recommendations/components/RecommendedPlayersPanel';
import { PendingInvitesPanel } from '@/features/invites/components/PendingInvitesPanel';
import { MyConnectionsPanel } from '@/features/connections/components/MyConnectionsPanel';
import { Card, SectionTitle } from '@/components/atoms';
import { LoadingState, EmptyState } from '@/components/molecules';
import { RiotConnectPanel } from '@/features/riot/components/RiotConnectPanel';
import { PlayerStatsOverview } from '@/features/riot/components/PlayerStatsOverview';
import { MatchHistoryList } from '@/features/riot/components/MatchHistoryList';
import { AgentStatsGrid } from '@/features/riot/components/AgentStatsGrid';
import { MapStatsGrid } from '@/features/riot/components/MapStatsGrid';

export interface DashboardTemplateProps {
  player: Player | null;
  summary: DashboardSummaryType | null;
  valorantUser?: ValorantMockUser;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
}

export default function DashboardTemplate({
  player,
  summary,
  valorantUser,
  isLoading,
  isError,
  isEmpty,
}: DashboardTemplateProps) {
  if (isLoading) {
    return <LoadingState message="Carregando dashboard..." />;
  }

  if (isError) {
    return (
      <EmptyState 
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
      <EmptyState 
        title="Dashboard Vazio" 
        description="Nenhum dado encontrado para exibir no momento."
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 md:px-6">
      <Card variant="accent" className="mb-6 px-5 py-6 md:px-8 md:py-8">
        <SectionTitle
          eyebrow="Dashboard"
          title="Seu hub Red Vault."
          subtitle="Acompanhe performance, confiança, lobbies recomendados e progresso do Vault no mesmo painel."
        />
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-1">
          <RiotConnectPanel />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
          {valorantUser ? (
            <PlayerStatsOverview 
              stats={{
                winRate: valorantUser.overviewStats.winRate,
                kda: valorantUser.overviewStats.kdaRatio,
                headshotRate: valorantUser.overviewStats.headshotPercent,
                matchesPlayed: valorantUser.overviewStats.matchesPlayed,
                wins: valorantUser.overviewStats.wins,
                losses: valorantUser.overviewStats.losses,
                averageScore: valorantUser.overviewStats.averageCombatScore,
                currentRank: valorantUser.rank.label
              }} 
            />
          ) : (
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
          )}
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
            matches={valorantUser ? valorantUser.recentMatches.map(m => ({
              id: m.matchId,
              result: m.result === 'win' ? 'VICTORY' : m.result === 'loss' ? 'DEFEAT' : 'DRAW',
              agent: m.agent,
              agentImageUrl: m.agentImageUrl,
              map: m.map,
              score: m.scoreText,
              kda: `${m.kills}/${m.deaths}/${m.assists}`,
              kdRatio: m.kdRatio,
              combatScore: m.averageCombatScore,
              date: new Date(m.startedAt).toLocaleDateString()
            })) : []}
          />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <AgentStatsGrid 
            stats={valorantUser ? valorantUser.agentStats.map(a => ({
              agentName: a.agent,
              agentRole: a.role,
              winRate: a.winRate,
              matchesPlayed: a.matches,
              kda: a.kdaRatio
            })) : []}
          />
          <MapStatsGrid 
            stats={valorantUser ? valorantUser.mapStats.map(m => ({
              mapName: m.map,
              winRate: m.winRate,
              matchesPlayed: m.matches
            })) : []}
          />
        </div>
      </div>
    </div>
  );
}
