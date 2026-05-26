import React from 'react';

interface MetricTileProps {
  value: string;
  label: string;
  sublabel?: string;
  color: string;
}

function MetricTile({ value, label, sublabel, color }: MetricTileProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-6 py-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.06]">
      <span
        className="font-mono text-[2.8rem] font-bold leading-none tracking-[-0.02em]"
        style={{ color }}
      >
        {value}
      </span>
      <span className="font-['Inter'] text-[0.85rem] font-medium text-white">{label}</span>
      {sublabel && (
        <span className="font-['Inter'] text-[0.72rem] text-[var(--dl-muted)]">{sublabel}</span>
      )}
    </div>
  );
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  initials: string;
  accentColor: string;
}

function TestimonialCard({ quote, author, role, initials, accentColor }: TestimonialCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.05]">
      <p className="font-['Inter'] text-[0.88rem] font-light leading-[1.75] text-[var(--dl-muted-light)]">
        "{quote}"
      </p>
      <div className="flex items-center gap-3 border-t border-white/[0.06] pt-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[0.65rem] font-bold"
          style={{
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}30`,
            color: accentColor,
          }}
        >
          {initials}
        </div>
        <div className="flex flex-col">
          <span
            className="font-mono text-[0.72rem] font-medium"
            style={{ color: accentColor }}
          >
            {author}
          </span>
          <span className="font-['Inter'] text-[0.65rem] text-[var(--dl-muted)]">{role}</span>
        </div>
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  {
    quote: 'Sistema encontrou meu duo perfeito em menos de 90 segundos. Subimos de Ouro para Platina juntos.',
    author: '@titanx',
    role: 'ADC · Diamond I',
    initials: 'TX',
    accentColor: 'var(--dl-number)',
  },
  {
    quote: 'O Vault pagou meu headset novo. Completei as missões em uma semana sem nem perceber.',
    author: '@foxmid',
    role: 'Mid · Emerald III',
    initials: 'FM',
    accentColor: 'var(--dl-warning)',
  },
  {
    quote: 'Coaching do AstraMind mudou meu game sense completamente. Do Bronze ao Prata em 3 semanas.',
    author: '@silvarj',
    role: 'Support · Platinum II',
    initials: 'SR',
    accentColor: 'var(--dl-function)',
  },
];

export function SocialProofSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6">
      {/* Section header */}
      <div className="mb-12 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <span className="h-px w-8 bg-white/10" />
          <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-muted)]">
            Números reais
          </span>
          <span className="h-px w-8 bg-white/10" />
        </div>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.025em] text-white">
          Resultados que{' '}
          <span className="text-[var(--dl-string)]">falam por si</span>
        </h2>
      </div>

      {/* Metrics bento */}
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile
          value="12.847"
          label="Duos formados"
          sublabel="Nos últimos 30 dias"
          color="var(--dl-number)"
        />
        <MetricTile
          value="94%"
          label="Taxa de satisfação"
          sublabel="Baseado em 2.300+ avaliações"
          color="var(--dl-string)"
        />
        <MetricTile
          value="R$ 180k+"
          label="Em prêmios distribuídos"
          sublabel="Desde o lançamento"
          color="var(--dl-warning)"
        />
      </div>

      {/* Gradient divider */}
      <div
        className="mb-12 h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        }}
      />

      {/* Anchor quote */}
      <blockquote className="mb-10 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-8 backdrop-blur-xl sm:p-10">
        <p className="mb-6 text-[clamp(1.1rem,2.5vw,1.5rem)] font-light leading-[1.65] tracking-[-0.01em] text-white sm:text-center">
          "Achei meu duo em{' '}
          <span className="font-semibold text-[var(--dl-number)]">8 minutos</span>.{' '}
          Diamond em{' '}
          <span className="font-semibold text-[var(--dl-string)]">2 semanas</span>.{' '}
          Nunca pensei que fosse tão rápido assim."
        </p>
        <footer className="flex items-center gap-3 sm:justify-center">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono text-[0.7rem] font-bold"
            style={{
              background: 'rgba(13,240,255,0.12)',
              border: '1px solid rgba(13,240,255,0.3)',
              color: 'var(--dl-number)',
            }}
          >
            TX
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[0.78rem] font-medium text-[var(--dl-number)]">
              @titanx
            </span>
            <span className="font-['Inter'] text-[0.68rem] text-[var(--dl-muted)]">
              ADC Main · Diamond I · 847 partidas rankeds
            </span>
          </div>
        </footer>
      </blockquote>

      {/* Testimonial grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.author} {...t} />
        ))}
      </div>
    </section>
  );
}
