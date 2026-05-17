import React from 'react';
import { Button } from '@/components/atoms';
import { VaultEvent } from '@/features/vault/vault.schema';

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
  return (
    <div className="dl-panel flex flex-col items-center gap-4 p-6 sm:flex-row" style={{ borderColor: 'rgba(255,226,102,0.25)' }}>
      <div className="flex-1 text-center sm:text-left">
        <span className="text-[var(--dl-tactical-yellow)] font-bold text-[14px] font-['Rajdhani'] uppercase">
          OPERAÇÃO ATIVA: {event.title}
        </span>
        <p className="mt-1 text-[13px] text-[var(--dl-tactical-muted)]">
          {isLoggedIn 
            ? 'Você ainda não está participando deste Cofre. Junte-se agora para acumular pontos.' 
            : 'Faça login para se inscrever neste Cofre e concorrer às recompensas.'}
        </p>
        <div className="mt-2 text-[11px] uppercase tracking-wide text-white/50">
          <span className="font-bold text-white">{participantCount}</span> operadores na operação
        </div>
      </div>
      <Button 
        variant="primary" 
        className="w-full shrink-0 sm:w-auto dl-btn-yellow"
        onClick={onJoin}
        disabled={isJoining}
      >
        {isJoining ? 'Processando...' : isLoggedIn ? 'Participar Agora' : 'Entrar para Participar'}
      </Button>
    </div>
  );
};
