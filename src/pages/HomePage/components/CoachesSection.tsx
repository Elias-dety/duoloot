import React from 'react';
import { Button } from '@/components/atoms';
import { MissingImagePlaceholder } from '@/components/atoms';

const MOCK_COACHES = [
  {
    nickname: 'AstraMind#BR',
    elo: 'Radiante',
    role: 'Controlador',
    service: 'Análise VOD',
    description: 'Coach tático focado em leitura de mapa, utilidade e tomada de decisão.',
    winRate: '67%',
    kda: '1.48',
    classes: 124,
    plan: 'R$ 79/mês',
    planDesc: 'Inclui análise semanal, plano de treino e acompanhamento de evolução.',
    tags: ['Game sense', 'Mapa', 'Call'],
  },
  {
    nickname: 'EntryFox#GG',
    elo: 'Imortal III',
    role: 'Duelista',
    service: 'Aim review',
    description: 'Especialista em duelista, mira, entrada no bomb e criação de espaço.',
    winRate: '58%',
    kda: '1.62',
    classes: 89,
    plan: 'R$ 49 taxa única',
    planDesc: 'Uma aula com análise de gameplay, correção de erro e treino recomendado.',
    tags: ['Mira', 'Entry', 'Clutch'],
  },
  {
    nickname: 'SentinelPro#XP',
    elo: 'Ascendente III',
    role: 'Sentinela',
    service: 'Ranked climb',
    description: 'Coach focado em defesa, setup, lurk, pós-plant e consistência em ranked.',
    winRate: '61%',
    kda: '1.36',
    classes: 57,
    plan: 'R$ 35/aula',
    planDesc: 'Ideal para quem quer revisar partidas específicas e corrigir decisões.',
    tags: ['Setup', 'Defesa', 'Pós-plant'],
  },
];

export function CoachesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center rounded-full border border-[var(--dl-border)] bg-white/[0.04] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--dl-function)]">
          Coaches High Elo
        </div>
        <h2 className="font-['Rajdhani'] text-3xl font-bold uppercase tracking-wide text-white md:text-5xl">
          Aprenda com quem já joga no alto nível
        </h2>
        <p className="mt-4 mx-auto max-w-2xl text-[var(--dl-muted-light)]">
          Veja perfis de jogadores experientes, contrate aulas, receba análise de partida e evolua com dicas práticas para subir de elo.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_COACHES.map((coach, index) => (
          <div key={index} className="dl-app-card flex flex-col p-6 transition-transform hover:translate-y-[-2px]">
            {/* Cabeçalho Coach */}
            <div className="mb-5 flex gap-4">
              <MissingImagePlaceholder className="h-16 w-16 shrink-0 p-2" text="" />
              <div>
                <h3 className="font-bold text-white text-lg">{coach.nickname}</h3>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--dl-function)]">{coach.elo}</div>
                <div className="text-xs text-[var(--dl-muted-light)] mt-1">{coach.role} • {coach.service}</div>
              </div>
            </div>

            <p className="mb-5 text-sm text-[var(--dl-muted-light)]">
              {coach.description}
            </p>

            {/* Stats */}
            <div className="mb-5 flex gap-4 text-sm font-semibold">
              <div className="flex flex-col">
                <span className="text-[0.65rem] uppercase tracking-wider text-[var(--dl-muted)]">Win Rate</span>
                <span className="text-[var(--dl-string)]">{coach.winRate}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[0.65rem] uppercase tracking-wider text-[var(--dl-muted)]">KDA</span>
                <span className="text-[var(--dl-number)]">{coach.kda}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[0.65rem] uppercase tracking-wider text-[var(--dl-muted)]">Aulas</span>
                <span className="text-white">{coach.classes}</span>
              </div>
            </div>

            {/* Plan */}
            <div className="mb-6 flex-1 rounded-xl bg-[var(--dl-surface-2)] border border-[var(--dl-border)] p-4">
              <div className="font-bold text-[var(--dl-warning)] mb-1">{coach.plan}</div>
              <div className="text-xs text-[var(--dl-muted-light)] leading-relaxed">{coach.planDesc}</div>
            </div>

            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              {coach.tags.map((tag, idx) => (
                <span key={idx} className="inline-flex rounded-full bg-white/[0.04] border border-[var(--dl-border)] px-3 py-1 text-xs font-medium text-[var(--dl-muted-light)]">
                  {tag}
                </span>
              ))}
            </div>

            {/* Ações */}
            <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-[var(--dl-border)]">
              <Button variant="secondary" size="sm" className="w-full">Ver Perfil</Button>
              <Button variant="primary" size="sm" className="w-full border-[var(--dl-function)] bg-[var(--dl-function)] shadow-[0_4px_14px_rgba(176,132,255,0.2)]">Agendar</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
