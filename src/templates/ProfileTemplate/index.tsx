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
  <div className="mx-auto flex min-h-[50vh] w-full max-w-[1240px] flex-col items-center justify-center space-y-6 pb-12">
    <div className="w-10 h-10 border-2 border-[var(--dl-tactical-blue)] border-t-transparent rounded-full animate-spin" />
    <p className="text-[var(--dl-tactical-muted)] text-[12px] font-bold uppercase tracking-[0.12em]">Escaneando alvo...</p>
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
      <div className="dl-panel mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16" style={{ borderColor: 'rgba(255,51,102,0.3)' }}>
        <p className="mb-4 text-lg font-bold text-[var(--dl-tactical-red)] font-['Rajdhani'] uppercase">Erro ao carregar perfil</p>
        <p className="text-sm text-[var(--dl-tactical-muted)]">Não foi possível carregar os dados deste jogador agora.</p>
      </div>
    );
  }

  if (isPlayerNotFound || !player) {
    return (
      <div className="dl-panel mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16">
        <p className="mb-4 text-lg font-bold text-[var(--dl-tactical-muted)] font-['Rajdhani'] uppercase">Jogador não encontrado</p>
        <p className="mb-6 text-sm text-[var(--dl-tactical-muted)]">Esse perfil não existe ou foi removido.</p>
        <button type="button" className="dl-btn" onClick={() => navigate(-1)}>Voltar</button>
      </div>
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
        <div className="relative z-[2]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="dl-hud-label" style={{ color: 'var(--dl-tactical-blue)', borderColor: 'rgba(70,183,255,0.34)', background: 'rgba(70,183,255,0.08)' }}>
              PLAYER SCANNER // PUBLIC REPORT
            </span>
          </div>
          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            Relatório de{' '}
            <span className="text-[var(--dl-tactical-blue)] drop-shadow-[0_0_24px_rgba(70,183,255,0.3)]">
              Alvo
            </span>
          </h1>
          <p className="dl-muted max-w-[600px] text-[14px] leading-[1.65]">
            Dados públicos do jogador, histórico de comportamento e preferências de lobby.
          </p>
        </div>
      </div>

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
