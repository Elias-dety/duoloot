import React from 'react';
import { Button } from '@/components/atoms';
import { VaultEventSection } from '@/components/organisms/VaultEventSection';
import { WinnersList, Winner } from '@/components/organisms/WinnersList';
import { MissionCard } from '@/features/vault/components/MissionCard';
import { VaultStats } from '@/features/vault/components/VaultStats';
import { Event } from '@/schemas/event.schema';
import { Mission } from '@/schemas/mission.schema';

export interface VaultTemplateProps {
  event: Event | null;
  missions: Mission[];
  winners: Winner[];
  isLoading: boolean;
  isError: boolean;
  onJoinVault?: () => void;
  onClaimTask?: (taskId: string) => void;
  isJoining?: boolean;
}

export const VaultTemplate: React.FC<VaultTemplateProps> = ({ 
  event, 
  missions, 
  winners, 
  isLoading, 
  isError,
  onJoinVault,
  onClaimTask,
  isJoining
}) => {
  const eventStatus =
    event?.status === 'ended' ? 'completed' : event?.status === 'scheduled' ? 'upcoming' : 'active';

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[1240px] flex-col items-center justify-center space-y-6 pb-12">
        <div className="w-10 h-10 border-2 border-[var(--dl-tactical-yellow)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--dl-tactical-muted)] text-[12px] font-bold uppercase tracking-[0.12em]">Sincronizando cofre...</p>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="dl-panel mx-auto flex w-full max-w-[1240px] flex-col items-center justify-center py-16" style={{ borderColor: 'rgba(255,51,102,0.3)' }}>
        <p className="mb-4 text-lg font-bold text-[var(--dl-tactical-red)] font-['Rajdhani'] uppercase">Erro ao carregar os dados do cofre.</p>
        <Button variant="secondary">Tentar Novamente</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 md:px-6">
      {/* Header HUD do Cofre */}
      <div className="dl-panel relative overflow-hidden p-[18px] mb-6 md:p-[28px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,226,102,0.14),transparent_20rem),linear-gradient(120deg,transparent,rgba(255,226,102,0.04),transparent)]" />
        <div className="relative z-[2]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="dl-hud-label" style={{ color: 'var(--dl-tactical-yellow)', borderColor: 'rgba(255,226,102,0.34)', background: 'rgba(255,226,102,0.08)' }}>
              VAULT OPERATION // LOOT MODULE
            </span>
            <span className="dl-stamp dl-stamp-yellow">{eventStatus === 'active' ? 'Cofre aberto' : eventStatus === 'upcoming' ? 'Em breve' : 'Encerrado'}</span>
          </div>
          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            Dispute recompensas no{' '}
            <span className="text-[var(--dl-tactical-yellow)] drop-shadow-[0_0_24px_rgba(255,226,102,0.3)]">
              Cofre
            </span>
          </h1>
          <p className="dl-muted max-w-[600px] text-[14px] leading-[1.65]">
            Complete contratos ativos, jogue com duos compatíveis e receba sua parte do prêmio acumulado.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="order-1 w-full flex-1">
          <VaultEventSection
            title={event.title}
            prizeAmount={event.prizePool}
            currency={event.prizeCurrency}
            endsAt={new Date(event.endsAt || new Date().toISOString())}
            currentValue={event.totalParticipants * 15}
            targetValue={100000}
            status={eventStatus}
          />

          {/* Multiplicador */}
          <div className="dl-panel mt-4 flex flex-col items-center gap-4 p-4 sm:flex-row" style={{ borderColor: 'rgba(255,226,102,0.25)' }}>
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[var(--dl-tactical-yellow)] font-bold text-[14px] font-['Rajdhani'] uppercase">Multiplicador Ativo: 1.5x</span>
              <p className="mt-1 text-[12px] text-[var(--dl-tactical-muted)]">
                Ganhos em dobro nas próximas 2 horas jogando em duo fechado.
              </p>
            </div>
            <Button 
              variant="primary" 
              className="w-full shrink-0 sm:w-auto"
              onClick={onJoinVault}
              disabled={isJoining}
            >
              {isJoining ? 'Inscrevendo...' : 'Participar Agora'}
            </Button>
          </div>
        </div>

        <div className="order-2 w-full shrink-0 lg:w-80">
          <VaultStats
            totalParticipants={event.totalParticipants}
            onlineParticipants={event.onlineParticipants}
            currentValue={event.totalParticipants * 15}
            targetValue={100000}
          />
        </div>
      </div>

      {/* Missões e Vencedores */}
      <div className="order-3 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-[var(--dl-tactical-line)] pb-4">
            <h2 className="font-['Rajdhani'] text-xl font-bold uppercase text-[var(--dl-tactical-text)]">
              Contratos ativos
            </h2>
            <span className="dl-stamp dl-stamp-yellow">{missions.length} missões</span>
          </div>
          {missions.length === 0 ? (
            <div className="dl-panel p-8 text-center">
              <span className="text-[var(--dl-tactical-muted)] text-[13px]">Nenhuma missão disponível no momento.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {missions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} onClaim={onClaimTask} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <WinnersList winners={winners} isLoading={false} />
        </div>
      </div>
    </div>
  );
};
