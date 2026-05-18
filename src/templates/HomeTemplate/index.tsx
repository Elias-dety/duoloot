import { Play, ShieldCheck, Swords, Trophy, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import type { Winner } from '@/components/organisms/WinnersList';
import type { Event } from '@/schemas/event.schema';
import {
  DuolootBadge,
  DuolootButton,
  DuolootCard,
  DuolootImagePlaceholder,
  DuolootMetricCard,
  DuolootSectionTitle,
} from '@/components/duoloot';

export interface HomeTemplateProps {
  activeEvent: Event | null;
  recentWinners: Winner[];
  isLoading: boolean;
  isError: boolean;
}

export const HomeTemplate = ({ activeEvent, recentWinners }: HomeTemplateProps) => {
  const navigate = useNavigate();

  const metrics = [
    { label: 'Trusted by Gamers', value: '100K+' },
    { label: 'Successful Matches', value: '2M+' },
    { label: 'Rewards Claimed', value: '500K+' },
    { label: 'Always Secure', value: '100%' },
  ];

  const features = [
    {
      title: 'Smart Matchmaking',
      text: 'Perfil, estilo, rank e objetivos se cruzam para sugerir o duo certo com menos ruído.',
      icon: Users,
    },
    {
      title: 'Lobby Finder',
      text: 'Descubra squads ao vivo, analise compatibilidade e entre no lobby certo no momento certo.',
      icon: Swords,
    },
    {
      title: 'Loot Rewards',
      text: 'Missões, chaves e o Vault transformam partidas em progresso real dentro do ecossistema.',
      icon: Trophy,
    },
  ];

  const winnersCount = recentWinners.length > 0 ? `${recentWinners.length}+` : '3+';
  const vaultTitle = activeEvent?.title || 'Complete Missions. Unlock the Vault.';

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-14 pt-4 md:px-6 md:pt-6">
      <section className="dl-panel overflow-hidden px-5 py-6 md:px-8 md:py-9">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="space-y-6">
            <DuolootBadge variant="accent">Play together. Earn together.</DuolootBadge>

            <div className="space-y-4">
              <h1 className="font-['Rajdhani'] text-[clamp(2.7rem,7vw,5.75rem)] font-bold uppercase leading-[0.88] text-white">
                Find your duo. Win together. Earn epic loot.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--dl-muted-light)]">
                Duoloot conecta jogadores, melhora lobbies e recompensa a comunidade com missões, progresso e loot dentro do Vault.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <DuolootButton size="lg" onClick={() => navigate(ROUTES.REGISTER)}>
                Get Duoloot
              </DuolootButton>
              <DuolootButton variant="secondary" size="lg" onClick={() => navigate(ROUTES.LOBBY)}>
                <Play className="h-4 w-4" aria-hidden="true" />
                Ver lobbies
              </DuolootButton>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-[var(--dl-border)] bg-white/[0.03] p-4">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Vault live</p>
                <p className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white">{winnersCount}</p>
                <p className="mt-1 text-sm text-[var(--dl-muted-light)]">winners recently rewarded</p>
              </div>
              <div className="rounded-[1.35rem] border border-[var(--dl-border)] bg-white/[0.03] p-4">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">Current focus</p>
                <p className="mt-2 font-['Rajdhani'] text-3xl font-bold uppercase text-white">Lobby + Vault</p>
                <p className="mt-1 text-sm text-[var(--dl-muted-light)]">match faster, progress harder</p>
              </div>
            </div>
          </div>

          <DuolootImagePlaceholder label="Hero visual placeholder for Duoloot Red Vault" className="min-h-[320px] lg:min-h-[100%]" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <DuolootMetricCard key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </section>

      <section id="features" className="dl-panel px-5 py-6 md:px-8 md:py-8">
        <DuolootSectionTitle
          eyebrow="Features"
          title="Competitive matchmaking, cleaner squads, stronger rewards."
          subtitle="A experiência Red Vault organiza descoberta, decisão e recompensa em um fluxo único."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {features.map(({ title, text, icon: Icon }) => (
            <DuolootCard key={title} variant="interactive" className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-[var(--dl-border-red)] bg-[rgba(255,0,0,0.12)]">
                <Icon className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-['Rajdhani'] text-2xl font-bold uppercase text-white">{title}</h3>
              <p className="text-sm leading-7 text-[var(--dl-muted-light)]">{text}</p>
            </DuolootCard>
          ))}
        </div>
      </section>

      <section id="vault" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <DuolootCard variant="interactive" className="space-y-6">
          <DuolootSectionTitle
            eyebrow="Vault"
            title={vaultTitle}
            subtitle="Aceite missões, ganhe chaves do Vault e desbloqueie recompensas premium que acompanham sua rotina competitiva."
          />
          <div className="flex flex-wrap gap-3">
            <DuolootButton onClick={() => navigate(ROUTES.VAULT)}>Explore Vault</DuolootButton>
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
            <DuolootImagePlaceholder label="Vault placeholder image" className="min-h-[240px]" />
            <div className="rounded-[1.35rem] border border-[var(--dl-border)] bg-white/[0.03] p-5">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">How it works</p>
              <ol className="mt-4 space-y-4 text-sm text-[var(--dl-muted-light)]">
                <li><span className="font-semibold text-white">1.</span> Accept Missions</li>
                <li><span className="font-semibold text-white">2.</span> Earn Vault Keys</li>
                <li><span className="font-semibold text-white">3.</span> Unlock Rewards</li>
              </ol>
            </div>
          </div>
        </DuolootCard>

        <DuolootCard variant="accent" className="space-y-6">
          <DuolootSectionTitle
            eyebrow="Recommended Lobby"
            title="The right players. Right when you need them."
            subtitle="Disponibilidade ao vivo, equilíbrio de time e melhor conexão para entrar sem perder tempo."
          />
          <ul className="space-y-3 text-sm text-[var(--dl-muted-light)]">
            {[
              'Live player availability',
              'Balanced teams & fair matches',
              'Low ping, better connection',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-[1rem] border border-[var(--dl-border)] bg-black/20 px-4 py-3">
                <ShieldCheck className="h-4 w-4 text-[var(--dl-red-soft)]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-[1.35rem] border border-[var(--dl-border)] bg-black/20 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-['Rajdhani'] text-2xl font-bold uppercase text-white">Lobby recomendado</p>
                <p className="mt-1 text-sm text-[var(--dl-muted-light)]">Valorant • Diamond+ • São Paulo</p>
              </div>
              <DuolootBadge variant="accent">92% match</DuolootBadge>
            </div>
            <div className="mt-5 space-y-3 text-sm text-[var(--dl-muted-light)]">
              <div className="flex items-center justify-between rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.03] px-4 py-3">
                <span>Nyra#777</span>
                <span>Controller</span>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.03] px-4 py-3">
                <span>Vexon#101</span>
                <span>Duelist</span>
              </div>
              <div className="flex items-center justify-between rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.03] px-4 py-3">
                <span>Locke#515</span>
                <span>Initiator</span>
              </div>
            </div>
            <DuolootButton className="mt-5 w-full" onClick={() => navigate(ROUTES.LOBBY)}>
              Join Lobby
            </DuolootButton>
          </div>
        </DuolootCard>
      </section>

      <section className="dl-panel px-5 py-8 text-center md:px-8 md:py-10">
        <DuolootSectionTitle
          align="center"
          eyebrow="Final CTA"
          title="Squad up. Play hard. Get rewarded."
          subtitle="Entre no ecossistema Red Vault e transforme matchmaking, lobby e recompensa em um fluxo só."
        />
        <DuolootButton className="mt-8" size="lg" onClick={() => navigate(ROUTES.REGISTER)}>
          Get Duoloot
        </DuolootButton>
      </section>
    </div>
  );
};
