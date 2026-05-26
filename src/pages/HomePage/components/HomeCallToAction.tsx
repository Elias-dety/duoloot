import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/i18n';

export function HomeCallToAction() {
  const navigate = useNavigate();
  const { messages: copy } = useLanguage();

  return (
    <section className="relative mx-auto w-full max-w-6xl overflow-hidden px-5 py-24 sm:px-6">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          background: [
            'radial-gradient(ellipse 55% 60% at 50% 50%, rgba(13,240,255,0.07) 0%, transparent 65%)',
            'radial-gradient(ellipse 35% 40% at 20% 60%, rgba(255,70,85,0.05) 0%, transparent 55%)',
            'radial-gradient(ellipse 30% 35% at 80% 30%, rgba(176,132,255,0.05) 0%, transparent 55%)',
          ].join(', '),
        }}
      />

      {/* Glass container */}
      <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] px-8 py-14 text-center backdrop-blur-xl sm:px-16">
        {/* Top accent line */}
        <div
          className="mx-auto mb-8 h-px w-24"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--dl-number), transparent)',
          }}
        />

        <p className="mb-3 font-['Inter'] text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[var(--dl-muted)]">
          Comece agora
        </p>

        <h2 className="mb-5 text-[clamp(1.8rem,4.5vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white">
          Pronto para dominar o ranking?
        </h2>

        <p className="mx-auto mb-10 max-w-md font-['Inter'] text-[0.95rem] font-light leading-[1.8] text-[var(--dl-muted-light)]">
          Junte-se a mais de 12 mil jogadores que já encontraram seus duos e estão subindo de elo.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={() => navigate(ROUTES.REGISTER)}
            className="group inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold text-[0.85rem] uppercase tracking-[0.1em] text-white transition-all duration-200 hover:brightness-110"
            style={{
              background: 'var(--dl-keyword)',
              boxShadow: '0 8px 28px rgba(255,70,85,0.3)',
            }}
          >
            {copy.layout.getDuoloot}
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => navigate(ROUTES.LOBBY)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-8 py-3.5 font-['Inter'] text-[0.85rem] font-medium text-[var(--dl-muted-light)] backdrop-blur-sm transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white"
          >
            Ver lobbies
          </button>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {[
            { label: 'Grátis para começar', color: 'var(--dl-string)' },
            { label: 'Sem cartão de crédito', color: 'var(--dl-number)' },
            { label: 'Cancele quando quiser', color: 'var(--dl-function)' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="h-1 w-1 rounded-full"
                style={{ background: color }}
              />
              <span className="font-['Inter'] text-[0.72rem] text-[var(--dl-muted)]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
