import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms';
import { lookupValorantProfile, isValorantApiError } from '@/services/valorant';
import { useLanguage } from '@/i18n';

export function HeroSearchSection() {
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
      await lookupValorantProfile({
        gameName,
        tagLine,
        region: 'americas',
        platform: 'br',
      });

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
    <section className="relative flex min-h-screen flex-col items-center justify-center px-5 py-16 text-center sm:px-6 sm:py-20">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--dl-border)] bg-white/[0.04] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--dl-muted-light)]">
        <span className="h-2 w-2 rounded-full bg-[var(--dl-keyword)] shadow-[0_0_8px_rgb(var(--dl-red-rgb)/0.8)]"></span>
        {copy.home.heroBadge}
      </div>

      <h1 className="mb-8 font-['Rajdhani'] text-4xl font-bold uppercase tracking-wide text-white md:text-6xl lg:text-7xl">
        {copy.home.heroTitle}
      </h1>

      <form onSubmit={handleSearch} className="relative z-10 w-full max-w-2xl">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder={copy.home.riotPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            disabled={isSearching}
            className="h-14 w-full flex-1 rounded-full border border-[var(--dl-border)] bg-[var(--dl-surface)] px-6 text-[var(--dl-text)] placeholder-[var(--dl-muted)] focus:border-[var(--dl-number)] focus:outline-none disabled:opacity-50"
          />
          <Button
            type="submit"
            variant="primary"
            className="h-14 rounded-full px-8 text-sm sm:w-auto"
            disabled={isSearching}
          >
            {isSearching ? (
              <span className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {copy.home.searching}
              </span>
            ) : (
              copy.home.search
            )}
          </Button>
        </div>
        {feedback && (
          <div className={`mt-4 text-sm font-semibold ${feedbackColors[feedbackType]}`}>
            {feedback}
          </div>
        )}
      </form>

      <div className="mt-12 text-sm font-semibold tracking-wider text-[var(--dl-muted-light)] md:text-base">
        <p className="mb-1">
          <span className="text-[var(--dl-number)]">{copy.home.syntaxOneA}</span> {copy.home.syntaxOneB} <span className="text-[var(--dl-number)]">{copy.home.syntaxOneC}</span>
        </p>
        <p className="mb-1">
          <span className="text-[var(--dl-number)]">{copy.home.syntaxTwoA}</span> <span className="text-[var(--dl-warning)]">{copy.home.syntaxTwoB}</span> {copy.home.syntaxTwoC} <span className="text-[var(--dl-function)]">{copy.home.syntaxTwoD}</span>
        </p>
        <p>
          <span className="text-[var(--dl-string)]">{copy.home.syntaxThreeA}</span> {copy.home.syntaxThreeB} <span className="text-[var(--dl-keyword)]">{copy.home.syntaxThreeC}</span>
        </p>
      </div>
    </section>
  );
}
