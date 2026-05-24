import React from 'react';
import { Button, MissingImagePlaceholder } from '@/components/atoms';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/i18n';

export function FreeTournamentsSection() {
  const navigate = useNavigate();
  const { messages: copy } = useLanguage();
  const [showRules, setShowRules] = React.useState(false);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <div className="mb-4 inline-flex items-center rounded-full border border-[var(--dl-border)] bg-white/[0.04] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--dl-warning)]">
            {copy.home.freeTournaments}
          </div>
          <h2 className="mb-6 font-['Rajdhani'] text-3xl font-bold uppercase tracking-wide text-white md:text-5xl">
            {copy.home.tournamentsTitle}
          </h2>
          <p className="mb-8 text-base leading-relaxed text-[var(--dl-muted-light)] sm:text-lg">
            {copy.home.tournamentsDescription}
          </p>

          <div className="mb-10 space-y-4">
            {copy.home.tournamentSteps.map((step, index) => (
              <div key={step} className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--dl-border)] bg-[var(--dl-surface-2)] text-sm font-bold text-[var(--dl-number)]">{index + 1}</div>
                <p className="pt-1 font-medium text-[var(--dl-text)]">{step}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button variant="primary" onClick={() => navigate(ROUTES.VAULT)}>
              {copy.home.joinFree}
            </Button>
            <Button variant="secondary" onClick={() => setShowRules((current) => !current)}>
              {copy.home.viewRules}
            </Button>
          </div>

          {showRules ? (
            <div className="mt-5 rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.04] p-4 text-sm leading-6 text-[var(--dl-muted-light)]">
              <p>Participe do Cofre ativo, complete as missões dentro do prazo e acompanhe sua posição no ranking. As recompensas são liberadas conforme as regras do evento exibidas na página do Cofre.</p>
            </div>
          ) : null}
        </div>

        <div className="relative pb-16 sm:pb-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(13,240,255,0.08)_0%,transparent_70%)]"></div>

          <MissingImagePlaceholder
            text={copy.home.vaultImagePlaceholder}
            className="aspect-[4/3] w-full border-[rgba(13,240,255,0.15)] shadow-[0_0_40px_rgba(13,240,255,0.05)]"
          />

          <div className="absolute -bottom-2 left-0 right-0 flex flex-col gap-3 sm:-bottom-4 sm:left-4 sm:right-4">
            <div className="dl-app-card flex items-center justify-between border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3 backdrop-blur-sm sm:p-4">
              <div>
                <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--dl-warning)]">{copy.home.activeMission}</div>
                <div className="text-sm font-bold text-white">{copy.home.missionWin}</div>
              </div>
              <div className="text-right">
                <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--dl-muted)]">{copy.home.progress}</div>
                <div className="font-bold text-[var(--dl-number)]">66%</div>
              </div>
            </div>

            <div className="dl-app-card flex items-center justify-between border border-[var(--dl-border)] bg-[var(--dl-surface)] p-3 backdrop-blur-sm sm:p-4">
              <div>
                <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--dl-string)]">{copy.home.objective}</div>
                <div className="text-sm font-bold text-white">{copy.home.missionKills}</div>
              </div>
              <div className="text-right">
                <div className="text-[0.65rem] font-bold uppercase tracking-wider text-[var(--dl-muted)]">{copy.home.progress}</div>
                <div className="font-bold text-[var(--dl-number)]">45%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
