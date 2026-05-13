import React from 'react';
import { PageCardGridSkeleton, PageState } from '@/components/molecules';
import { Coach } from '@/schemas/coach.schema';
import { CoachCard } from '@/features/coaches/components/CoachCard';
import { CoachesFilters } from '@/features/coaches/components/CoachesFilters';
import { CoachesHero } from '@/features/coaches/components/CoachesHero';

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
}

export const CoachesTemplate: React.FC<CoachesTemplateProps> = ({
  coaches,
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
}) => {
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
        <PageState type="loading" loadingBlocks={2} className="max-w-none px-0 py-0" />
        <PageCardGridSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <PageState
        type="error"
        title="Erro ao carregar coaches"
        description="Nao foi possivel montar a vitrine de coaches agora."
        className="max-w-7xl"
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <CoachesHero
        totalCoaches={coaches.length}
        premiumCount={coaches.filter((coach) => coach.premiumOnly).length}
      />

      <CoachesFilters
        search={search}
        game={game}
        availability={availability}
        onSearchChange={onSearchChange}
        onGameChange={onGameChange}
        onAvailabilityChange={onAvailabilityChange}
        onClear={onClearFilters}
      />

      {filteredCoaches.length ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
          {filteredCoaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      ) : (
        <PageState
          type="empty"
          title="Nenhum coach encontrado"
          description="Ajuste jogo, disponibilidade ou busca para ver novos resultados."
          actionText="Limpar filtros"
          onAction={onClearFilters}
          className="max-w-7xl"
        />
      )}
    </div>
  );
};
