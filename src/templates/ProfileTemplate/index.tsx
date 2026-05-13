import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, SkeletonBlock } from '@/components/atoms';
import { PageState } from '@/components/molecules';
import { Player } from '@/schemas/player.schema';
import { ProfileGameInfo } from '@/features/profile/components/ProfileGameInfo';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfilePreferencesPanel } from '@/features/profile/components/ProfilePreferencesPanel';
import { ProfileStatsGrid } from '@/features/profile/components/ProfileStatsGrid';
import { ProfileTrustPanel } from '@/features/profile/components/ProfileTrustPanel';

export interface ProfileTemplateProps {
  player: Player | null;
  isLoading?: boolean;
  isError?: boolean;
  isPlayerNotFound?: boolean;
}

const ProfileLoadingState = () => (
  <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
    <SkeletonBlock height={180} rounded="lg" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SkeletonBlock height={240} rounded="lg" />
      <SkeletonBlock height={240} rounded="lg" />
    </div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SkeletonBlock height={220} rounded="lg" />
      <SkeletonBlock height={220} rounded="lg" />
    </div>
  </div>
);

export const ProfileTemplate: React.FC<ProfileTemplateProps> = ({
  player,
  isLoading,
  isError,
  isPlayerNotFound,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <ProfileLoadingState />;
  }

  if (isError) {
    return (
      <PageState
        type="error"
        title="Erro ao carregar perfil"
        description="Nao foi possivel carregar os dados deste jogador agora."
      />
    );
  }

  if (isPlayerNotFound || !player) {
    return (
      <PageState
        type="empty"
        title="Jogador nao encontrado"
        description="Esse perfil nao existe ou foi removido."
        actionText="Voltar"
        onAction={() => navigate(-1)}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      <Button variant="ghost" className="px-0" onClick={() => navigate(-1)}>
        Voltar
      </Button>

      <ProfileHeader player={player} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProfileGameInfo player={player} />
        <ProfileTrustPanel player={player} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProfilePreferencesPanel player={player} />
        <ProfileStatsGrid player={player} />
      </div>
    </div>
  );
};
