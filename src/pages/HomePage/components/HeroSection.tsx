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
    <div className="flex flex-1 flex-col gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.07]">
      <span className={`font-mono text-2xl font-bold leading-none ${colorMap[color]}`}>
        {value}
      </span>
      <span className="font-['Inter'] text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[var(--dl-muted)]">
        {label}
      </span>
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
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 60% 50% at 15% 40%, rgba(13,240,255,0.07) 0%, transparent 60%)',
            'radial-gradient(ellipse 50% 45% at 85% 70%, rgba(255,70,85,0.07) 0%, transparent 55%)',
            'radial-gradient(ellipse 40% 35% at 60% 15%, rgba(176,132,255,0.05) 0%, transparent 55%)',
          ].join(', '),
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-0">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.05] px-4 py-1.5 backdrop-blur-sm">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--dl-number)]"
            style={{ boxShadow: '0 0 6px var(--dl-number)' }}
          />
          <span className="font-['Inter'] text-[0.68rem] font-medium uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
            MVP em construção · teste fechado em breve
          </span>
        </div>

        <h1 className="mb-5 text-[clamp(2.8rem,7vw,5rem)] font-bold leading-[1.04] tracking-[-0.03em] text-white">
          {copy.home.heroTitle}
          <span
            className="block"
            style={{ color: 'var(--dl-number)', fontWeight: 700 }}
          >
            Encontre duo. Evolua junto.
          </span>
        </h1>

        <p className="mb-10 max-w-lg font-['Inter'] text-[1rem] font-300 leading-[1.75] text-[var(--dl-muted-light)]">
          Uma plataforma gamer para conectar jogadores, organizar lobbies, testar missões do Cofre e preparar recursos premium sem prometer o que ainda está em construção.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-xl">
          <div
            className="group flex w-full items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] p-2 pl-5 backdrop-blur-xl transition-all duration-200 focus-within:border-[var(--dl-number)]/40 focus-within:bg-white/[0.06]"
          >
            <Search
              size={16}
              className="shrink-0 text-[var(--dl-muted)] transition-colors group-focus-within:text-[var(--dl-number)]"
            />
            <input
              type="text"
              placeholder={copy.home.riotPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={isSearching}
              className="flex-1 bg-transparent py-2 font-['Inter'] text-[0.9rem] text-white placeholder-[var(--dl-muted)] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-[var(--dl-keyword)] px-5 py-2.5 font-semibold text-[0.8rem] uppercase tracking-[0.1em] text-white transition-all duration-200 hover:bg-[var(--dl-error)] disabled:opacity-50"
              style={{ boxShadow: '0 4px 16px rgba(255,70,85,0.28)' }}
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

        <div className="mt-5 flex flex-col items-center gap-1 font-['Inter'] text-[0.82rem] font-500 tracking-wide text-[var(--dl-muted-light)]">
          <p>
            Digite um Riot ID no formato <span className="text-[var(--dl-number)]">Nome#TAG</span> para testar a busca.
          </p>
          <p>
            Lobbies, Cofre e coaches ainda podem usar dados de demonstração enquanto o backend final é ligado.
          </p>
        </div>

        <div className="mt-12 flex w-full flex-col gap-3 sm:flex-row">
          <GlassStatCard value="MVP" label="Base em validação" color="cyan" />
          <GlassStatCard value="DEV" label="Dados em auditoria" color="green" />
          <GlassStatCard value="BETA" label="Teste fechado" color="yellow" />
        </div>
      </div>
    </section>
  );
}
