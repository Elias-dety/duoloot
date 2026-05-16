import React, { useState, useEffect } from 'react';
import { VaultTemplate } from '@/templates/VaultTemplate';
import { Event } from '@/schemas/event.schema';
import { Mission } from '@/schemas/mission.schema';
import { Winner } from '@/components/organisms/WinnersList';
import { getActiveVaultEvent, getVaultTasks, getVaultWinner, joinVaultEvent, claimVaultWinner } from '@/services';

// Mock temporary para os vencedores
const mockWinners: Winner[] = [
  { id: '1', username: 'FalleN', prizeWon: '500 DuoCoins', date: 'Há 5 min' },
  { id: '2', username: 'Sacy', prizeWon: '200 DuoCoins', date: 'Há 12 min' },
  { id: '3', username: 'Aspas', prizeWon: '100 DuoCoins', date: 'Há 1 hora' },
];

export default function VaultPage() {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [vaultTasks, setVaultTasks] = useState<Mission[]>([]);
  const [winners, setWinners] = useState<Winner[]>(mockWinners);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchVaultData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        
        const eventData = await getActiveVaultEvent();
        if (eventData) {
          const mappedEvent: Event = {
            id: eventData.id,
            title: eventData.title,
            description: eventData.description,
            prizePool: eventData.prize_pool,
            prizeCurrency: eventData.prize_currency,
            status: eventData.status as 'active' | 'scheduled' | 'ended' | 'cancelled',
            totalParticipants: eventData.total_participants,
            onlineParticipants: eventData.online_participants,
            startsAt: eventData.starts_at,
            endsAt: eventData.ends_at,
          };
          setActiveEvent(mappedEvent);

          const tasksData = await getVaultTasks(eventData.id);
          const mappedTasks: Mission[] = tasksData.map((task: { id: string; title: string; description: string; rules?: string[]; validation_type: string }) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            rules: task.rules || [],
            progress: 100, // Fallback visual para testar o card de missão
            isCompleted: true, // Libera o clique no botão
            reward: { amount: 50, currency: mappedEvent.prizeCurrency },
            validationType: task.validation_type as 'manual' | 'automatic',
          }));
          setVaultTasks(mappedTasks);

          const winnerData = await getVaultWinner(eventData.id);
          if (winnerData) {
            setWinners([{ 
              id: winnerData.id, 
              username: 'Vencedor!', 
              prizeWon: `${eventData.prize_pool} ${eventData.prize_currency}`, 
              date: new Date(winnerData.created_at).toLocaleTimeString() 
            }]);
          }
        }
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVaultData();
  }, []);

  const handleJoinVault = async () => {
    if (!activeEvent) return;
    try {
      setIsJoining(true);
      await joinVaultEvent(activeEvent.id);
      alert('Inscrição realizada com sucesso!');
    } catch (err: unknown) {
      const error = err as Error;
      if (error.message.includes('User not authenticated') || error.message.includes('Auth session missing')) {
        alert('Entre na sua conta para participar do Cofre.');
      } else if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
        alert('Você já está participando deste cofre!');
      } else {
        alert('Erro ao se inscrever: ' + error.message);
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleClaimTask = async (taskId: string) => {
    if (!activeEvent) return;
    try {
      // Ação temporária para teste do fluxo do Cofre. Depois será substituída pela validação real da missão.
      await claimVaultWinner(activeEvent.id, taskId, { source: 'vault-page-test' });
      alert('Recompensa resgatada com sucesso!');
      
      const winnerData = await getVaultWinner(activeEvent.id);
      if (winnerData) {
        setWinners([{ 
          id: winnerData.id, 
          username: 'Você venceu!', 
          prizeWon: `${activeEvent.prizePool} ${activeEvent.prizeCurrency}`, 
          date: 'Agora' 
        }]);
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.message.includes('User not authenticated') || error.message.includes('Auth session missing')) {
        alert('Entre na sua conta para resgatar a missão.');
      } else {
        alert('Erro ao resgatar: ' + error.message);
      }
    }
  };

  return (
    <VaultTemplate 
      event={activeEvent} 
      missions={vaultTasks} 
      winners={winners}
      isLoading={isLoading} 
      isError={!!errorMessage}
      onJoinVault={handleJoinVault}
      onClaimTask={handleClaimTask}
      isJoining={isJoining}
    />
  );
}
