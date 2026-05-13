import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileTemplate } from '@/templates/ProfileTemplate';
import { mockPlayers } from '@/data/mocks/players.mock';
import { Player } from '@/schemas/player.schema';

export default function PlayerProfilePage() {
  const { playerId } = useParams<{ playerId: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        // Simulação de delay da rede
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Simulação de busca pelo ID
        // Como é mock, se não achar, podemos simular que achou um (para testes) ou retornar nulo.
        const found = mockPlayers.find(p => p.id === playerId) || mockPlayers[0];
        
        // if (!found) throw new Error('Player not found'); // Exemplo de NotFound
        
        setPlayer(found);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  return (
    <ProfileTemplate 
      player={player}
      isLoading={isLoading}
      isError={isError}
      isEmpty={!isLoading && !isError && !player}
    />
  );
}
