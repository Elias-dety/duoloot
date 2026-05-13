import React from 'react';
import { Button, Card } from '@/components/atoms';
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
      <div className="mx-auto flex min-h-[50vh] w-full max-w-7xl flex-col items-center justify-center space-y-8 pb-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-primary border-t-transparent"></div>
        <p className="mt-4 text-content-secondary">Carregando cofre...</p>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <Card variant="danger" className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center py-16">
        <p className="mb-4 text-lg font-bold text-danger">Erro ao carregar os dados do cofre.</p>
        <Button variant="secondary">Tentar Novamente</Button>
      </Card>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pb-12 animate-fade-in md:px-0">
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
          <Card variant="default" className="mt-4 flex flex-col items-center gap-4 p-4 sm:flex-row">
            <div className="flex-1 text-center sm:text-left">
              <span className="font-bold text-brand-primary">Multiplicador Ativo: 1.5x</span>
              <p className="mt-1 text-xs text-content-secondary">
                Ganhos em dobro nas proximas 2 horas jogando em duo fechado.
              </p>
            </div>
            <Button variant="primary" className="w-full shrink-0 py-3 text-base font-bold sm:w-auto">
              Participar Agora
            </Button>
          </Card>
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

      <div className="order-3 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="border-b border-border pb-4 text-xl font-bold text-content-primary">
            Missoes e Micoes do Dia
          </h2>
          {missions.length === 0 ? (
            <Card variant="elevated" className="p-8 text-center">
              <span className="text-content-secondary">Nenhuma missao disponivel no momento.</span>
            </Card>
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
