import React, { useState } from 'react';
import { DuolootButton } from '@/components/duoloot';

export function HeroSearchSection() {
  const [searchValue, setSearchValue] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      setFeedback('Digite algo para buscar.');
    } else {
      setFeedback('Buscando estatísticas... (Simulação)');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-5 py-16 text-center sm:px-6 sm:py-20">
      {/* Badge Superior */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--dl-border)] bg-white/[0.04] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--dl-muted-light)]">
        <span className="h-2 w-2 rounded-full bg-[var(--dl-keyword)] shadow-[0_0_8px_rgb(var(--dl-red-rgb)/0.8)]"></span>
        Duo Loot Codefire UI
      </div>

      <h1 className="mb-8 font-['Rajdhani'] text-4xl font-bold uppercase tracking-wide text-white md:text-6xl lg:text-7xl">
        Busque suas estatísticas
      </h1>

      <form onSubmit={handleSearch} className="relative z-10 w-full max-w-2xl">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Busque por jogador, estatística ou lobby"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-14 w-full flex-1 rounded-full border border-[var(--dl-border)] bg-[var(--dl-surface)] px-6 text-[var(--dl-text)] placeholder-[var(--dl-muted)] focus:border-[var(--dl-number)] focus:outline-none"
          />
          <DuolootButton type="submit" variant="primary" className="h-14 rounded-full px-8 text-sm sm:w-auto">
            Buscar
          </DuolootButton>
        </div>
        {feedback && (
          <div className="mt-4 text-sm font-semibold text-[var(--dl-warning)]">
            {feedback}
          </div>
        )}
      </form>

      {/* Syntax Highlight Text */}
      <div className="mt-12 text-sm font-semibold tracking-wider text-[var(--dl-muted-light)] md:text-base">
        <p className="mb-1">
          <span className="text-[var(--dl-number)]">busque</span> suas <span className="text-[var(--dl-number)]">estatísticas</span>
        </p>
        <p className="mb-1">
          <span className="text-[var(--dl-number)]">encontre</span> <span className="text-[var(--dl-warning)]">jogadores</span> para fechar <span className="text-[var(--dl-function)]">lobby</span>
        </p>
        <p>
          <span className="text-[var(--dl-string)]">ganhe dinheiro</span> participando dos <span className="text-[var(--dl-keyword)]">torneios</span>
        </p>
      </div>
    </section>
  );
}
