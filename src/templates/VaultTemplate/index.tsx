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

export const VaultTemplate: React.FC<VaultTemplateProps> = ({ 
  event, 
  missions, 
  winners,
  isLoading, 
  isError 
}) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-content-secondary mt-4">Carregando cofre...</p>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="w-full max-w-7xl mx-auto py-16 flex flex-col items-center justify-center bg-danger/10 border border-red-500/20 rounded-xl">
        <p className="text-red-400 font-bold mb-4 text-lg">Erro ao carregar os dados do cofre.</p>
        <Button variant="outline">Tentar Novamente</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
      
      {/* Hero / Event Section (Mobile: Prize, Timer, CTA first) */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 w-full order-1">
          <VaultEventSection 
            title={event.title}
            prizeAmount={event.prizePool}
            currency={event.prizeCurrency}
            endsAt={new Date(event.endsAt || new Date().toISOString())}
            currentValue={event.totalParticipants * 15} // Mock data for progress
            targetValue={100000}
            status={event.status as any}
          />
          <div className="mt-4 flex flex-col sm:flex-row gap-4 items-center bg-surface-dark border border-brand-primary/30 p-4 rounded-xl">
            <div className="flex-1 text-center sm:text-left">
              <span className="text-brand-primary font-bold">Multiplicador Ativo: 1.5x</span>
              <p className="text-xs text-content-secondary mt-1">Ganhos em dobro nas próximas 2 horas jogando em duo fechado.</p>
            </div>
            <Button variant="primary" className="w-full sm:w-auto shrink-0 py-3 font-bold text-md">Participar Agora</Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="w-full lg:w-80 shrink-0 order-2">
          <VaultStats 
            totalParticipants={event.totalParticipants}
            onlineParticipants={event.onlineParticipants}
            currentValue={event.totalParticipants * 15}
            targetValue={100000}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 order-3">
        {/* Missions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-content-primary border-b border-surface-highlight pb-4">
            Missões e Micões do Dia
          </h2>
          {missions.length === 0 ? (
            <div className="p-8 text-center bg-surface-dark border border-surface-highlight rounded-xl">
              <span className="text-content-secondary">Nenhuma missão disponível no momento.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {missions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          )}
        </div>

        {/* Winners */}
        <div className="space-y-4">
          <WinnersList winners={winners} isLoading={false} />
        </div>
      </div>
    </div>
  );
};
