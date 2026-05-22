import React from 'react';
import { DuolootButton } from '@/components/duoloot';
import { MissingImagePlaceholder } from '@/components/duoloot/MissingImagePlaceholder';

export function FreeTournamentsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        
        {/* Esquerda: Texto */}
        <div>
          <div className="mb-4 inline-flex items-center rounded-full border border-[var(--dl-border)] bg-white/[0.04] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--dl-warning)]">
            Torneios Grátis
          </div>
          <h2 className="mb-6 font-['Rajdhani'] text-3xl font-bold uppercase tracking-wide text-white md:text-5xl">
            Complete missões e ganhe prêmios reais
          </h2>
          <p className="mb-8 text-base leading-relaxed text-[var(--dl-muted-light)] sm:text-lg">
            Participe de desafios gratuitos dentro do Duo Loot. Cumpra tarefas, avance no ranking da missão e quem completar primeiro leva a recompensa.
          </p>

          <div className="mb-10 space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--dl-border)] bg-[var(--dl-surface-2)] text-sm font-bold text-[var(--dl-number)]">1</div>
              <p className="pt-1 font-medium text-[var(--dl-text)]">Escolha um torneio gratuito disponível no Cofre.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--dl-border)] bg-[var(--dl-surface-2)] text-sm font-bold text-[var(--dl-number)]">2</div>
              <p className="pt-1 font-medium text-[var(--dl-text)]">Cumpra as tarefas antes dos outros jogadores.</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--dl-border)] bg-[var(--dl-surface-2)] text-sm font-bold text-[var(--dl-number)]">3</div>
              <p className="pt-1 font-medium text-[var(--dl-text)]">Finalize primeiro e desbloqueie o prêmio.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <DuolootButton variant="primary">Participar Grátis</DuolootButton>
            <DuolootButton variant="secondary">Ver Regras</DuolootButton>
          </div>
        </div>

        {/* Direita: Visual */}
        <div className="relative pb-16 sm:pb-12">
          {/* Background Glow */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(13,240,255,0.08)_0%,transparent_70%)]"></div>
          
          <MissingImagePlaceholder 
            text="Imagem do cofre será adicionada depois" 
            className="aspect-[4/3] w-full border-[rgba(13,240,255,0.15)] shadow-[0_0_40px_rgba(13,240,255,0.05)]"
          />

          {/* Cards Simulando Missões */}
          <div className="absolute -bottom-2 left-0 right-0 flex flex-col gap-3 sm:-bottom-4 sm:left-4 sm:right-4">
            <div className="dl-app-card flex items-center justify-between border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3 backdrop-blur-sm sm:p-4">
              <div>
                <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--dl-warning)]">Missão Ativa</div>
                <div className="text-sm font-bold text-white">Vença 3 partidas</div>
              </div>
              <div className="text-right">
                <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--dl-muted)]">Progresso</div>
                <div className="font-bold text-[var(--dl-number)]">66%</div>
              </div>
            </div>
            
            <div className="dl-app-card flex items-center justify-between border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3 backdrop-blur-sm sm:p-4">
              <div>
                <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--dl-string)]">Objetivo</div>
                <div className="text-sm font-bold text-white">Faça 20 abates</div>
              </div>
              <div className="text-right">
                <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--dl-muted)]">Progresso</div>
                <div className="font-bold text-[var(--dl-number)]">45%</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
