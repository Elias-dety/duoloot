import React from 'react';
import { Player } from '@/schemas/player.schema';
import { SkeletonBlock, Button } from '@/components/atoms';
import { AlertCircle } from 'lucide-react';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfileGameInfo } from '@/features/profile/components/ProfileGameInfo';
import { ProfileTrustPanel } from '@/features/profile/components/ProfileTrustPanel';
import { ProfileStatsGrid } from '@/features/profile/components/ProfileStatsGrid';
import { useNavigate } from 'react-router-dom';

export interface ProfileTemplateProps {
  player: Player | null;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
}

export const ProfileTemplate: React.FC<ProfileTemplateProps> = ({
  player,
  isLoading,
  isError,
  isEmpty,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
        <SkeletonBlock height={140} rounded="lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonBlock height={300} rounded="lg" />
          <SkeletonBlock height={300} rounded="lg" />
        </div>
        <SkeletonBlock height={180} rounded="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-danger" />
        </div>
        <h2 className="text-2xl font-bold text-content-base mb-2">Erro ao carregar o Perfil</h2>
        <p className="text-content-muted mb-6 max-w-md">
          Não foi possível carregar os dados deste jogador no momento. Tente novamente mais tarde.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.location.reload()}>Tentar novamente</Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </div>
    );
  }

  if (isEmpty || !player) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-surface-highlight flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-content-muted" />
        </div>
        <h2 className="text-2xl font-bold text-content-base mb-2">Jogador não encontrado</h2>
        <p className="text-content-muted mb-6">Este perfil não existe ou foi removido.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        ← Voltar
      </Button>

      {/* Cabeçalho do Perfil */}
      <ProfileHeader player={player} />

      {/* Grid Principal: Info do Jogo e Trust Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileGameInfo player={player} />
        <ProfileTrustPanel player={player} />
      </div>

      {/* Grid de Estatísticas */}
      <ProfileStatsGrid player={player} />
    </div>
  );
};
