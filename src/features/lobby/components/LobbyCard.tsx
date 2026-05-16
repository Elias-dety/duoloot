import React from 'react';
import { Avatar, Badge, Button, StatValue } from '@/components/atoms';
import { CompatibilityMeter } from '@/components/molecules';
import { Lobby } from '@/schemas/lobby.schema';

export interface LobbyCardProps {
  lobby: Lobby;
  onJoin?: (id: string) => void;
  isJoining?: boolean;
}

export const LobbyCard: React.FC<LobbyCardProps> = ({ lobby, onJoin, isJoining }) => {
  const openSlots = lobby.slotsTotal - lobby.slotsFilled;
  const isFull = lobby.status === 'full' || openSlots === 0;
  const isClosed = lobby.status === 'closed';
  const isRecommended = (lobby.compatibilityScore ?? 0) >= 85;

  const borderColor = isClosed || isFull
    ? 'rgba(255,51,102,0.2)'
    : isRecommended
    ? 'rgba(70,183,255,0.3)'
    : 'var(--dl-tactical-line)';

  const statusLabel = isClosed ? 'Fechado' : isFull ? 'Cheio' : lobby.status === 'open' ? 'Ativo' : 'Em jogo';
  const statusVariant = isClosed || isFull ? 'danger' : lobby.status === 'open' ? 'success' : 'info';

  return (
    <div
      className="dl-panel flex h-full flex-col gap-4 p-5 transition-all hover:translate-y-[-4px]"
      style={{ borderColor, opacity: isClosed ? 0.6 : 1 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={lobby.owner.avatarUrl} alt={lobby.owner.name} fallback={lobby.owner.name} />
          <div className="min-w-0">
            <h3 className="truncate font-['Rajdhani'] text-lg font-bold uppercase text-[var(--dl-tactical-text)]">{lobby.owner.name}'s Lobby</h3>
            <p className="truncate text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--dl-tactical-muted)]">{lobby.mode} / {lobby.queue}</p>
          </div>
        </div>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      {isRecommended && (
        <Badge variant="info" className="w-fit">Recomendado</Badge>
      )}

      {lobby.compatibilityScore && <CompatibilityMeter score={lobby.compatibilityScore} />}

      {/* Stats Grid */}
      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Rank" value={lobby.minRank} description={`até ${lobby.maxRank}`} />
        </div>
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Vagas" value={openSlots > 0 ? `${openSlots}/${lobby.slotsTotal}` : 'Lotado'} tone={isFull ? 'danger' : 'success'} />
        </div>
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Trust" value={`${lobby.owner.trustScore}%`} tone="success" />
        </div>
        <div className="border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] p-3 [clip-path:var(--dl-cut-button)]">
          <StatValue label="Fila" value={lobby.queue} tone="info" />
        </div>
      </div>

      {/* Action */}
      <div className="mt-auto border-t border-[var(--dl-tactical-line)] pt-4">
        <Button
          variant={isFull || isClosed ? 'secondary' : 'tactical-green'}
          className="w-full"
          disabled={isFull || isClosed || isJoining}
          onClick={() => onJoin && onJoin(lobby.id)}
        >
          {isJoining ? 'ENTRANDO...' : isClosed ? 'Fechado' : isFull ? 'Lobby cheio' : 'Entrar no Lobby'}
        </Button>
      </div>
    </div>
  );
};
