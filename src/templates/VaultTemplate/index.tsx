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
}

export const VaultTemplate: React.FC<VaultTemplateProps> = ({ event, missions, winners, isLoading, isError }) => {
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
      <div className="flex flex-wrap items-center gap-3">
        <span className="dl-hud-label">VAULT OPERATION // LOOT MODULE</span>
        <span className="dl-stamp dl-stamp-yellow">{eventStatus === 'active' ? 'Cofre aberto' : eventStatus === 'upcoming' ? 'Em breve' : 'Encerrado'}</span>
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
            <Button variant="primary" className="w-full shrink-0 sm:w-auto">
              Participar Agora
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
                <MissionCard key={mission.id} mission={mission} />
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
