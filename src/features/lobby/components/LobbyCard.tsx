import React from 'react';
import { Avatar, Badge, Button, Card, StatValue } from '@/components/atoms';
import { CompatibilityMeter } from '@/components/molecules';
import { Lobby } from '@/schemas/lobby.schema';

export interface LobbyCardProps {
  lobby: Lobby;
  onJoin?: (id: string) => void;
}

export const LobbyCard: React.FC<LobbyCardProps> = ({ lobby, onJoin }) => {
  const openSlots = lobby.slotsTotal - lobby.slotsFilled;
  const isFull = lobby.status === 'full' || openSlots === 0;
  const isClosed = lobby.status === 'closed';
  const isRecommended = (lobby.compatibilityScore ?? 0) >= 85;

  const cardVariant = isFull || isClosed ? 'locked' : isRecommended ? 'interactive' : 'default';
  const statusVariant = isClosed || isFull ? 'danger' : lobby.status === 'open' ? 'success' : 'info';

  return (
    <Card variant={cardVariant} className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={lobby.owner.avatarUrl} alt={lobby.owner.name} fallback={lobby.owner.name} />
          <div className="min-w-0">
            <h3 className="truncate text-lg font-black text-content-primary">{lobby.owner.name}'s Lobby</h3>
            <p className="truncate text-xs text-content-muted">{lobby.mode} / {lobby.queue}</p>
          </div>
        </div>
        <Badge variant={statusVariant}>{isClosed ? 'Fechado' : isFull ? 'Cheio' : lobby.status === 'open' ? 'Ativo' : 'Em jogo'}</Badge>
      </div>

      {isRecommended && <Badge variant="default" className="w-fit">Recomendado</Badge>}

      {lobby.compatibilityScore && <CompatibilityMeter score={lobby.compatibilityScore} />}

      <div className="grid flex-1 grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface-elevated p-3">
          <StatValue label="Rank" value={lobby.minRank} description={`ate ${lobby.maxRank}`} />
        </div>
        <div className="rounded-xl border border-border bg-surface-elevated p-3">
          <StatValue label="Vagas" value={openSlots > 0 ? `${openSlots}/${lobby.slotsTotal}` : 'Lotado'} tone={isFull ? 'danger' : 'success'} />
        </div>
        <div className="rounded-xl border border-border bg-surface-elevated p-3">
          <StatValue label="Trust" value={`${lobby.owner.trustScore}%`} tone="success" />
        </div>
        <div className="rounded-xl border border-border bg-surface-elevated p-3">
          <StatValue label="Fila" value={lobby.queue} tone="info" />
        </div>
      </div>

      <div className="mt-auto border-t border-border pt-4">
        <Button
          variant={isFull || isClosed ? 'secondary' : 'primary'}
          className="w-full"
          disabled={isFull || isClosed}
          onClick={() => onJoin && onJoin(lobby.id)}
        >
          {isClosed ? 'Fechado' : isFull ? 'Lobby cheio' : 'Entrar no Lobby'}
        </Button>
      </div>
    </Card>
  );
};
