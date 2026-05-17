import React from 'react';

export interface LobbyFilterState {
  search: string;
  game: string;
  rank: string;
  region: string;
  microphone: string; // 'all' | 'yes' | 'no'
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

  return (
    <div 
      className="dl-panel flex flex-col gap-4 p-5" 
      style={{ borderColor: 'rgba(70,183,255,0.2)' }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Busca por texto */}
        <div className="flex flex-col">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dl-tactical-blue)]">
            Buscar Operador
          </label>
          <input
            type="text"
            className="dl-input w-full h-10 px-3 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-sm text-[var(--dl-tactical-text)] focus:outline-none focus:border-[var(--dl-tactical-blue)] font-['Rajdhani'] uppercase font-bold"
            placeholder="Ex: Jett, Neon..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* Jogo */}
        <div className="flex flex-col">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dl-tactical-blue)]">
            Jogo Principal
          </label>
          <select
            className="dl-input w-full h-10 px-3 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-sm text-[var(--dl-tactical-text)] focus:outline-none focus:border-[var(--dl-tactical-blue)] font-['Rajdhani'] uppercase font-bold cursor-pointer"
            value={filters.game}
            onChange={(e) => handleChange('game', e.target.value)}
          >
            <option value="all">TODOS OS JOGOS</option>
            <option value="valorant">VALORANT</option>
            <option value="league of legends">LEAGUE OF LEGENDS</option>
            <option value="counter-strike 2">COUNTER-STRIKE 2</option>
          </select>
        </div>

        {/* Rank */}
        <div className="flex flex-col">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dl-tactical-blue)]">
            Patente / Rank
          </label>
          <select
            className="dl-input w-full h-10 px-3 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-sm text-[var(--dl-tactical-text)] focus:outline-none focus:border-[var(--dl-tactical-blue)] font-['Rajdhani'] uppercase font-bold cursor-pointer"
            value={filters.rank}
            onChange={(e) => handleChange('rank', e.target.value)}
          >
            <option value="all">QUALQUER RANK</option>
            <option value="ferro">FERRO</option>
            <option value="bronze">BRONZE</option>
            <option value="prata">PRATA</option>
            <option value="ouro">OURO</option>
            <option value="platina">PLATINA</option>
            <option value="diamante">DIAMANTE</option>
            <option value="ascendente">ASCENDENTE</option>
            <option value="imortal">IMORTAL</option>
            <option value="radiante">RADIANTE</option>
          </select>
        </div>

        {/* Região */}
        <div className="flex flex-col">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dl-tactical-blue)]">
            Região
          </label>
          <select
            className="dl-input w-full h-10 px-3 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-sm text-[var(--dl-tactical-text)] focus:outline-none focus:border-[var(--dl-tactical-blue)] font-['Rajdhani'] uppercase font-bold cursor-pointer"
            value={filters.region}
            onChange={(e) => handleChange('region', e.target.value)}
          >
            <option value="all">TODAS REGIÕES</option>
            <option value="BR">BRASIL (BR)</option>
            <option value="NA">AMÉRICA DO NORTE (NA)</option>
            <option value="EU">EUROPA (EU)</option>
            <option value="LATAM">LATINO AMÉRICA (LATAM)</option>
          </select>
        </div>

        {/* Microfone */}
        <div className="flex flex-col">
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dl-tactical-blue)]">
            Requisito de Mic
          </label>
          <select
            className="dl-input w-full h-10 px-3 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-sm text-[var(--dl-tactical-text)] focus:outline-none focus:border-[var(--dl-tactical-blue)] font-['Rajdhani'] uppercase font-bold cursor-pointer"
            value={filters.microphone}
            onChange={(e) => handleChange('microphone', e.target.value)}
          >
            <option value="all">QUALQUER ESTADO</option>
            <option value="yes">MICROFONE REQUERIDO</option>
            <option value="no">SEM EXIGÊNCIA</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end border-t border-[var(--dl-tactical-line)]/40 pt-4 mt-2">
          <button
            type="button"
            onClick={onClearFilters}
            className="dl-btn h-10 px-6 font-['Rajdhani'] uppercase font-bold text-xs"
            style={{ color: 'var(--dl-tactical-red)', borderColor: 'rgba(255, 51, 102, 0.4)' }}
          >
            // ZERAR PARÂMETROS DE BUSCA
          </button>
        </div>
      )}
    </div>
  );
};
