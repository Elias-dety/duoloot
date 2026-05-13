import React from 'react';
import { Button, Card } from '@/components/atoms';
import { LobbyGrid } from '@/components/organisms/LobbyGrid';
import { LobbyActionsBar } from '@/features/lobby/components/LobbyActionsBar';
import { LobbyFilters } from '@/features/lobby/components/LobbyFilters';
import { Lobby } from '@/schemas/lobby.schema';

export interface LobbyTemplateProps {
  lobbies: Lobby[];
  isLoading: boolean;
  isError: boolean;
}

export const LobbyTemplate: React.FC<LobbyTemplateProps> = ({ lobbies, isLoading, isError }) => {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-12 animate-fade-in">
      <Card variant="default" className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:p-10 md:text-left">
        <div className="flex-1">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-content-primary md:text-4xl">Encontre seu Duo Ideal</h1>
          <p className="max-w-xl text-lg text-content-secondary">
            Junte-se a jogadores compativeis, suba de rank e conquiste premios. A confianca e a
            compatibilidade vem em primeiro lugar.
          </p>
        </div>
        <div className="w-full md:w-auto">
          <Button size="lg" variant="primary" className="w-full md:w-auto">
            Ver Meu Perfil
          </Button>
        </div>
      </Card>

      <section>
        <LobbyFilters />
      </section>

      <section>
        <LobbyActionsBar totalLobbies={lobbies.length} />

        {isError ? (
          <Card variant="danger" className="flex w-full flex-col items-center justify-center py-16">
            <p className="mb-4 text-lg font-bold text-danger">Erro ao carregar os lobbies.</p>
            <Button variant="secondary">Tentar Novamente</Button>
          </Card>
        ) : (
          <LobbyGrid items={lobbies} isLoading={isLoading} />
        )}
      </section>
    </div>
  );
};
