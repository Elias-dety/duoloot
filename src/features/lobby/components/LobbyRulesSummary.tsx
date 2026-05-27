import React from 'react';

type LobbyMetadata = Record<string, unknown> | undefined;

export interface LobbyRulesSummaryProps {
  metadata?: LobbyMetadata;
}

function toText(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function toTextList(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => toText(item))
    .filter(Boolean);
}

function toPercent(value: unknown) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) return null;

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

export const LobbyRulesSummary: React.FC<LobbyRulesSummaryProps> = ({ metadata }) => {
  const requiredPositions = toTextList(metadata?.requiredPositionLabels ?? metadata?.requiredPositions);
  const creatorPosition = toText(metadata?.creatorPositionLabel ?? metadata?.creatorPosition);
  const maxReputationAllowed = toPercent(metadata?.maxReputationAllowed);
  const hasRules = requiredPositions.length > 0 || Boolean(creatorPosition) || maxReputationAllowed !== null;

  if (!hasRules) return null;

  return (
    <section className="mt-5">
      <h4 className="mb-3 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
        Regras do lobby
      </h4>

      <div className="space-y-3 rounded-[1.125rem] border border-[rgba(250,204,21,.26)] bg-[linear-gradient(135deg,rgba(250,204,21,.10),rgba(250,204,21,.025))] p-4">
        {requiredPositions.length > 0 ? (
          <div>
            <small className="block text-[10px] font-black uppercase tracking-[0.12em] text-[var(--dl-muted-light)]">
              Posições necessárias
            </small>
            <div className="mt-2 flex flex-wrap gap-2">
              {requiredPositions.map((position) => (
                <span
                  key={position}
                  className="rounded-full border border-[rgba(250,204,21,.28)] bg-[rgba(250,204,21,.12)] px-3 py-1.5 text-xs font-black uppercase text-[#facc15]"
                >
                  {position}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          {creatorPosition ? (
            <div className="rounded-2xl border border-[var(--dl-border)] bg-white/[0.035] px-4 py-3">
              <small className="block text-[10px] font-black uppercase tracking-[0.12em] text-[var(--dl-muted-light)]">
                Posição do dono
              </small>
              <strong className="mt-1 block text-sm font-black uppercase text-white">{creatorPosition}</strong>
            </div>
          ) : null}

          {maxReputationAllowed !== null ? (
            <div className="rounded-2xl border border-[rgb(var(--dl-string-rgb)/0.24)] bg-[rgb(var(--dl-string-rgb)/0.10)] px-4 py-3">
              <small className="block text-[10px] font-black uppercase tracking-[0.12em] text-[var(--dl-muted-light)]">
                Reputação máxima
              </small>
              <strong className="mt-1 block text-sm font-black uppercase text-[var(--dl-string)]">
                Até {maxReputationAllowed}%
              </strong>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
