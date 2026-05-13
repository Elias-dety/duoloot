import React, { useState, useEffect } from 'react';
import { VaultTemplate } from '@/templates/VaultTemplate';
import { mockEvents } from '@/data/mocks/events.mock';
import { mockMissions } from '@/data/mocks/missions.mock';
import { Event } from '@/schemas/event.schema';
import { Mission } from '@/schemas/mission.schema';
import { Winner } from '@/components/organisms/WinnersList';

// Mock temporary para os vencedores
const mockWinners: Winner[] = [
  { id: '1', username: 'FalleN', prizeWon: '500 DuoCoins', date: 'Há 5 min' },
  { id: '2', username: 'Sacy', prizeWon: '200 DuoCoins', date: 'Há 12 min' },
  { id: '3', username: 'Aspas', prizeWon: '100 DuoCoins', date: 'Há 1 hora' },
];

export default function VaultPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchVaultData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        // Delay simulado
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulação bem sucedida usando o evento ativo
        setEvent(mockEvents[0]);
        setMissions(mockMissions);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaultData();
  }, []);

  return (
    <VaultTemplate 
      event={event} 
      missions={missions} 
      winners={mockWinners}
      isLoading={isLoading} 
      isError={isError} 
    />
  );
}
