import { useMemo, useState } from 'react';
import type { CategoriaComportamentoPartida, CategoriaDesempenhoPartida } from '@/services/karma.service';

type PerformanceOption = {
  label: string;
  description: string;
  emoji: string;
  value: CategoriaDesempenhoPartida;
  points: number;
  tone: 'bad' | 'neutral' | 'good';
};

type BehaviorOption = {
  label: string;
  description: string;
  emoji: string;
  value: CategoriaComportamentoPartida;
  points: number;
  tone: 'bad' | 'neutral' | 'good';
};

const performanceOptions: PerformanceOption[] = [
  {
    label: 'Ruim',
    description: 'Teve dificuldade mecânica, mas sem prejudicar de propósito.',
    emoji: '🔴',
    value: 'RUIM',
    points: 0,
    tone: 'bad',
  },
  {
    label: 'Na Média',
    description: 'Jogou o esperado e cumpriu o básico da partida.',
    emoji: '🟡',
    value: 'MEDIA',
    points: 1,
    tone: 'neutral',
  },
  {
    label: 'Mandou Bem',
    description: 'Ajudou bastante, decidiu rounds ou cumpriu bem a função.',
    emoji: '🟢',
    value: 'BOM',
    points: 3,
    tone: 'good',
  },
];

const behaviorOptions: BehaviorOption[] = [
  {
    label: 'Tóxico / Troll',
    description: 'Ofendeu, trollou, quitou ou atrapalhou o time.',
    emoji: '🔴',
    value: 'TOXICO',
    points: -5,
    tone: 'bad',
  },
  {
    label: 'Silencioso / Neutro',
    description: 'Não incomodou, mas também não se comunicou muito.',
    emoji: '🟡',
    value: 'NEUTRO',
    points: 1,
    tone: 'neutral',
  },
  {
    label: 'Gente Boa / Comunicativo',
    description: 'Ajudou na call, respeitou o time e manteve o clima bom.',
    emoji: '🟢',
    value: 'BOM',
    points: 3,
    tone: 'good',
  },
];

function getToneClass(tone: 'bad' | 'neutral' | 'good', isSelected: boolean) {
  if (tone === 'bad') {
    return isSelected
      ? 'border-[rgb(var(--dl-error-rgb)/0.72)] bg-[rgb(var(--dl-error-rgb)/0.16)] text-white shadow-[0_0_28px_rgb(var(--dl-error-rgb)/0.20)]'
      : 'border-[rgb(var(--dl-error-rgb)/0.20)] bg-[rgb(var(--dl-error-rgb)/0.06)] text-[#f3d8dc] hover:border-[rgb(var(--dl-error-rgb)/0.44)]';
  }

  if (tone === 'neutral') {
    return isSelected
      ? 'border-[rgba(250,204,21,.72)] bg-[rgba(250,204,21,.15)] text-white shadow-[0_0_28px_rgba(250,204,21,.18)]'
      : 'border-[rgba(250,204,21,.20)] bg-[rgba(250,204,21,.06)] text-[#f7edc8] hover:border-[rgba(250,204,21,.44)]';
  }

  return isSelected
    ? 'border-[rgb(var(--dl-string-rgb)/0.72)] bg-[rgb(var(--dl-string-rgb)/0.16)] text-white shadow-[0_0_28px_rgb(var(--dl-string-rgb)/0.20)]'
    : 'border-[rgb(var(--dl-string-rgb)/0.20)] bg-[rgb(var(--dl-string-rgb)/0.06)] text-[#d9f8eb] hover:border-[rgb(var(--dl-string-rgb)/0.44)]';
}

