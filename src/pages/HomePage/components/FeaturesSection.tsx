import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Trophy, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, ProgressBar } from '@/components/atoms';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/i18n';

/* ─── Shared sub-components ──────────────────────────────────────── */

interface FeatureCopyProps {
  eyebrow: string;
  eyebrowColor: string;
  title: string;
  titleAccent?: string;
  body: string;
  metric: string;
  metricColor: string;
  ctaLabel: string;
  onCta: () => void;
}

function FeatureCopy({
  eyebrow,
  eyebrowColor,
  title,
  titleAccent,
  body,
  metric,
  metricColor,
  ctaLabel,
  onCta,
}: FeatureCopyProps) {
  return (
    <div className="flex flex-col gap-5">
      <span
        className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em]"
        style={{ color: eyebrowColor }}
      >
        ↳ {eyebrow}
      </span>
      <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.18] tracking-[-0.02em] text-white">
        {title}
        {titleAccent && (
          <>
            <br />
            <span style={{ color: eyebrowColor }}>{titleAccent}</span>
          </>
        )}
      </h3>
      <p className="font-['Inter'] text-[0.95rem] font-light leading-[1.8] text-[var(--dl-muted-light)]">
        {body}
      </p>
      <div className="flex items-center gap-2.5">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ background: metricColor, boxShadow: `0 0 6px ${metricColor}` }}
        />
        <span
          className="font-['Inter'] text-[0.82rem] font-medium"
          style={{ color: metricColor }}
        >
          {metric}
        </span>
      </div>
      <button
        onClick={onCta}
        className="group mt-1 inline-flex w-fit items-center gap-2 font-['Inter'] text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-[var(--dl-muted-light)] transition-colors hover:text-white"
      >
        {ctaLabel}
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
    </div>
  );
}

interface GlassPanelProps {
  children: React.ReactNode;
}

function GlassPanel({ children }: GlassPanelProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
      {children}
    </div>
  );
}

/* ─── Lobby panel ────────────────────────────────────────────────── */

const MOCK_LOBBIES = [
  { name: 'TitanX · ADC', elo: 'DIA I', wr: '64%', color: 'var(--dl-number)' },
  { name: 'SilvaRJ · Support', elo: 'PLAT II', wr: '58%', color: 'var(--dl-string)' },
  { name: 'FoxMid · Mid', elo: 'EME III', wr: '72%', color: 'var(--dl-function)' },
  { name: 'ZeroG · Jungle', elo: 'DIA III', wr: '61%', color: 'var(--dl-keyword)' },
];

