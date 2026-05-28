import React from 'react';

import { Button } from '@/components/atoms';
import { ASSETS } from '@/constants/assets';

interface LobbyFilterState {
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

  const fieldClassName = 'w-full rounded-2xl border border-white/[0.08] bg-black/20 px-3 py-2.5 text-sm text-[var(--dl-text)] transition-colors placeholder:text-[var(--dl-muted)] focus:border-[var(--dl-number)] focus:outline-none';
  const labelClassName = 'mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]';

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--dl-number)]/25 bg-[var(--dl-number)]/10">
            <img src={ASSETS.icons.filter} alt="" aria-hidden="true" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <span className="block text-lg font-bold uppercase tracking-[-0.01em] text-white">
              Filtros de matchmaking
            </span>
            <span className="font-['Inter'] text-[0.72rem] text-[var(--dl-muted)]">
              Refine por perfil, região e comunicação.
            </span>
          </div>
        </div>

        {hasActiveFilters ? (
          <Button type="button" onClick={onClearFilters} variant="secondary" size="sm">
            Limpar filtros
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-5">
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
    </div>
  );
};
