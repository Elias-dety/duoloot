import React from 'react';
import { Button, Card, Input } from '@/components/atoms';
import { Search } from 'lucide-react';

export interface CoachesFiltersProps {
  search: string;
  game: string;
  availability: 'all' | 'available';
  onSearchChange: (value: string) => void;
  onGameChange: (value: string) => void;
  onAvailabilityChange: (value: 'all' | 'available') => void;
  onClear: () => void;
}

export const CoachesFilters: React.FC<CoachesFiltersProps> = ({
  search,
  game,
  availability,
  onSearchChange,
  onGameChange,
  onAvailabilityChange,
  onClear,
}) => {
  return (
    <Card variant="elevated" className="p-4 md:p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por coach, jogo ou especialidade"
            className="pl-10"
          />
        </div>

        <select
          value={game}
          onChange={(event) => onGameChange(event.target.value)}
          className="h-10 rounded-lg border border-border bg-surface-elevated px-3 text-sm text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <option value="all">Todos os jogos</option>
          <option value="Valorant">Valorant</option>
          <option value="CS2">CS2</option>
        </select>

        <Button
          variant={availability === 'available' ? 'primary' : 'outline'}
          onClick={() => onAvailabilityChange(availability === 'available' ? 'all' : 'available')}
        >
          {availability === 'available' ? 'So disponiveis' : 'Mostrar disponiveis'}
        </Button>

        <Button variant="ghost" onClick={onClear}>
          Limpar
        </Button>
      </div>
    </Card>
  );
};
