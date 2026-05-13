import React from 'react';
import { SectionTitle, Badge, Button } from '@/components/atoms';
import { mockLobbies } from '@/data/mocks/lobbies.mock';
import { Link } from 'react-router-dom';

export const RecommendedLobbies: React.FC = () => {
  // Pegar 2 lobbies mockados
  const recommended = mockLobbies.slice(0, 2);

  return (
    <section className="w-full p-6 bg-surface-dark border border-surface-highlight rounded-2xl flex flex-col h-full">
      <SectionTitle title="Lobbies Recomendados" subtitle="Compatibilidade baseada no seu perfil" />
      
      <div className="mt-4 flex-1 flex flex-col gap-4">
        {recommended.map((lobby) => (
          <div key={lobby.id} className="p-4 bg-surface-base rounded-xl border border-surface-highlight/50 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-content-base">{lobby.mode}</p>
                <p className="text-sm text-content-muted">{lobby.minRank} a {lobby.maxRank}</p>
              </div>
              <Badge variant="success">{lobby.compatibilityScore}% Match</Badge>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-content-muted">{lobby.slotsTotal - lobby.slotsFilled} vagas</p>
              <Link to="/lobby">
                <Button variant="outline" size="sm">Ver Lobby</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Link to="/lobby" className="w-full text-center block">
          <Button variant="secondary" className="w-full">Procurar mais Lobbies</Button>
        </Link>
      </div>
    </section>
  );
};
