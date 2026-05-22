import React from 'react';
import { DuolootButton } from '@/components/duoloot';

const MOCK_LOBBIES = [
  {
    id: 1,
    title: 'Lobby Platina fechado 5v5',
    elo: 'Platina',
    size: 5,
    occupied: 3,
    creatorRole: 'Duelista',
    creatorElo: 'Platina',
    winRate: '58%',
    kda: '1.34',
    lookingFor: ['Smoke', 'Sentinela'],
  },
  {
    id: 2,
    title: 'Lobby Ouro trio ranked',
    elo: 'Ouro',
    size: 3,
    occupied: 2,
    creatorRole: 'Smoke',
    creatorElo: 'Ouro',
    winRate: '54%',
    kda: '1.18',
    lookingFor: ['Duelista'],
  },
  {
    id: 3,
    title: 'Lobby Diamante competitivo',
    elo: 'Diamante',
    size: 5,
    occupied: 4,
    creatorRole: 'Iniciador',
    creatorElo: 'Diamante',
    winRate: '62%',
    kda: '1.55',
    lookingFor: ['Smoke'],
  },
];

export function LobbyPreviewSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="mb-10 text-center">
        <h2 className="font-['Rajdhani'] text-3xl font-bold uppercase tracking-wide text-white md:text-5xl">
          Feche seu time ideal
        </h2>
        <p className="mt-4 text-[var(--dl-muted-light)]">
          Veja o elo do lobby, quem criou a sala, quantas vagas faltam e quais posições o time está procurando.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_LOBBIES.map((lobby) => (
          <div key={lobby.id} className="dl-app-card flex flex-col p-6 transition-transform hover:translate-y-[-2px]">
            {/* Cabeçalho */}
            <div className="mb-4">
              <h3 className="font-['Rajdhani'] text-xl font-bold uppercase text-white">{lobby.title}</h3>
              <div className="mt-2 inline-flex items-center rounded-full border border-[var(--dl-border)] bg-white/[0.04] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--dl-number)]">
                Alvo: {lobby.elo}
              </div>
            </div>

            {/* Resumo */}
            <div className="mb-5 grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--dl-muted-light)]">
              <div className="rounded-lg bg-[var(--dl-surface-2)] p-2">Elo: <span className="text-white">{lobby.elo}</span></div>
              <div className="rounded-lg bg-[var(--dl-surface-2)] p-2">Tam: <span className="text-white">{lobby.size}</span></div>
              <div className="rounded-lg bg-[var(--dl-surface-2)] p-2">Ocup: <span className="text-white">{lobby.occupied}/{lobby.size}</span></div>
              <div className="rounded-lg bg-[var(--dl-surface-2)] p-2 text-[var(--dl-warning)]">Faltam: {lobby.size - lobby.occupied}</div>
            </div>

            {/* Criador */}
            <div className="mb-5 rounded-xl border border-[var(--dl-border)] bg-[var(--dl-surface-2)] p-4">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--dl-muted)]">Criador</div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--dl-surface)] text-[var(--dl-function)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <div className="text-sm">
                  <div className="font-bold text-white">{lobby.creatorRole} <span className="text-[var(--dl-muted-light)]">({lobby.creatorElo})</span></div>
                  <div className="text-xs text-[var(--dl-muted-light)]">WR: <span className="text-[var(--dl-string)]">{lobby.winRate}</span> | KDA: <span className="text-[var(--dl-number)]">{lobby.kda}</span></div>
                </div>
              </div>
            </div>

            {/* Posições */}
            <div className="mb-6 flex-1">
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--dl-muted)]">Procurando</div>
              <div className="flex flex-wrap gap-2">
                {lobby.lookingFor.map((pos, idx) => (
                  <span key={idx} className="inline-flex rounded-full border border-[var(--dl-border)] bg-[var(--dl-surface-2)] px-3 py-1 text-xs font-semibold text-[var(--dl-muted-light)]">
                    {pos}
                  </span>
                ))}
              </div>
            </div>

            {/* Rodapé */}
            <div className="mt-auto flex items-center justify-between border-t border-[var(--dl-border)] pt-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--dl-string)]">
                <span className="h-2 w-2 rounded-full bg-[var(--dl-string)] shadow-[0_0_6px_rgba(59,217,130,0.6)]"></span>
                Online
              </div>
              <DuolootButton size="sm" variant="secondary" className="px-6">Pedir Vaga</DuolootButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
