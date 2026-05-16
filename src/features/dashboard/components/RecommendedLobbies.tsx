import React from 'react';
import { Link } from 'react-router-dom';

import { mockLobbies } from '@/data/mocks/lobbies.mock';

export const RecommendedLobbies: React.FC = () => {
  const recommended = mockLobbies.slice(0, 2);

  return (
    <article className="dl-panel flex h-full w-full flex-col p-6">
      <div className="mb-6">
        <h3 className="dl-hud-label mb-2"><span className="text-[var(--dl-tactical-green)]">■</span> Lobbies Recomendados</h3>
        <p className="text-[13px] text-[var(--dl-tactical-muted)]">Compatibilidade baseada no seu perfil</p>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-4">
        {recommended.map((lobby) => (
          <div key={lobby.id} className="flex flex-col gap-3 border border-[var(--dl-tactical-line)] bg-white/[0.02] p-4 [clip-path:var(--dl-cut-button)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-[13px] uppercase tracking-wide text-white">{lobby.mode}</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--dl-tactical-muted)]">{lobby.minRank} a {lobby.maxRank}</p>
              </div>
              <span className="dl-stamp dl-stamp-green">{lobby.compatibilityScore}% Match</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--dl-tactical-muted)]">{lobby.slotsTotal - lobby.slotsFilled} vagas</p>
              <Link to="/lobby">
                <button type="button" className="dl-btn h-8 px-4 text-[11px]">Ver Lobby</button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Link to="/lobby" className="block w-full text-center">
          <button type="button" className="dl-btn dl-btn-green w-full">Procurar mais Lobbies</button>
        </Link>
      </div>
    </article>
  );
};
