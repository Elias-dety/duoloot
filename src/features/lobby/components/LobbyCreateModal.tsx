import React, { useMemo, useState } from 'react';
import type { PlayerGameProfile } from '@/services/auth.service';
import type { CreateLobbyPayload } from '@/services/lobbies.service';

type LobbyRole = 'duelista' | 'iniciador' | 'controlador' | 'sentinela' | 'flex';

export type LobbyCreateConfig = {
  slotsTotal: number;
  requiredPositions: LobbyRole[];
  creatorPosition: LobbyRole;
  maxReputationAllowed: number;
};

export interface LobbyCreateModalProps {
  isOpen: boolean;
  isCreating?: boolean;
  profileGameProfile?: PlayerGameProfile;
  onClose: () => void;
  onSubmit: (payload: CreateLobbyPayload) => Promise<void> | void;
}

const ROLE_OPTIONS: Array<{ value: LobbyRole; label: string; description: string }> = [
  { value: 'duelista', label: 'Duelista', description: 'Entrada, pressão e abertura de espaço.' },
  { value: 'iniciador', label: 'Iniciador', description: 'Informação, flash e criação de jogadas.' },
  { value: 'controlador', label: 'Controlador', description: 'Smokes, bloqueio de visão e ritmo.' },
  { value: 'sentinela', label: 'Sentinela', description: 'Defesa, cobertura e leitura de mapa.' },
  { value: 'flex', label: 'Flex', description: 'Adapta a função conforme o lobby.' },
];

const REPUTATION_OPTIONS = [100, 90, 80, 70, 60, 50];

function normalizeRole(role?: string): LobbyRole {
  const normalized = String(role || '').toLowerCase();
  if (normalized.includes('duel')) return 'duelista';
  if (normalized.includes('inici')) return 'iniciador';
  if (normalized.includes('control')) return 'controlador';
  if (normalized.includes('sentin')) return 'sentinela';
  return 'flex';
}

function getRoleLabel(role: LobbyRole) {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label || role;
}

