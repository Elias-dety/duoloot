import React, { useState, useEffect } from 'react';
import DashboardTemplate from '@/templates/DashboardTemplate';
import { DashboardSummary } from '@/schemas/dashboardSummary.schema';
import { Player } from '@/schemas/player.schema';
import { getMainValorantUser, mapValorantUserToPlayer } from '@/data/mocks';

export default function DashboardPage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simular chamada de API
        await new Promise((resolve) => setTimeout(resolve, 800));
        const valUser = getMainValorantUser();
        setPlayer(mapValorantUserToPlayer(valUser));
        // Mapear também sumário ou carregar do antigo se quiser manter
        const { mockDashboardSummary } = await import('@/data/mocks/dashboardSummary.mock');
        setSummary(mockDashboardSummary);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardTemplate 
      player={player}
      summary={summary}
      valorantUser={getMainValorantUser()}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && !isError && (!player || !summary)}
    />
  );
}