export default function KarmaPreviewPage() {
  const [selectedPerformance, setSelectedPerformance] = useState<CategoriaDesempenhoPartida | null>(null);
  const [selectedBehavior, setSelectedBehavior] = useState<CategoriaComportamentoPartida | null>(null);
  const [comment, setComment] = useState('');

  const selectedPerformanceOption = performanceOptions.find((option) => option.value === selectedPerformance);
  const selectedBehaviorOption = behaviorOptions.find((option) => option.value === selectedBehavior);
  const canSubmit = Boolean(selectedPerformance && selectedBehavior);

  const karmaPreview = useMemo(() => {
    const performancePoints = selectedPerformanceOption?.points ?? 0;
    const behaviorPoints = selectedBehaviorOption?.points ?? 0;
    return performancePoints + behaviorPoints;
  }, [selectedBehaviorOption?.points, selectedPerformanceOption?.points]);

  return (
    <main className="relative min-h-[calc(100vh-88px)] overflow-hidden px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgb(var(--dl-primary-rgb)/0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgb(var(--dl-string-rgb)/0.14),transparent_32%)]" />

      <section className="relative mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-[rgb(var(--dl-string-rgb)/0.24)] bg-[rgb(var(--dl-string-rgb)/0.10)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--dl-string)]">
              Preview • Karma
            </span>
            <h1 className="mt-4 font-['Rajdhani'] text-4xl font-black uppercase leading-none tracking-[-0.03em] text-white sm:text-6xl">
              Avaliação pós-partida
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--dl-muted-light)] sm:text-base">
              Prévia do modal bloqueante que aparecerá quando uma partida terminar. No futuro, o jogador só volta ao menu principal depois de avaliar os parceiros obrigatórios.
            </p>
          </div>

          <div className="dl-panel rounded-[1.35rem] border border-[var(--dl-border)] bg-white/[0.035] p-4 text-sm text-[var(--dl-muted-light)]">
            <strong className="block text-2xl font-black text-white">{karmaPreview >= 0 ? '+' : ''}{karmaPreview}</strong>
            <span className="text-xs font-black uppercase tracking-[0.12em]">Karma desta avaliação</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="dl-panel relative overflow-hidden rounded-[2rem] border border-[var(--dl-border)] bg-[linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.018))] p-4 shadow-[0_26px_70px_rgba(0,0,0,.36)] sm:p-6">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(99,56,232,.16),transparent_38%,rgba(52,211,153,.08))]" />

            <div className="relative rounded-[1.5rem] border border-[rgba(255,255,255,.10)] bg-[rgba(10,14,28,.82)] p-4 backdrop-blur sm:p-6">
              <div className="mb-6 flex flex-col gap-3 border-b border-[var(--dl-border)] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <small className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--dl-muted-light)]">
                    Avaliando jogador
                  </small>
                  <h2 className="mt-1 font-['Rajdhani'] text-3xl font-black uppercase leading-none text-white">
                    ShadowPhoenix
                  </h2>
                </div>
                <span className="w-fit rounded-full border border-[rgba(250,204,21,.26)] bg-[rgba(250,204,21,.12)] px-3 py-2 text-xs font-black uppercase tracking-[0.1em] text-[#facc15]">
                  Obrigatório
                </span>
              </div>

              <div className="space-y-8">
                <section>
                  <div className="mb-3">
                    <h3 className="text-lg font-black text-white">Como foi o desempenho desse jogador na partida?</h3>
                    <p className="mt-1 text-sm text-[var(--dl-muted-light)]">Habilidade mecânica, impacto nos rounds e função dentro do time.</p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {performanceOptions.map((option) => {
                      const isSelected = selectedPerformance === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={`rounded-[1.25rem] border p-4 text-left transition hover:-translate-y-0.5 ${getToneClass(option.tone, isSelected)}`}
                          onClick={() => setSelectedPerformance(option.value)}
                        >
                          <span className="text-2xl" aria-hidden="true">{option.emoji}</span>
                          <strong className="mt-3 block text-base font-black uppercase">{option.label}</strong>
                          <span className="mt-1 block text-xs leading-relaxed opacity-80">{option.description}</span>
                          <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em]">
                            {option.points > 0 ? `+${option.points}` : option.points} pontos
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <div className="mb-3">
                    <h3 className="text-lg font-black text-white">Como foi o comportamento desse jogador?</h3>
                    <p className="mt-1 text-sm text-[var(--dl-muted-light)]">Atitude, comunicação, respeito, trollagem e clima de equipe.</p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {behaviorOptions.map((option) => {
                      const isSelected = selectedBehavior === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={`rounded-[1.25rem] border p-4 text-left transition hover:-translate-y-0.5 ${getToneClass(option.tone, isSelected)}`}
                          onClick={() => setSelectedBehavior(option.value)}
                        >
                          <span className="text-2xl" aria-hidden="true">{option.emoji}</span>
                          <strong className="mt-3 block text-base font-black uppercase">{option.label}</strong>
                          <span className="mt-1 block text-xs leading-relaxed opacity-80">{option.description}</span>
                          <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.08em]">
                            {option.points > 0 ? `+${option.points}` : option.points} pontos
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <label htmlFor="karma-comment" className="mb-2 block text-sm font-black text-white">
                    Detalhe opcional
                  </label>
                  <textarea
                    id="karma-comment"
                    value={comment}
                    maxLength={150}
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Quer adicionar algum detalhe sobre o comportamento? (Opcional)"
                    className="min-h-[104px] w-full resize-none rounded-[1.25rem] border border-[var(--dl-border)] bg-white/[0.045] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[var(--dl-muted-light)] focus:border-[rgb(var(--dl-primary-rgb)/0.62)] focus:bg-white/[0.07]"
                  />
                  <div className="mt-2 flex justify-end text-xs font-bold text-[var(--dl-muted-light)]">
                    {comment.length}/150
                  </div>
                </section>

                <button
                  type="button"
                  disabled={!canSubmit}
                  className="w-full rounded-2xl bg-[linear-gradient(135deg,var(--dl-primary),#6338e8)] px-5 py-4 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_34px_rgba(99,56,232,.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:border disabled:border-[var(--dl-border)] disabled:bg-none disabled:bg-white/[0.05] disabled:text-[var(--dl-muted-light)] disabled:shadow-none"
                >
                  Enviar Avaliação
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="dl-panel rounded-[1.5rem] border border-[var(--dl-border)] bg-white/[0.035] p-5">
              <h3 className="font-['Rajdhani'] text-2xl font-black uppercase text-white">Regras do Karma</h3>
              <div className="mt-4 space-y-3 text-sm text-[var(--dl-muted-light)]">
                <p><strong className="text-white">Desempenho ruim:</strong> não pune pesado, soma 0.</p>
                <p><strong className="text-white">Comportamento tóxico:</strong> pesa mais e remove 5 pontos.</p>
                <p><strong className="text-white">Jogador gente boa:</strong> ganha Karma e reputação visual.</p>
              </div>
            </div>

            <div className="dl-panel rounded-[1.5rem] border border-[rgb(var(--dl-string-rgb)/0.22)] bg-[rgb(var(--dl-string-rgb)/0.08)] p-5">
              <small className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--dl-string)]">Status da prévia</small>
              <ul className="mt-4 space-y-3 text-sm text-[#d8def0]">
                <li>✅ Visual do modal criado</li>
                <li>✅ Duas perguntas obrigatórias</li>
                <li>✅ Botão bloqueado até responder</li>
                <li>✅ Comentário opcional de 150 caracteres</li>
                <li>⏳ Integração real com Supabase virá depois</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
