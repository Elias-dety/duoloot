import React from 'react';
import { LobbyGrid } from '@/components/organisms/LobbyGrid';
import { LobbyActionsBar } from '@/features/lobby/components/LobbyActionsBar';
import { LobbyFilters } from '@/features/lobby/components/LobbyFilters';
import { Lobby } from '@/schemas/lobby.schema';

export interface LobbyTemplateProps {
  lobbies: Lobby[];
  isLoading: boolean;
  isError: boolean;
  onJoinLobby?: (id: string) => void;
  onCreateTestLobby?: () => void;
  isCreating?: boolean;
  joiningLobbyId?: string | null;
  errorMessage?: string | null;
}

export const LobbyTemplate: React.FC<LobbyTemplateProps> = ({ 
  lobbies, 
  isLoading, 
  isError,
  onJoinLobby,
  onCreateTestLobby,
  isCreating,
  joiningLobbyId,
  errorMessage
}) => {
  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 md:px-6">
      {/* Header HUD */}
      <div className="dl-panel relative overflow-hidden p-[18px] md:p-[28px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(70,183,255,0.14),transparent_20rem),linear-gradient(120deg,transparent,rgba(70,183,255,0.04),transparent)]" />

        <div className="relative z-[2]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="dl-hud-label" style={{ color: 'var(--dl-tactical-blue)', borderColor: 'rgba(70,183,255,0.34)', background: 'rgba(70,183,255,0.08)' }}>
                LOBBY RADAR // MATCHMAKING NODE
              </span>
              <span className="dl-stamp" style={{ color: 'var(--dl-tactical-blue)', borderColor: 'rgba(70,183,255,0.3)', background: 'rgba(70,183,255,0.07)' }}>
                {lobbies.length} contratos
              </span>
            </div>
            
            {onCreateTestLobby && import.meta.env.DEV && (
              <button 
                onClick={onCreateTestLobby}
                disabled={isCreating}
                className="dl-btn text-[10px] py-1 px-3 border-[var(--dl-tactical-yellow)]/50 text-[var(--dl-tactical-yellow)]"
              >
                {isCreating ? 'PROCESSANDO...' : 'DEV: criar lobby'}
              </button>
            )}
          </div>

          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            Encontre seu{' '}
            <span className="text-[var(--dl-tactical-blue)] drop-shadow-[0_0_24px_rgba(70,183,255,0.3)]">
              duo ideal
            </span>
          </h1>
          <p className="dl-muted max-w-[600px] text-[14px] leading-[1.65]">
            Junte-se a jogadores compatíveis, suba de rank e conquiste prêmios.
            A confiança e a compatibilidade vêm em primeiro lugar.
          </p>
        </div>
      </div>

      {/* Alerta de Erro */}
      {errorMessage && (
        <div className="dl-panel border-[var(--dl-tactical-red)] bg-[rgba(255,51,102,0.05)] p-4 flex items-center gap-4">
          <div className="h-10 w-1 bg-[var(--dl-tactical-red)] rounded-full animate-pulse" />
          <div className="flex-1">
            <h4 className="text-[var(--dl-tactical-red)] font-['Rajdhani'] font-bold text-[14px] uppercase tracking-wider mb-1">
              SISTEMA // ALERTA
            </h4>
            <p className="text-white/80 font-['Rajdhani'] text-[13px] uppercase">
              {errorMessage}
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="dl-btn py-1 px-3 text-[10px] border-[var(--dl-tactical-red)]/50 text-[var(--dl-tactical-red)]"
          >
            RECONECTAR
          </button>
        </div>
      )}

      {/* Filtros Console */}
      <section>
        <LobbyFilters />
      </section>

      {/* Grid de Lobbies */}
      <section>
        <LobbyActionsBar totalLobbies={lobbies.length} />

        {isError ? (
          <div className="dl-panel flex w-full flex-col items-center justify-center py-16" style={{ borderColor: 'rgba(255,51,102,0.3)' }}>
            <p className="mb-4 text-lg font-bold text-[var(--dl-tactical-red)] font-['Rajdhani'] uppercase">Erro ao carregar os lobbies.</p>
            <button 
              type="button" 
              className="dl-btn"
              onClick={() => window.location.reload()}
            >
              Tentar Novamente
            </button>
          </div>
        ) : (
          <LobbyGrid 
            items={lobbies} 
            isLoading={isLoading} 
            onJoinLobby={onJoinLobby}
            joiningLobbyId={joiningLobbyId}
          />
        )}
      </section>
    </div>
  );
};
