import React from 'react';
import { Coach } from '@/schemas/coach.schema';
import { CoachCard } from '@/features/coaches/components/CoachCard';
import { CoachesFilters } from '@/features/coaches/components/CoachesFilters';
import { ASSETS } from '@/constants/assets';

export interface CoachesTemplateProps {
  coaches: Coach[];
  filteredCoaches: Coach[];
  search: string;
  game: string;
  availability: 'all' | 'available';
  isLoading?: boolean;
  isError?: boolean;
  onSearchChange: (value: string) => void;
  onGameChange: (value: string) => void;
  onAvailabilityChange: (value: 'all' | 'available') => void;
  onClearFilters: () => void;
  onScheduleCoach?: (coach: Coach) => void;
  scheduleMessage?: string | null;
}

export const CoachesTemplate: React.FC<CoachesTemplateProps> = ({
  filteredCoaches,
  search,
  game,
  availability,
  isLoading,
  isError,
  onSearchChange,
  onGameChange,
  onAvailabilityChange,
  onClearFilters,
  onScheduleCoach,
  scheduleMessage,
}) => {
  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-[2560px] 3xl:px-12 4xl:px-24 flex-col items-center justify-center space-y-6 pb-12">
        <div className="w-10 h-10 border-2 border-[var(--dl-tactical-purple)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--dl-tactical-muted)] text-[12px] font-bold uppercase tracking-[0.12em]">Buscando instrutores...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dl-panel mx-auto flex w-full max-w-[2560px] 3xl:px-12 4xl:px-24 flex-col items-center justify-center py-16" style={{ borderColor: 'rgba(255,51,102,0.3)' }}>
        <p className="mb-4 text-lg font-bold text-[var(--dl-tactical-red)] font-['Rajdhani'] uppercase">Erro ao carregar coaches.</p>
        <p className="text-sm text-[var(--dl-tactical-muted)] mb-6">Não foi possível montar a vitrine de coaches agora.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[2560px] 3xl:px-12 4xl:px-24 space-y-6 px-3 pb-12 md:px-6">
      {/* Header HUD de Coaches */}
      <div className="dl-panel relative overflow-hidden p-[18px] mb-6 md:p-[28px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(168,85,247,0.14),transparent_20rem),linear-gradient(120deg,transparent,rgba(168,85,247,0.04),transparent)]" />
        <img
          src={ASSETS.icons.ranking}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-6 top-6 h-24 w-24 object-contain opacity-15"
        />
        <img
          src={ASSETS.icons.squad}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-32 hidden h-20 w-20 object-contain opacity-10 md:block"
        />
        <div className="relative z-[2]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="dl-hud-label" style={{ color: 'var(--dl-tactical-purple)', borderColor: 'rgba(168,85,247,0.34)', background: 'rgba(168,85,247,0.08)' }}>
              COACH NETWORK // ELITE TRAINING
            </span>
          </div>
          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            Aprenda com a{' '}
            <span className="text-[var(--dl-tactical-purple)] drop-shadow-[0_0_24px_rgba(168,85,247,0.3)]">
              Elite
            </span>
          </h1>
          <p className="dl-muted max-w-[600px] text-[14px] leading-[1.65]">
            Encontre treinadores e mentores de alto nível para melhorar seu jogo, ajustar sua mentalidade e subir de rank mais rápido.
          </p>
        </div>
      </div>

      <CoachesFilters
        search={search}
        game={game}
        availability={availability}
        onSearchChange={onSearchChange}
        onGameChange={onGameChange}
        onAvailabilityChange={onAvailabilityChange}
        onClear={onClearFilters}
      />

      {scheduleMessage ? (
        <div className="dl-panel border-[var(--dl-tactical-purple)] bg-[rgba(168,85,247,0.08)] p-4 text-center text-sm font-semibold text-white">
          {scheduleMessage}
        </div>
      ) : null}

      {filteredCoaches.length ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2 3xl:grid-cols-4 4xl:grid-cols-5">
          {filteredCoaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} onSchedule={onScheduleCoach} />
          ))}
        </div>
      ) : (
        <div className="dl-panel mx-auto flex w-full max-w-[2560px] 3xl:px-12 4xl:px-24 flex-col items-center justify-center py-16">
          <p className="mb-4 text-lg font-bold text-[var(--dl-tactical-muted)] font-['Rajdhani'] uppercase">Nenhum coach encontrado.</p>
          <p className="mb-6 text-sm text-[var(--dl-tactical-muted)]">Ajuste jogo, disponibilidade ou busca para ver novos resultados.</p>
          <button type="button" className="dl-btn" onClick={onClearFilters}>Limpar filtros</button>
        </div>
      )}
    </div>
  );
};
