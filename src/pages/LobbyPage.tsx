import React, { useState, useEffect } from 'react';
import { LobbyTemplate } from '@/templates/LobbyTemplate';
import { mockLobbies } from '@/data/mocks/lobbies.mock';
import { Lobby } from '@/schemas/lobby.schema';

export default function LobbyPage() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Simular fetch da API com os diferentes estados
    const fetchLobbies = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        // Simulando delay de rede para exibir loading
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulação bem sucedida
        setLobbies(mockLobbies);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLobbies();
  }, []);

  return (
    <LobbyTemplate 
      lobbies={lobbies} 
      isLoading={isLoading} 
      isError={isError} 
    />
  );
}
