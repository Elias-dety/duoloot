import React from 'react';
import { Input, Button } from '@/components/atoms';

export const LobbyFilters: React.FC = () => {
  return (
    <div className="bg-surface-dark border border-surface-highlight rounded-xl p-4 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Buscar Lobby</label>
        <Input 
          id="search-lobby" 
          placeholder="Ex: Duelista imortal..." 
        />
      </div>
      <div className="w-full md:w-48">
        <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Rank Mínimo</label>
        <Input 
          id="rank-filter" 
          placeholder="Qualquer" 
        />
      </div>
      <div className="w-full md:w-auto">
        <Button variant="outline" className="w-full h-10">Filtros Avançados</Button>
      </div>
    </div>
  );
};
