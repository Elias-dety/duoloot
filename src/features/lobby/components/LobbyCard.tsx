import React from 'react';
import { Avatar, Badge, Button, StatValue } from '@/components/atoms';
import { CompatibilityMeter } from '@/components/molecules';
import { Lobby } from '@/schemas/lobby.schema';

// Propriedades esperadas pelo componente LobbyCard
export interface LobbyCardProps {
  lobby: Lobby;             // Objeto contendo os dados do lobby (proprietário, vagas, modo, etc.)
  onJoin?: (id: string) => void; // Função de callback para quando o usuário clicar em "Entrar"
  isJoining?: boolean;      // Estado de carregamento da ação de entrar
}

/**
 * Componente funcional que renderiza um card tático para exibição de lobbies disponíveis.
 * Utiliza o design system 'Tactical Underground Loot' com bordas cortadas e estética HUD.
 */
export const LobbyCard: React.FC<LobbyCardProps> = ({ lobby, onJoin, isJoining }) => {
  // Lógica de cálculo de slots e estados do lobby
  const slotsTotal = Number(lobby.slotsTotal) || 0;
  const slotsFilled = Number(lobby.slotsFilled) || 0;
  const openSlots = Math.max(0, slotsTotal - slotsFilled);
  const isFull = lobby.status === 'full' || (slotsTotal > 0 && openSlots === 0);
  const isClosed = lobby.status === 'closed';
  const isRecommended = (lobby.compatibilityScore ?? 0) >= 85;

  // Fallbacks para dados faltantes
  const ownerName = lobby.owner?.name || 'Operador desconhecido';
  const lobbyMode = lobby.mode || 'Modo indefinido';
  const lobbyQueue = lobby.queue || 'Fila aberta';

  // Define a cor da borda com base no status e recomendação
  const borderColor = isClosed || isFull
    ? 'rgba(255,51,102,0.2)' // Rosa/Vermelho suave para estados inativos/cheios
    : isRecommended
    ? 'rgba(70,183,255,0.3)' // Azul para recomendados
    : 'var(--dl-tactical-line)';

  // Rótulos dinâmicos de status
  const statusLabel = isClosed ? 'Fechado' : isFull ? 'Cheio' : lobby.status === 'open' ? 'Ativo' : 'Em jogo';
  const statusVariant = isClosed || isFull ? 'danger' : lobby.status === 'open' ? 'success' : 'info';

  return (
    <div
      className="dl-panel flex h-full flex-col gap-4 p-5 transition-all hover:translate-y-[-4px]"
      style={{ borderColor, opacity: isClosed ? 0.6 : 1 }}
    >
      {/* Header do Card: Avatar, Nome do Dono e Badge de Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={lobby.owner?.avatarUrl} alt={ownerName} fallback={ownerName} />
          <div className="min-w-0">
            <h3 className="truncate font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-tactical-text)]">{ownerName}</h3>
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--dl-tactical-muted)]">{lobbyMode} / {lobbyQueue}</p>
          </div>
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      {/* Indicador de Recomendação IA (baseado em compatibilidade) */}
      {isRecommended && (
        <Badge variant="info" className="w-fit">Recomendado</Badge>
      )}

      {/* Medidor de Compatibilidade Tática */}
      {lobby.compatibilityScore !== undefined && <CompatibilityMeter score={lobby.compatibilityScore} />}

      {/* Grade de Estatísticas e Requisitos (Rank, Vagas, Confiança) */}
      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Rank" value={lobby.minRank || 'Livre'} description={`até ${lobby.maxRank || 'Livre'}`} />
        </div>
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Vagas" value={slotsTotal > 0 && openSlots > 0 ? `${openSlots}/${slotsTotal}` : 'Lotado'} tone={isFull ? 'danger' : 'success'} />
        </div>
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Trust" value={`${lobby.owner?.trustScore || 0}%`} tone="success" />
        </div>
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Fila" value={lobbyQueue} tone="info" />
        </div>
      </div>

      {/* Ação Principal: Botão para ingressar no Lobby */}
      <div className="mt-auto border-t border-[var(--dl-tactical-line)] pt-4">
        <Button
          variant={isFull || isClosed ? 'secondary' : 'tactical-green'}
          className="w-full"
          disabled={isFull || isClosed || isJoining}
          onClick={() => onJoin && onJoin(lobby.id)}
        >
          {isJoining ? 'SINCRONIZANDO...' : isClosed ? 'Fechado' : isFull ? 'Lobby cheio' : 'Entrar no Lobby'}
        </Button>
      </div>
    </div>
  );
};

