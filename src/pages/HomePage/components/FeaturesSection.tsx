import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProgressBar } from '@/components/atoms';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/i18n';

interface FeatureCopyProps {
  eyebrow: string;
  eyebrowColor: string;
  title: string;
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

function GlassPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
      {children}
    </div>
  );
}

const previewLobbies = [
  { name: 'Lobby tático', detail: 'Rank, função e microfone', status: 'Protótipo', color: 'var(--dl-number)' },
  { name: 'Duo casual', detail: 'Compatibilidade por horário', status: 'Em teste', color: 'var(--dl-string)' },
  { name: 'Fila competitiva', detail: 'Preferências do perfil gamer', status: 'Planejado', color: 'var(--dl-function)' },
  { name: 'Squad flexível', detail: 'Regras finais no Supabase', status: 'Backend', color: 'var(--dl-keyword)' },
];

function LobbyPanel() {
  return (
    <GlassPanel>
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="font-mono text-[0.72rem] font-medium text-[var(--dl-number)]">
          // lobby.preview()
        </span>
        <span className="rounded-full border border-[var(--dl-number)]/30 bg-[var(--dl-number)]/10 px-2.5 py-0.5 font-mono text-[0.6rem] font-medium text-[var(--dl-number)]">
          dados de exemplo
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {previewLobbies.map((lobby) => (
          <div
            key={lobby.name}
            className="flex items-center justify-between gap-4 rounded-lg border border-white/[0.04] bg-white/[0.03] px-3.5 py-2.5 transition-all hover:border-white/[0.1] hover:bg-white/[0.06]"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-['Inter'] text-[0.82rem] font-medium text-white">
                {lobby.name}
              </span>
              <span className="font-mono text-[0.65rem] text-[var(--dl-muted)]">
                {lobby.detail}
              </span>
            </div>
            <span
              className="shrink-0 rounded px-2 py-0.5 font-mono text-[0.62rem] font-medium"
              style={{
                color: lobby.color,
                background: `${lobby.color}18`,
                border: `1px solid ${lobby.color}35`,
              }}
            >
              {lobby.status}
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

function VaultPanel() {
  const missions = [
    { label: 'Missão diária', progress: 66, color: 'success' as const, note: 'preview' },
    { label: 'Objetivo semanal', progress: 45, color: 'info' as const, note: 'preview' },
    { label: 'Recompensa beta', progress: 85, color: 'premium' as const, note: 'preview' },
  ];

  return (
    <GlassPanel>
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="font-mono text-[0.72rem] font-medium text-[var(--dl-warning)]">
          // vault.preview()
        </span>
        <span className="rounded-full border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 px-2.5 py-0.5 font-mono text-[0.6rem] font-medium text-[var(--dl-warning)]">
          em validação
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

const previewCoaches = [
  {
    nickname: 'Coach verificado',
    elo: 'Perfil real futuro',
    role: 'Agenda + avaliação',
    plan: 'Em breve',
    color: 'var(--dl-function)',
  },
  {
    nickname: 'Sessão premium',
    elo: 'Checkout pendente',
    role: 'Plano e pagamento',
    plan: 'Beta',
    color: 'var(--dl-number)',
  },
];

function CoachesPanel() {
  return (
    <GlassPanel>
      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="font-mono text-[0.72rem] font-medium text-[var(--dl-function)]">
          // coaches.preview()
        </span>
        <span className="font-['Inter'] text-[0.65rem] text-[var(--dl-muted)]">
          marketplace planejado
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {previewCoaches.map((coach) => (
          <div
            key={coach.nickname}
            className="flex items-center gap-4 rounded-xl border border-white/[0.05] bg-white/[0.03] p-3.5 transition-all hover:border-white/[0.1] hover:bg-white/[0.06]"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-[0.7rem] font-bold"
              style={{
                background: `${coach.color}15`,
                border: `1px solid ${coach.color}30`,
                color: coach.color,
              }}
            >
              DL
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
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
              <div className="mt-0.5 font-mono text-[0.65rem] text-[var(--dl-muted)]">
                {coach.role}
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
          Prévia visual. Dados reais entram após backend de coaches.
        </p>
      </div>
    </GlassPanel>
  );
}

export function FeaturesSection() {
  const navigate = useNavigate();
  const { messages: copy } = useLanguage();

  const features = [
    {
      id: 'lobbies',
      eyebrow: 'Matchmaking competitivo',
      eyebrowColor: 'var(--dl-number)',
      title: copy.home.lobbyTitle,
      body: 'Explore a experiência de lobbies com visual final, enquanto regras de compatibilidade, presença e vagas continuam sendo validadas no Supabase.',
      metric: 'Fluxo visual pronto para auditoria funcional',
      metricColor: 'var(--dl-string)',
      ctaLabel: 'Ver lobbies',
      onCta: () => navigate(ROUTES.LOBBY),
      panel: <LobbyPanel />,
      reverse: false,
    },
    {
      id: 'vault',
      eyebrow: 'Cofre em validação',
      eyebrowColor: 'var(--dl-warning)',
      title: copy.home.tournamentsTitle,
      body: 'O Cofre já tem serviços e RPCs planejados. Esta vitrine mostra a experiência final sem afirmar premiações reais antes da operação estar ativa.',
      metric: 'Depende de migrations, RPCs e painel admin seguro',
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
      body: 'Marketplace de coaches preparado visualmente para receber perfis reais, agenda, pagamento e avaliações quando o módulo for implementado.',
      metric: 'Preview honesto até conectar dados reais',
      metricColor: 'var(--dl-function)',
      ctaLabel: 'Ver coaches',
      onCta: () => navigate(ROUTES.COACHES),
      panel: <CoachesPanel />,
      reverse: false,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6">
      <div className="mb-16 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <span className="h-px w-8 bg-white/10" />
          <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-muted)]">
            Funcionalidades
          </span>
          <span className="h-px w-8 bg-white/10" />
        </div>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.025em] text-white">
          Visual premium para testar cada fluxo{' '}
          <span className="text-[var(--dl-number)]">sem mascarar o que ainda falta</span>
        </h2>
      </div>

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
