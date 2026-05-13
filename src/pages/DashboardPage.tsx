import React, { useState, useEffect } from 'react';
import DashboardTemplate from '@/templates/DashboardTemplate';
import { mockPlayers } from '@/data/mocks/players.mock';
import { mockDashboardSummary } from '@/data/mocks/dashboardSummary.mock';
import { Player } from '@/schemas/player.schema';
import { DashboardSummary } from '@/schemas/dashboardSummary.schema';

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
        setPlayer(mockPlayers[0]); // Assumindo o usuário logado
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
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && !isError && (!player || !summary)}
    />
  );
}
