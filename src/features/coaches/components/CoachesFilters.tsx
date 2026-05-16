import React from 'react';

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
    <div className="dl-panel p-[18px] mb-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dl-tactical-muted)]" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por coach, jogo ou especialidade"
            className="dl-search-input pl-10 w-full"
          />
        </div>

        <select
          value={game}
          onChange={(event) => onGameChange(event.target.value)}
          className="dl-search-input h-full min-h-[48px] w-full"
        >
          <option value="all">Todos os jogos</option>
          <option value="Valorant">Valorant</option>
          <option value="CS2">CS2</option>
        </select>

        <button
          type="button"
          className={`dl-btn ${availability === 'available' ? 'dl-btn-purple' : 'opacity-70 border border-[var(--dl-tactical-purple)]'}`}
          onClick={() => onAvailabilityChange(availability === 'available' ? 'all' : 'available')}
        >
          {availability === 'available' ? 'Só disponíveis' : 'Mostrar disponíveis'}
        </button>

        <button type="button" className="dl-btn opacity-50 hover:opacity-100" onClick={onClear}>
          Limpar
        </button>
      </div>
    </div>
  );
};
