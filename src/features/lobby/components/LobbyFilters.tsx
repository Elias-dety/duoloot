import React from 'react';

import { DuolootButton } from '@/components/duoloot';
import { ASSETS } from '@/constants/assets';

export interface LobbyFilterState {
  search: string;
  game: string;
  rank: string;
  region: string;
  microphone: string;
}

export interface LobbyFiltersProps {
  filters: LobbyFilterState;
  onFiltersChange: (newFilters: LobbyFilterState) => void;
  onClearFilters: () => void;
}

export const LobbyFilters: React.FC<LobbyFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleChange = (key: keyof LobbyFilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.game !== 'all' ||
    filters.rank !== 'all' ||
    filters.region !== 'all' ||
    filters.microphone !== 'all';

  const fieldClassName = 'w-full rounded-2xl border border-[var(--dl-border)] bg-[var(--dl-surface)] px-3 py-2.5 text-sm text-[var(--dl-text)] focus:border-[var(--dl-keyword)] focus:outline-none';
  const labelClassName = 'mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]';

  return (
    <div className="dl-panel flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--dl-border)]/40 pb-4">
        <img src={ASSETS.icons.filter} alt="" aria-hidden="true" className="h-8 w-8 object-contain" />
        <span className="font-['Rajdhani'] text-lg font-bold uppercase text-white">Filtros de matchmaking</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="flex flex-col">
          <label className={labelClassName}>Buscar player</label>
          <input
            type="text"
            className={fieldClassName}
            placeholder="Ex: Jett, controller..."
            value={filters.search}
            onChange={(event) => handleChange('search', event.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className={labelClassName}>Jogo principal</label>
          <select className={fieldClassName} value={filters.game} onChange={(event) => handleChange('game', event.target.value)}>
            <option value="all">Todos os jogos</option>
            <option value="valorant">Valorant</option>
            <option value="league of legends">League of Legends</option>
            <option value="counter-strike 2">Counter-Strike 2</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className={labelClassName}>Patente / rank</label>
          <select className={fieldClassName} value={filters.rank} onChange={(event) => handleChange('rank', event.target.value)}>
            <option value="all">Qualquer rank</option>
            <option value="ferro">Ferro</option>
            <option value="bronze">Bronze</option>
            <option value="prata">Prata</option>
            <option value="ouro">Ouro</option>
            <option value="platina">Platina</option>
            <option value="diamante">Diamante</option>
            <option value="ascendente">Ascendente</option>
            <option value="imortal">Imortal</option>
            <option value="radiante">Radiante</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className={labelClassName}>Região</label>
          <select className={fieldClassName} value={filters.region} onChange={(event) => handleChange('region', event.target.value)}>
            <option value="all">Todas as regiões</option>
            <option value="BR">Brasil (BR)</option>
            <option value="NA">América do Norte (NA)</option>
            <option value="EU">Europa (EU)</option>
            <option value="LATAM">Latam</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className={labelClassName}>Requisito de mic</label>
          <select className={fieldClassName} value={filters.microphone} onChange={(event) => handleChange('microphone', event.target.value)}>
            <option value="all">Qualquer estado</option>
            <option value="yes">Microfone requerido</option>
            <option value="no">Sem exigência</option>
          </select>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="mt-2 flex border-t border-[var(--dl-border)]/40 pt-4">
          <DuolootButton type="button" onClick={onClearFilters} variant="secondary" className="w-full sm:ml-auto sm:w-auto">
            Limpar filtros
          </DuolootButton>
        </div>
      ) : null}
    </div>
  );
};
