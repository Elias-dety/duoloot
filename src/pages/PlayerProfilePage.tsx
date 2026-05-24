import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Player } from '@/schemas/player.schema';
import { getValorantUserById, mapValorantUserToPlayer } from '@/data/mocks';
import { ProfileTemplate } from '@/templates/ProfileTemplate';
import { useAuth } from '@/features/auth/useAuth';
import type { PlayerGameProfile, PlayerProfile } from '@/services/auth.service';

function mapProfileToPlayer(profile: PlayerProfile): Player {
  const gameProfile = (profile.game_profile || {}) as PlayerGameProfile;
  const nickname = gameProfile.nickname || profile.nickname;

  return {
    id: profile.id,
    name: profile.name || nickname,
    nickname,
    ...(profile.avatar_url ? { avatarUrl: profile.avatar_url } : {}),
    trustScore: profile.trust_score ?? 50,
    status: profile.status || 'online',
    gameProfile,
    stats: {
      matchesPlayed: 0,
      winRate: 0,
      averageKda: 0,
      hoursPlayed: 0,
      commendations: 0,
      abandons: 0,
    },
    preferences: {
      micRequired: !!gameProfile.microphone,
      playStyle: gameProfile.playStyle || 'Nao informado',
      sessionFocus: gameProfile.sessionFocus || 'Nao informado',
      availability: gameProfile.availability || 'Nao informado',
    },
    isPremium: profile.is_premium,
    metadata: profile.metadata,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  };
}

export default function PlayerProfilePage() {
  const { playerId } = useParams<{ playerId: string }>();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isPlayerNotFound, setIsPlayerNotFound] = useState(false);

  useEffect(() => {
    if (authLoading && user?.id === playerId && !profile) {
      setIsLoading(true);
      return;
    }

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

        if (user?.id === playerId && profile) {
          setPlayer(mapProfileToPlayer(profile));
          setIsPlayerNotFound(false);
          return;
        }

        const valUser = getValorantUserById(playerId);
        if (!valUser) {
          setPlayer(null);
          setIsPlayerNotFound(true);
        } else {
          setPlayer(mapValorantUserToPlayer(valUser));
          setIsPlayerNotFound(false);
        }
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayer();
  }, [authLoading, playerId, profile, user?.id]);

  return (
    <ProfileTemplate
      player={player}
      isLoading={isLoading}
      isError={isError}
      isPlayerNotFound={isPlayerNotFound}
    />
  );
}
