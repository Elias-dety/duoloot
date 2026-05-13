import React from 'react';
import { Player } from '@/schemas/player.schema';
import { Card, ProgressBar } from '@/components/atoms';
import { AlertTriangle, ShieldCheck, ThumbsUp } from 'lucide-react';

export interface ProfileTrustPanelProps {
  player: Player;
}

export const ProfileTrustPanel: React.FC<ProfileTrustPanelProps> = ({ player }) => {
  const isHighTrust = player.trustScore >= 80;
  const isMediumTrust = player.trustScore >= 50 && player.trustScore < 80;
  const color = isHighTrust ? 'success' : isMediumTrust ? 'warning' : 'error';
  const textColor = isHighTrust ? 'text-success' : isMediumTrust ? 'text-warning' : 'text-danger';

  return (
    <Card variant="default" className="flex h-full flex-col">
      <div className="mb-6 flex items-start justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-content-base">
          <ShieldCheck className={`h-5 w-5 ${textColor}`} />
          Trust Score
        </h3>
        <span className={`text-2xl font-black ${textColor}`}>{player.trustScore}/100</span>
      </div>

      <div className="mb-6">
        <ProgressBar value={player.trustScore} color={color} size="lg" className="mb-2" />
        <p className="text-sm text-content-muted">
          {isHighTrust
            ? 'Jogador altamente confiavel e bem avaliado.'
            : isMediumTrust
              ? 'Jogador estavel, mas ainda com margem para melhorar a reputacao.'
              : 'Atencao: o historico recente pede mais consistencia.'}
        </p>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-success/10 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
            <ThumbsUp className="h-4 w-4 text-success" />
          </div>
          <div>
            <p className="text-xs text-content-muted">Elogios</p>
            <p className="text-lg font-bold text-content-base">{player.stats.commendations}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-danger/20 bg-danger/10 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger/20">
            <AlertTriangle className="h-4 w-4 text-danger" />
          </div>
          <div>
            <p className="text-xs text-content-muted">Abandonos</p>
            <p className="text-lg font-bold text-content-base">{player.stats.abandons}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
