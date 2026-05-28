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
        className="font-mono text-[2.6rem] font-bold leading-none tracking-[-0.02em]"
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

interface StatusCardProps {
  title: string;
  description: string;
  tag: string;
  initials: string;
  accentColor: string;
}

function StatusCard({ title, description, tag, initials, accentColor }: StatusCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.05]">
      <p className="font-['Inter'] text-[0.88rem] font-light leading-[1.75] text-[var(--dl-muted-light)]">
        {description}
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
            {title}
          </span>
          <span className="font-['Inter'] text-[0.65rem] text-[var(--dl-muted)]">{tag}</span>
        </div>
      </div>
    </div>
  );
}

const STATUS_CARDS = [
  {
    title: 'Fluxo de usuário',
    description: 'Cadastro, login por e-mail e onboarding são as primeiras rotas para validar antes de abrir teste com usuários reais.',
    tag: 'Prioridade funcional',
    initials: 'UX',
    accentColor: 'var(--dl-number)',
  },
  {
    title: 'Cofre e missões',
    description: 'O visual já comunica a experiência final, mas o módulo depende de tabelas, RPCs, painel admin e regras antifraude.',
    tag: 'Backend em validação',
    initials: 'VT',
    accentColor: 'var(--dl-warning)',
  },
  {
    title: 'Premium e coaches',
    description: 'As áreas de monetização e marketplace devem permanecer claras como prévias até checkout, agenda e dados reais existirem.',
    tag: 'Próxima fase',
    initials: 'PR',
    accentColor: 'var(--dl-function)',
  },
];

export function SocialProofSection() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6">
      <div className="mb-12 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          <span className="h-px w-8 bg-white/10" />
          <span className="font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.16em] text-[var(--dl-muted)]">
            Status do MVP
          </span>
          <span className="h-px w-8 bg-white/10" />
        </div>
        <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.025em] text-white">
          Visual pronto para auditoria,{' '}
          <span className="text-[var(--dl-string)]">sem prova social inventada</span>
        </h2>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile
          value="01"
          label="Base técnica"
          sublabel="Auth, rotas, Supabase e testes iniciais"
          color="var(--dl-number)"
        />
        <MetricTile
          value="02"
          label="Auditoria visual"
          sublabel="Home, páginas públicas e fluxo mobile"
          color="var(--dl-string)"
        />
        <MetricTile
          value="03"
          label="Produto real"
          sublabel="Dados reais, pagamento, admin e antifraude"
          color="var(--dl-warning)"
        />
      </div>

      <div
        className="mb-12 h-px w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        }}
      />

      <blockquote className="mb-10 rounded-2xl border border-white/[0.1] bg-white/[0.04] p-8 backdrop-blur-xl sm:p-10">
        <p className="mb-6 text-[clamp(1.1rem,2.5vw,1.5rem)] font-light leading-[1.65] tracking-[-0.01em] text-white sm:text-center">
          Primeiro vamos deixar o Duo Loot com aparência consistente, rotas testáveis e botões honestos. Depois entram os dados reais, pagamento e integrações profundas.
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
            DL
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[0.78rem] font-medium text-[var(--dl-number)]">
              Duo Loot build plan
            </span>
            <span className="font-['Inter'] text-[0.68rem] text-[var(--dl-muted)]">
              Limpeza visual + auditoria funcional + backend real
            </span>
          </div>
        </footer>
      </blockquote>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATUS_CARDS.map((card) => (
          <StatusCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
}
