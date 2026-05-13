import React from 'react';
import { Coach } from '@/schemas/coach.schema';
import { CoachCard } from '@/features/coaches/components/CoachCard';
import { Button, Input } from '@/components/atoms';
import { Search, Filter } from 'lucide-react';

export interface CoachesTemplateProps {
  coaches: Coach[];
  isLoading?: boolean;
}

export const CoachesTemplate: React.FC<CoachesTemplateProps> = ({ coaches, isLoading }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-content-base mb-2">Treinadores Especializados</h1>
        <p className="text-content-muted">Aprenda com os melhores jogadores e suba de elo rapidamente.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
          <Input placeholder="Buscar por coach, jogo ou especialidade..." className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-surface-dark animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : coaches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coaches.map(coach => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-dark border border-surface-highlight rounded-2xl">
          <p className="text-content-muted">Nenhum coach encontrado com os filtros atuais.</p>
          <Button variant="outline" className="mt-4">Limpar Filtros</Button>
        </div>
      )}
    </div>
  );
};
