import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Player } from '@/schemas/player.schema';
import { ProfileGameInfo } from '@/features/profile/components/ProfileGameInfo';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';
import { ProfilePreferencesPanel } from '@/features/profile/components/ProfilePreferencesPanel';
import { ProfileStatsGrid } from '@/features/profile/components/ProfileStatsGrid';
import { ProfileTrustPanel } from '@/features/profile/components/ProfileTrustPanel';
import { ASSETS } from '@/constants/assets';

import { LoadingState, EmptyState } from '@/components/molecules';;

export interface ProfileTemplateProps {
  player: Player | null;
  isLoading?: boolean;
  isError?: boolean;
  isPlayerNotFound?: boolean;
}

export const ProfileTemplate: React.FC<ProfileTemplateProps> = ({
  player,
  isLoading,
  isError,
  isPlayerNotFound,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingState message="Escaneando alvo..." />;
  }

  if (isError) {
    return (
      <EmptyState 
        icon="error" 
        title="Erro ao carregar perfil" 
        description="Não foi possível carregar os dados deste jogador agora."
        actionLabel="Tentar novamente"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (isPlayerNotFound || !player) {
    return (
      <EmptyState 
        title="Jogador não encontrado" 
        description="Esse perfil não existe ou foi removido."
        actionLabel="Voltar"
        onAction={() => navigate(-1)}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 md:px-6">
      <button type="button" className="dl-btn dl-btn-blue mb-4 px-6 h-[40px] flex items-center gap-2" onClick={() => navigate(-1)}>
        <span className="text-[14px]">◄</span> Voltar
      </button>

      {/* Header HUD de Perfil */}
      <div className="dl-panel relative overflow-hidden p-[18px] mb-6 md:p-[28px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(70,183,255,0.14),transparent_20rem),linear-gradient(120deg,transparent,rgba(70,183,255,0.04),transparent)]" />
        <img
          src={ASSETS.icons.trustScore}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-1/2 hidden h-32 w-32 -translate-y-1/2 object-contain opacity-10 md:block"
        />
        <div className="relative z-[2]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="dl-hud-label" style={{ color: 'var(--dl-error)', borderColor: 'rgba(var(--dl-error-rgb),0.34)', background: 'rgba(var(--dl-error-rgb),0.08)' }}>
              PLAYER PROFILE // DUO LOOT REPORT
            </span>
          </div>
          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            Perfil do{' '}
            <span className="text-[var(--dl-error)] drop-shadow-[0_0_24px_rgba(var(--dl-error-rgb),0.3)]">
              Jogador
            </span>
          </h1>
          <p className="dl-muted max-w-[600px] text-[14px] leading-[1.65]">
            Este relatório reúne reputação, estilo de jogo e sinais de compatibilidade para ajudar na escolha do duo.
          </p>
        </div>
      </div>

      <ProfileHeader player={player} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
        <ProfileTrustPanel player={player} />
        <ProfileGameInfo player={player} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProfilePreferencesPanel player={player} />
        <ProfileStatsGrid player={player} />
      </div>
    </div>
  );
};
