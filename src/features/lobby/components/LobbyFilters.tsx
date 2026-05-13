import React from 'react';
import { Button, Card, Input } from '@/components/atoms';

export const LobbyFilters: React.FC = () => {
  return (
    <Card variant="elevated" className="flex flex-col items-end gap-4 p-4 md:flex-row">
      <div className="w-full flex-1">
        <label className="mb-1.5 block text-sm font-medium text-content-muted">Buscar Lobby</label>
        <Input id="search-lobby" placeholder="Ex: Duelista imortal..." />
      </div>
      <div className="w-full md:w-48">
        <label className="mb-1.5 block text-sm font-medium text-content-muted">Rank minimo</label>
        <Input id="rank-filter" placeholder="Qualquer" />
      </div>
      <div className="w-full md:w-auto">
        <Button variant="outline" className="h-10 w-full">
          Filtros avancados
        </Button>
      </div>
    </Card>
  );
};
