import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Player } from '@/schemas/player.schema';

export interface QuickActionsPanelProps {
  player: Player | null;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ player }) => {
  const navigate = useNavigate();

  return (
    <article className="dl-panel flex h-full w-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-6">
        <h3 className="dl-hud-label mb-2"><span className="text-[var(--dl-string)]">■</span> Ações Rápidas</h3>
        <p className="text-[13px] text-[var(--dl-tactical-muted)]">Navegação central</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button
          onClick={() => {
            if (player?.id) {
              navigate(ROUTES.PLAYER_PROFILE.replace(':playerId', player.id));
            }
          }}
          className="dl-btn dl-btn-outline w-full justify-center text-[12px]"
          disabled={!player?.id}
        >
          Ver Perfil
        </button>

        <Link to={ROUTES.LOBBY} className="w-full">
          <button className="dl-btn dl-btn-outline w-full justify-center text-[12px] text-[var(--dl-string)] border-[var(--dl-string)]">
            Encontrar Duo
          </button>
        </Link>

        <Link to={ROUTES.PREMIUM} className="w-full">
          <button className="dl-btn dl-btn-outline w-full justify-center text-[12px] text-[var(--dl-keyword)] border-[var(--dl-keyword)]">
            Ver Premium
          </button>
        </Link>

        <Link to={ROUTES.VAULT} className="w-full">
          <button className="dl-btn dl-btn-outline w-full justify-center text-[12px] text-[var(--dl-tactical-yellow)] border-[var(--dl-tactical-yellow)]">
            Abrir Vault
          </button>
        </Link>

        <Link to={ROUTES.ONBOARDING} className="w-full col-span-2">
          <button className="dl-btn dl-btn-outline w-full justify-center text-[12px]">
            Editar Perfil
          </button>
        </Link>
      </div>
    </article>
  );
};
