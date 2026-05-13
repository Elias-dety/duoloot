import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, SectionTitle } from '@/components/atoms';
import { mockLobbies } from '@/data/mocks/lobbies.mock';

export const RecommendedLobbies: React.FC = () => {
  const recommended = mockLobbies.slice(0, 2);

  return (
    <Card variant="default" className="flex h-full w-full flex-col">
      <SectionTitle title="Lobbies Recomendados" subtitle="Compatibilidade baseada no seu perfil" />

      <div className="mt-4 flex flex-1 flex-col gap-4">
        {recommended.map((lobby) => (
          <div key={lobby.id} className="flex flex-col gap-3 rounded-xl border border-border bg-surface-elevated p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-content-base">{lobby.mode}</p>
                <p className="text-sm text-content-muted">{lobby.minRank} a {lobby.maxRank}</p>
              </div>
              <Badge variant="success">{lobby.compatibilityScore}% Match</Badge>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-content-muted">{lobby.slotsTotal - lobby.slotsFilled} vagas</p>
              <Link to="/lobby">
                <Button variant="secondary" size="sm">Ver Lobby</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Link to="/lobby" className="block w-full text-center">
          <Button variant="primary" className="w-full">Procurar mais Lobbies</Button>
        </Link>
      </div>
    </Card>
  );
};