function LobbyPanel() {
  return (
    <GlassPanel>
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="font-mono text-[0.72rem] font-medium text-[var(--dl-number)]">
          // lobbies.active()
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[0.65rem] text-[var(--dl-string)]">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--dl-string)]"
            style={{ boxShadow: '0 0 5px var(--dl-string)' }}
          />
          847 online
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {MOCK_LOBBIES.map((lobby) => (
          <div
            key={lobby.name}
            className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.03] px-3.5 py-2.5 transition-all hover:border-white/[0.1] hover:bg-white/[0.06]"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-['Inter'] text-[0.82rem] font-medium text-white">
                {lobby.name}
              </span>
              <span className="font-mono text-[0.65rem] text-[var(--dl-muted)]">
                WR: <span style={{ color: 'var(--dl-string)' }}>{lobby.wr}</span>
              </span>
            </div>
            <span
              className="rounded px-2 py-0.5 font-mono text-[0.62rem] font-medium"
              style={{
                color: lobby.color,
                background: `${lobby.color}18`,
                border: `1px solid ${lobby.color}35`,
              }}
            >
              {lobby.elo}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

/* ─── Vault missions panel ───────────────────────────────────────── */

function VaultPanel() {
  const { messages: copy } = useLanguage();
  const missions = [
    { label: copy.home.missionWin, progress: 66, color: 'success' as const, note: '2/3 concluídas' },
    { label: copy.home.missionKills, progress: 45, color: 'info' as const, note: '9/20 abates' },
    { label: 'Jogar com um duo por 2h', progress: 85, color: 'premium' as const, note: '102min / 120min' },
  ];

  return (
    <GlassPanel>
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="font-mono text-[0.72rem] font-medium text-[var(--dl-warning)]">
          // vault.missions()
        </span>
        <span className="rounded-full border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 px-2.5 py-0.5 font-mono text-[0.6rem] font-medium text-[var(--dl-warning)]">
          3 ativas
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {missions.map((m) => (
          <div key={m.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-[0.82rem] font-medium text-white">
                {m.label}
              </span>
              <span className="font-mono text-[0.65rem] text-[var(--dl-muted)]">{m.note}</span>
            </div>
            <ProgressBar value={m.progress} color={m.color} size="sm" />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

/* ─── Coaches panel ──────────────────────────────────────────────── */

const MOCK_COACHES_PREVIEW = [
  {
    nickname: 'AstraMind',
    elo: 'Radiante',
    role: 'Controlador',
    wr: '67%',
    plan: 'R$ 79/mês',
    color: 'var(--dl-function)',
  },
  {
    nickname: 'EntryFox',
    elo: 'Imortal III',
    role: 'Duelista',
    wr: '58%',
    plan: 'R$ 49',
    color: 'var(--dl-number)',
  },
];

function CoachesPanel() {
  const { messages: copy } = useLanguage();
  return (
    <GlassPanel>
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="font-mono text-[0.72rem] font-medium text-[var(--dl-function)]">
          // coaches.available()
        </span>
        <span className="font-['Inter'] text-[0.65rem] text-[var(--dl-muted)]">
          Challenger verificado
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {MOCK_COACHES_PREVIEW.map((coach) => (
          <div
            key={coach.nickname}
            className="flex items-center gap-4 rounded-xl border border-white/[0.05] bg-white/[0.03] p-3.5 transition-all hover:border-white/[0.1] hover:bg-white/[0.06]"
          >
            {/* Avatar placeholder */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-[0.7rem] font-bold"
              style={{
                background: `${coach.color}15`,
                border: `1px solid ${coach.color}30`,
                color: coach.color,
              }}
            >
              {coach.nickname.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-['Inter'] text-[0.88rem] font-semibold text-white">
                  {coach.nickname}
                </span>
                <span
                  className="font-mono text-[0.62rem]"
                  style={{ color: coach.color }}
                >
                  {coach.elo}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-3 font-mono text-[0.65rem] text-[var(--dl-muted)]">
                <span>
                  WR:{' '}
                  <span className="text-[var(--dl-string)]">{coach.wr}</span>
                </span>
                <span>{coach.role}</span>
              </div>
            </div>
            <span
              className="shrink-0 font-['Inter'] text-[0.72rem] font-semibold"
              style={{ color: coach.color }}
            >
              {coach.plan}
            </span>
          </div>
        ))}
        <p className="mt-1 text-center font-['Inter'] text-[0.72rem] text-[var(--dl-muted)]">
          +{copy.home.classes.toLowerCase()} disponíveis
        </p>
      </div>
    </GlassPanel>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */

export function FeaturesSection() {
  const navigate = useNavigate();
  const { messages: copy } = useLanguage();

  const features = [
    {
      id: 'lobbies',
      eyebrow: 'Matchmaking competitivo',
      eyebrowColor: 'var(--dl-number)',
      title: copy.home.lobbyTitle,
      titleAccent: undefined,
      body: copy.home.lobbySubtitle,
      metric: '+47% taxa de vitória média após 2 semanas',
      metricColor: 'var(--dl-string)',
      ctaLabel: 'Ver lobbies',
      onCta: () => navigate(ROUTES.LOBBY),
      panel: <LobbyPanel />,
      reverse: false,
    },
    {
      id: 'vault',
      eyebrow: 'Recompensas reais',
      eyebrowColor: 'var(--dl-warning)',
      title: copy.home.tournamentsTitle,
      titleAccent: undefined,
      body: copy.home.tournamentsDescription,
      metric: 'R$ 180.000+ em prêmios distribuídos',
      metricColor: 'var(--dl-warning)',
      ctaLabel: 'Abrir cofre',
      onCta: () => navigate(ROUTES.VAULT),
      panel: <VaultPanel />,
      reverse: true,
    },
    {
      id: 'coaches',
      eyebrow: copy.home.coachesBadge,
      eyebrowColor: 'var(--dl-function)',
      title: copy.home.coachesTitle,
      titleAccent: undefined,
      body: copy.home.coachesSubtitle,
      metric: '4.9★ avaliação média · +340 coaches ativos',
      metricColor: 'var(--dl-function)',
      ctaLabel: 'Ver coaches',
      onCta: () => navigate(ROUTES.COACHES),
      panel: <CoachesPanel />,
      reverse: false,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6">
      {/* Section header */}
      <div className="mb-16 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <span className="h-px w-8 bg-white/10" />
          <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-muted)]">
            Funcionalidades
          </span>
          <span className="h-px w-8 bg-white/10" />
        </div>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.025em] text-white">
          Tudo que você precisa{' '}
          <span className="text-[var(--dl-number)]">para subir de elo</span>
        </h2>
      </div>

      {/* Feature rows */}
      <div className="flex flex-col gap-20 md:gap-24">
        {features.map((feature) => (
          <div
            key={feature.id}
            className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
              feature.reverse ? 'md:[&>:first-child]:order-2 md:[&>:last-child]:order-1' : ''
            }`}
          >
            <FeatureCopy
              eyebrow={feature.eyebrow}
              eyebrowColor={feature.eyebrowColor}
              title={feature.title}
              titleAccent={feature.titleAccent}
              body={feature.body}
              metric={feature.metric}
              metricColor={feature.metricColor}
              ctaLabel={feature.ctaLabel}
              onCta={feature.onCta}
            />
            {feature.panel}
          </div>
        ))}
      </div>
    </section>
  );
}
