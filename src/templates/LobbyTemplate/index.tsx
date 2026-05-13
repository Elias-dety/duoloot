import React from 'react';
import { Button } from '@/components/atoms';
import { LobbyGrid } from '@/components/organisms/LobbyGrid';
import { LobbyFilters } from '@/features/lobby/components/LobbyFilters';
import { LobbyActionsBar } from '@/features/lobby/components/LobbyActionsBar';
import { Lobby } from '@/schemas/lobby.schema';

export interface LobbyTemplateProps {
  lobbies: Lobby[];
  isLoading: boolean;
  isError: boolean;
}

export const LobbyTemplate: React.FC<LobbyTemplateProps> = ({ lobbies, isLoading, isError }) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <section className="bg-surface-dark border border-surface-highlight rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-content-primary mb-4 tracking-tight">Encontre seu Duo Ideal</h1>
          <p className="text-content-secondary max-w-xl text-lg">Junte-se a jogadores compatíveis, suba de rank e conquiste prêmios. A confiança e a compatibilidade vêm em primeiro lugar.</p>
        </div>
        <div className="w-full md:w-auto">
          <Button size="lg" variant="primary" className="w-full md:w-auto">Ver Meu Perfil</Button>
        </div>
      </section>

      {/* Filters */}
      <section>
        <LobbyFilters />
      </section>

      {/* Actions and Grid */}
      <section>
        <LobbyActionsBar totalLobbies={lobbies.length} />
        
        {isError ? (
          <div className="w-full py-16 flex flex-col items-center justify-center bg-danger/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 font-bold mb-4 text-lg">Erro ao carregar os lobbies.</p>
            <Button variant="outline">Tentar Novamente</Button>
          </div>
        ) : (
          <LobbyGrid items={lobbies} isLoading={isLoading} />
        )}
      </section>
    </div>
  );
};
