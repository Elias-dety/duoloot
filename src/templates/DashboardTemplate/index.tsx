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
      <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
        <SkeletonBlock height={180} rounded="lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonBlock height={300} rounded="lg" />
          <SkeletonBlock height={300} rounded="lg" />
          <SkeletonBlock height={300} rounded="lg" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-danger" />
        </div>
        <h2 className="text-2xl font-bold text-content-base mb-2">Erro ao carregar o Dashboard</h2>
        <p className="text-content-muted mb-6 max-w-md">
          Não foi possível carregar os seus dados no momento. Tente novamente mais tarde.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>Tentar novamente</Button>
      </div>
    );
  }

  if (isEmpty || !player || !summary) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold text-content-base mb-2">Nenhum dado encontrado</h2>
        <p className="text-content-muted">Não há informações suficientes para exibir o seu dashboard.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-6">
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