export const LobbyCreateModal: React.FC<LobbyCreateModalProps> = ({
  isOpen,
  isCreating,
  profileGameProfile,
  onClose,
  onSubmit,
}) => {
  const defaultCreatorPosition = useMemo(() => normalizeRole(profileGameProfile?.mainRole), [profileGameProfile?.mainRole]);
  const [slotsTotal, setSlotsTotal] = useState(5);
  const [creatorPosition, setCreatorPosition] = useState<LobbyRole>(defaultCreatorPosition);
  const [requiredPositions, setRequiredPositions] = useState<LobbyRole[]>(['duelista', 'sentinela']);
  const [maxReputationAllowed, setMaxReputationAllowed] = useState(100);

  React.useEffect(() => {
    if (isOpen) {
      const role = normalizeRole(profileGameProfile?.mainRole);
      setCreatorPosition(role);
      setRequiredPositions((prev) => prev.length ? prev : ['duelista', 'sentinela']);
    }
  }, [isOpen, profileGameProfile?.mainRole]);

  if (!isOpen) return null;

  const toggleRequiredPosition = (role: LobbyRole) => {
    setRequiredPositions((current) => {
      if (current.includes(role)) {
        return current.filter((item) => item !== role);
      }

      return [...current, role];
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedPositions = requiredPositions.length ? requiredPositions : [creatorPosition];
    const payload: CreateLobbyPayload = {
      slots_total: slotsTotal,
      mode: profileGameProfile?.preferredModes?.[0] || 'competitivo',
      queue: profileGameProfile?.preferredModes?.[0] || 'ranked',
      min_rank: profileGameProfile?.currentRank || 'livre',
      max_rank: profileGameProfile?.currentRank || 'livre',
      metadata: {
        mainGame: profileGameProfile?.mainGame,
        riotId: profileGameProfile?.riotId,
        currentRank: profileGameProfile?.currentRank,
        mainRole: profileGameProfile?.mainRole,
        secondaryRole: profileGameProfile?.secondaryRole,
        playStyle: profileGameProfile?.playStyle,
        sessionFocus: profileGameProfile?.sessionFocus,
        availability: profileGameProfile?.availability,
        microphone: profileGameProfile?.microphone,
        region: profileGameProfile?.region,
        bio: profileGameProfile?.bio,
        creatorPosition,
        creatorPositionLabel: getRoleLabel(creatorPosition),
        requiredPositions: selectedPositions,
        requiredPositionLabels: selectedPositions.map(getRoleLabel),
        maxReputationAllowed,
      },
    };

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 px-3 py-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-labelledby="create-lobby-title">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-[var(--dl-border)] bg-[var(--dl-card)] shadow-[0_30px_90px_rgba(0,0,0,.55)]">
        <div className="border-b border-[var(--dl-border)] bg-white/[0.035] px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[var(--dl-number)]">Configuração completa</p>
              <h2 id="create-lobby-title" className="mt-1 font-['Rajdhani'] text-2xl font-black uppercase text-white sm:text-3xl">
                Criar lobby
              </h2>
              <p className="mt-1 text-sm text-[var(--dl-muted-light)]">
                Defina vagas, posições, reputação e sua função antes de abrir o lobby.
              </p>
            </div>
            <button type="button" onClick={onClose} className="rounded-full border border-[var(--dl-border)] bg-white/[0.05] px-3 py-2 text-sm font-black text-white transition hover:bg-white/[0.1]" disabled={isCreating}>
              ✕
            </button>
          </div>
        </div>

        <div className="max-h-[78vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          <section className="rounded-2xl border border-[var(--dl-border)] bg-white/[0.035] p-4">
            <label htmlFor="slots-total" className="block text-[0.72rem] font-black uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
              Número de jogadores
            </label>
            <p className="mt-1 text-sm text-[var(--dl-muted-light)]">Total de pessoas no lobby, contando você.</p>
            <select
              id="slots-total"
              value={slotsTotal}
              onChange={(event) => setSlotsTotal(Number(event.target.value))}
              className="mt-3 w-full rounded-2xl border border-[var(--dl-border)] bg-[#080a12] px-4 py-3 text-sm font-bold text-white outline-none focus:border-[var(--dl-number)]"
            >
              {[2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>{value} jogadores</option>
              ))}
            </select>
          </section>

          <section className="rounded-2xl border border-[var(--dl-border)] bg-white/[0.035] p-4">
            <h3 className="text-[0.72rem] font-black uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Posições necessárias</h3>
            <p className="mt-1 text-sm text-[var(--dl-muted-light)]">Marque as funções que você quer priorizar para completar o squad.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {ROLE_OPTIONS.map((role) => {
                const checked = requiredPositions.includes(role.value);
                return (
                  <button
                    type="button"
                    key={role.value}
                    onClick={() => toggleRequiredPosition(role.value)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${checked ? 'border-[var(--dl-string)] bg-[rgb(var(--dl-string-rgb)/0.12)]' : 'border-[var(--dl-border)] bg-white/[0.03] hover:bg-white/[0.06]'}`}
                  >
                    <span className="block text-sm font-black uppercase text-white">{checked ? '✓ ' : ''}{role.label}</span>
                    <span className="mt-1 block text-xs text-[var(--dl-muted-light)]">{role.description}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--dl-border)] bg-white/[0.035] p-4">
              <label htmlFor="creator-position" className="block text-[0.72rem] font-black uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                Sua posição
              </label>
              <p className="mt-1 text-sm text-[var(--dl-muted-light)]">Pré-selecione a função que você vai jogar.</p>
              <select
                id="creator-position"
                value={creatorPosition}
                onChange={(event) => setCreatorPosition(event.target.value as LobbyRole)}
                className="mt-3 w-full rounded-2xl border border-[var(--dl-border)] bg-[#080a12] px-4 py-3 text-sm font-bold text-white outline-none focus:border-[var(--dl-number)]"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-[var(--dl-border)] bg-white/[0.035] p-4">
              <label htmlFor="max-reputation" className="block text-[0.72rem] font-black uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                Reputação máxima permitida
              </label>
              <p className="mt-1 text-sm text-[var(--dl-muted-light)]">Limite que será usado depois no filtro automático do lobby.</p>
              <select
                id="max-reputation"
                value={maxReputationAllowed}
                onChange={(event) => setMaxReputationAllowed(Number(event.target.value))}
                className="mt-3 w-full rounded-2xl border border-[var(--dl-border)] bg-[#080a12] px-4 py-3 text-sm font-bold text-white outline-none focus:border-[var(--dl-number)]"
              >
                {REPUTATION_OPTIONS.map((value) => (
                  <option key={value} value={value}>Até {value}%</option>
                ))}
              </select>
            </div>
          </section>

          <div className="rounded-2xl border border-[rgba(250,204,21,.26)] bg-[rgba(250,204,21,.08)] px-4 py-3 text-sm text-[#facc15]">
            As regras ficam salvas no lobby e já aparecem no card. A validação automática por posição/reputação será plugada depois no matchmaking.
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--dl-border)] bg-black/20 px-5 py-4 sm:flex-row sm:px-6">
          <button type="button" onClick={onClose} disabled={isCreating} className="w-full rounded-2xl border border-[var(--dl-border)] bg-white/[0.05] px-4 py-3 text-sm font-black text-white transition hover:bg-white/[0.08] disabled:opacity-50 sm:w-auto">
            Cancelar
          </button>
          <button type="submit" disabled={isCreating} className="w-full rounded-2xl bg-[linear-gradient(135deg,var(--dl-primary),#6338e8)] px-4 py-3 text-sm font-black text-white shadow-[0_12px_26px_rgba(99,56,232,.24)] transition hover:-translate-y-0.5 disabled:opacity-50 sm:flex-1">
            {isCreating ? 'Criando lobby...' : 'Criar lobby configurado'}
          </button>
        </div>
      </form>
    </div>
  );
};
