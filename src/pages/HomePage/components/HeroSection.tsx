import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { lookupValorantProfile, isValorantApiError } from '@/services/valorant';
import { useLanguage } from '@/i18n';

interface StatCardProps {
  value: string;
  label: string;
  color: 'cyan' | 'green' | 'yellow';
}

const colorMap = {
  cyan: 'text-[var(--dl-number)]',
  green: 'text-[var(--dl-string)]',
  yellow: 'text-[var(--dl-warning)]',
};

function GlassStatCard({ value, label, color }: StatCardProps) {
  return (
    <div className="dl-stat-tile flex flex-1 flex-col gap-2">
      <span className={`dl-stat-value ${colorMap[color]}`}>{value}</span>
      <span className="dl-stat-label">{label}</span>
    </div>
  );
}

export function HeroSection() {
  const { messages: copy } = useLanguage();
  const [searchValue, setSearchValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'info' | 'error' | 'success'>('info');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = searchValue.trim();
    if (!trimmed) {
      setFeedback(copy.home.feedbackRequired);
      setFeedbackType('error');
      return;
    }

    const hashIndex = trimmed.lastIndexOf('#');
    if (hashIndex === -1 || hashIndex === 0 || hashIndex === trimmed.length - 1) {
      setFeedback(copy.home.feedbackInvalid);
      setFeedbackType('error');
      return;
    }

    const gameName = trimmed.substring(0, hashIndex).trim();
    const tagLine = trimmed.substring(hashIndex + 1).trim();

    if (!gameName || !tagLine) {
      setFeedback(copy.home.feedbackInvalid);
      setFeedbackType('error');
      return;
    }

    setIsSearching(true);
    setFeedback(copy.home.feedbackSearching);
    setFeedbackType('info');

    try {
      await lookupValorantProfile({ gameName, tagLine, region: 'americas', platform: 'br' });
      setFeedback(copy.home.feedbackFound);
      setFeedbackType('success');
      setTimeout(() => {
        navigate(`/riot/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      }, 500);
    } catch (err) {
      if (isValorantApiError(err)) {
        switch (err.code) {
          case 'PLAYER_NOT_FOUND':
            setFeedback(copy.home.feedbackNotFound.replace('{riotId}', `${gameName}#${tagLine}`));
            break;
          case 'RATE_LIMITED':
            setFeedback(copy.home.feedbackRateLimited);
            break;
          case 'RIOT_API_KEY_MISSING':
            setFeedback(copy.home.feedbackUnavailable);
            break;
          case 'NETWORK_ERROR':
            setFeedback(copy.home.feedbackNetwork);
            break;
          default:
            setFeedback(err.message || copy.home.feedbackGeneric);
        }
      } else {
        setFeedback(copy.home.feedbackUnexpected);
      }
      setFeedbackType('error');
      setIsSearching(false);
    }
  };

  const feedbackColors = {
    info: 'text-[var(--dl-number)]',
    error: 'text-[var(--dl-error)]',
    success: 'text-[var(--dl-string)]',
  };

  return (
    <section className="relative mx-auto flex min-h-[92vh] w-full max-w-[1600px] items-center overflow-hidden px-5 py-10 sm:px-6 lg:px-12">
      <div className="dl-premium-hero grid w-full items-stretch gap-0 lg:grid-cols-[minmax(0,1fr)_360px]" data-watermark="DUO">
        <div className="relative z-[2] px-6 py-12 text-left sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <div className="dl-premium-badge mb-7 px-4 py-2">
            MVP em construção · teste fechado em breve
          </div>

          <h1 className="dl-premium-title mb-6 max-w-4xl text-[clamp(3rem,7vw,6.5rem)] font-black">
            {copy.home.heroTitle}
            <span className="block text-[var(--dl-number)]">Encontre duo. Evolua junto.</span>
          </h1>

          <p className="dl-premium-muted mb-9 max-w-2xl font-['Inter'] text-[1rem] font-light">
            Uma plataforma gamer para conectar jogadores, organizar lobbies, testar missões do Cofre e preparar recursos premium sem prometer o que ainda está em construção.
          </p>

          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="dl-glass group flex w-full items-center gap-2 rounded-2xl p-2 pl-5 transition-all duration-200 focus-within:border-[var(--dl-number)]/40 focus-within:bg-white/[0.06]">
              <Search
                size={18}
                className="shrink-0 text-[var(--dl-muted)] transition-colors group-focus-within:text-[var(--dl-number)]"
              />
              <input
                type="text"
                placeholder={copy.home.riotPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                disabled={isSearching}
                className="min-w-0 flex-1 bg-transparent py-3 font-['Inter'] text-[0.95rem] text-white placeholder-[var(--dl-muted)] focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="dl-red-glow flex shrink-0 items-center gap-2 rounded-xl bg-[var(--dl-keyword)] px-6 py-3 font-black text-[0.78rem] uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-[var(--dl-error)] disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {copy.home.searching}
                  </>
                ) : (
                  copy.home.search
                )}
              </button>
            </div>

            {feedback && (
              <p className={`mt-3 font-['Inter'] text-sm font-semibold ${feedbackColors[feedbackType]}`}>
                {feedback}
              </p>
            )}
          </form>

          <div className="mt-5 flex flex-col gap-1 font-['Inter'] text-[0.82rem] font-medium tracking-wide text-[var(--dl-muted-light)]">
            <p>
              Digite um Riot ID no formato <span className="text-[var(--dl-number)]">Nome#TAG</span> para testar a busca.
            </p>
            <p>
              Lobbies, Cofre e coaches ainda podem usar dados de demonstração enquanto o backend final é ligado.
            </p>
          </div>

          <div className="mt-12 grid w-full gap-3 sm:grid-cols-3">
            <GlassStatCard value="MVP" label="Base em validação" color="cyan" />
            <GlassStatCard value="DEV" label="Dados em auditoria" color="green" />
            <GlassStatCard value="BETA" label="Teste fechado" color="yellow" />
          </div>
        </div>

        <div className="relative hidden min-h-[34rem] items-center justify-center border-l border-white/[0.08] bg-black/10 p-8 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(13,240,255,0.08),transparent_60%)]" />
          <div className="dl-radar" />
          <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between font-mono text-[0.7rem]">
              <span className="text-[var(--dl-number)]">// match.scan()</span>
              <span className="text-[var(--dl-string)]">online</span>
            </div>
            <div className="grid gap-2">
              <div className="h-2 rounded-full bg-white/[0.07]"><div className="h-full w-[86%] rounded-full bg-[linear-gradient(90deg,var(--dl-number),var(--dl-string))]" /></div>
              <div className="h-2 rounded-full bg-white/[0.07]"><div className="h-full w-[64%] rounded-full bg-[linear-gradient(90deg,var(--dl-number),var(--dl-function))]" /></div>
              <div className="h-2 rounded-full bg-white/[0.07]"><div className="h-full w-[78%] rounded-full bg-[linear-gradient(90deg,var(--dl-warning),var(--dl-keyword))]" /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
