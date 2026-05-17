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

  // Obter game profile ou metadados
  const gp = lobby.owner?.gameProfile || lobby.metadata || {};
  const hasProfile = !!(gp.mainGame || gp.nickname || gp.currentRank || gp.mainRole);

  const mainGameVal = String(gp.mainGame || lobby.metadata?.mainGame || '---');
  const currentRankVal = String(gp.currentRank || gp.rank || lobby.metadata?.currentRank || lobby.minRank || '---');
  const mainRoleVal = String(gp.mainRole || lobby.metadata?.mainRole || '---');
  const playStyleVal = String(gp.playStyle || lobby.metadata?.playStyle || '---');
  const micVal = (gp.microphone !== undefined ? gp.microphone : lobby.metadata?.microphone) ? 'SIM' : 'NÃO';
  const regionVal = String(gp.region || lobby.metadata?.region || '---');

  // Define a cor da borda com base no status e recomendação
  const borderColor = isClosed || isFull
    ? 'rgba(255,51,102,0.2)' 
    : isRecommended
    ? 'rgba(70,183,255,0.3)' 
    : 'var(--dl-tactical-line)';

  // Rótulos dinâmicos de status
  const statusLabel = isClosed ? 'Fechado' : isFull ? 'Cheio' : lobby.status === 'open' ? 'Ativo' : 'Em jogo';
  const statusVariant = isClosed || isFull ? 'danger' : lobby.status === 'open' ? 'success' : 'info';

  const getCompatibilityDetails = (score: number) => {
    if (score >= 85) {
      return {
        label: 'Match ideal',
        color: 'text-[var(--dl-tactical-green)] border-[var(--dl-tactical-green)] bg-[var(--dl-tactical-green)]/10',
      };
    }
    if (score >= 65) {
      return {
        label: 'Compatível',
        color: 'text-[#46b7ff] border-[#46b7ff] bg-[#46b7ff]/10',
      };
    }
    if (score >= 40) {
      return {
        label: 'Neutro',
        color: 'text-[#f2c94c] border-[#f2c94c] bg-[#f2c94c]/10',
      };
    }
    return {
      label: 'Risco de baixa sinergia',
      color: 'text-[var(--dl-tactical-red)] border-[var(--dl-tactical-red)] bg-[var(--dl-tactical-red)]/10',
    };
  };

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

      {/* Indicador de Recomendação IA */}
      {isRecommended && (
        <Badge variant="info" className="w-fit">Recomendado</Badge>
      )}

      {/* Medidor de Compatibilidade Tática e Resumo */}
      {lobby.compatibilityScore !== undefined && (
        <div className="space-y-1.5">
          <CompatibilityMeter score={lobby.compatibilityScore} />
          {(() => {
            const comp = getCompatibilityDetails(lobby.compatibilityScore);
            return (
              <div className={`px-2 py-1 border text-[10px] font-bold uppercase tracking-wider text-center rounded-sm ${comp.color}`}>
                {comp.label} ({lobby.compatibilityScore}%)
              </div>
            );
          })()}
        </div>
      )}

      {/* Contract Specs Grid */}
      <div className="border-t border-b border-[var(--dl-tactical-line)] py-3 my-1 space-y-2">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-tactical-muted)]">
          // ESPECIFICAÇÕES DO CONTRATO
        </div>
        {!hasProfile ? (
          <div className="text-xs font-semibold text-[var(--dl-tactical-muted)] uppercase tracking-wider italic">
            [ Perfil Incompleto ]
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-1 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)]/50 rounded-sm">
              <span className="text-[9px] font-bold text-[var(--dl-tactical-muted)]">GAME</span>
              <span className="font-bold text-[var(--dl-tactical-text)] uppercase">{mainGameVal}</span>
            </div>
            <div className="flex items-center justify-between p-1 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)]/50 rounded-sm">
              <span className="text-[9px] font-bold text-[var(--dl-tactical-muted)]">RANK</span>
              <span className="font-bold text-[var(--dl-tactical-green)] uppercase">{currentRankVal}</span>
            </div>
            <div className="flex items-center justify-between p-1 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)]/50 rounded-sm">
              <span className="text-[9px] font-bold text-[var(--dl-tactical-muted)]">ROLE</span>
              <span className="font-bold text-[var(--dl-tactical-text)] uppercase">{mainRoleVal}</span>
            </div>
            <div className="flex items-center justify-between p-1 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)]/50 rounded-sm">
              <span className="text-[9px] font-bold text-[var(--dl-tactical-muted)]">STYLE</span>
              <span className="font-bold text-[var(--dl-tactical-text)] uppercase">{playStyleVal}</span>
            </div>
            <div className="flex items-center justify-between p-1 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)]/50 rounded-sm">
              <span className="text-[9px] font-bold text-[var(--dl-tactical-muted)]">MIC</span>
              <span className={`font-bold uppercase ${micVal === 'SIM' ? 'text-[var(--dl-tactical-green)]' : 'text-[var(--dl-tactical-muted)]'}`}>
                {micVal}
              </span>
            </div>
            <div className="flex items-center justify-between p-1 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)]/50 rounded-sm">
              <span className="text-[9px] font-bold text-[var(--dl-tactical-muted)]">REGION</span>
              <span className="font-bold text-[var(--dl-tactical-text)] uppercase">{regionVal}</span>
            </div>
          </div>
        )}
      </div>

      {/* Grade de Estatísticas e Requisitos (Rank, Vagas, Confiança) */}
      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Rank Min" value={lobby.minRank || 'Livre'} description={`até ${lobby.maxRank || 'Livre'}`} />
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

