import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms';
import { VaultEvent } from '@/features/vault/vault.schema';
import { ASSETS } from '@/constants/assets';
import { ROUTES } from '@/constants/routes';

interface VaultJoinPanelProps {
  event: VaultEvent;
  isJoining: boolean;
  onJoin: () => void;
  isLoggedIn: boolean;
  participantCount: number;
}

export const VaultJoinPanel: React.FC<VaultJoinPanelProps> = ({
  event,
  isJoining,
  onJoin,
  isLoggedIn,
  participantCount,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleAction = () => {
    if (!isLoggedIn) {
      navigate(ROUTES.LOGIN, { state: { from: location } });
      return;
    }

    onJoin();
  };

  return (
    <div className="dl-panel flex flex-col items-center gap-4 p-6 sm:flex-row">
      <img
        src={ASSETS.icons.vault}
        alt="Icone de cofre fechado do Duo Loot"
        loading="lazy"
        decoding="async"
        className="h-24 w-24 shrink-0 object-contain"
      />
      <div className="flex-1 text-center sm:text-left">
        <span className="font-['Rajdhani'] text-xl font-bold uppercase text-white">
          Evento ativo: {event.title}
        </span>
        <p className="mt-1 text-[13px] text-[var(--dl-muted-light)]">
          {isLoggedIn
            ? 'Você ainda não está participando deste Vault. Entre agora para começar a acumular pontos.'
            : 'Faça login para participar deste Vault e disputar as próximas recompensas.'}
        </p>
        <div className="mt-2 text-[11px] uppercase tracking-wide text-[var(--dl-muted-light)]">
          <span className="font-bold text-white">{participantCount}</span> players ativos no evento
        </div>
      </div>
      <Button
        variant="primary"
        className="w-full shrink-0 sm:w-auto"
        onClick={handleAction}
        disabled={isJoining}
      >
        {isJoining ? 'Processando...' : isLoggedIn ? 'Entrar no Vault' : 'Login para participar'}
      </Button>
    </div>
  );
};
