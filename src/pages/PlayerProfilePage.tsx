import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockPlayers } from '@/data/mocks/players.mock';
import { Player } from '@/schemas/player.schema';
import { ProfileTemplate } from '@/templates/ProfileTemplate';

export default function PlayerProfilePage() {
  const { playerId } = useParams<{ playerId: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isPlayerNotFound, setIsPlayerNotFound] = useState(false);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setIsPlayerNotFound(false);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!playerId) {
          setPlayer(null);
          setIsPlayerNotFound(true);
          return;
        }

        const foundPlayer = mockPlayers.find((item) => item.id === playerId) ?? null;
        setPlayer(foundPlayer);
        setIsPlayerNotFound(!foundPlayer);
      } catch {
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
      isPlayerNotFound={isPlayerNotFound}
    />
  );
}
