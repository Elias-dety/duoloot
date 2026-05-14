import React from 'react';
import { Input } from '@/components/atoms';

export const LobbyFilters: React.FC = () => {
  return (
    <div className="dl-panel flex flex-col items-end gap-4 p-4 md:flex-row" style={{ borderColor: 'rgba(70,183,255,0.2)' }}>
      <div className="w-full flex-1">
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dl-tactical-blue)]">
          Buscar lobby
        </label>
        <Input id="search-lobby" placeholder="Ex: Duelista imortal..." />
      </div>
      <div className="w-full md:w-48">
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--dl-tactical-blue)]">
          Rank mínimo
        </label>
        <Input id="rank-filter" placeholder="Qualquer" />
      </div>
      <div className="w-full md:w-auto">
        <button type="button" className="dl-btn h-10 w-full" style={{ color: 'var(--dl-tactical-blue)', borderColor: 'rgba(70,183,255,0.28)' }}>
          Filtros avançados
        </button>
      </div>
    </div>
  );
};
