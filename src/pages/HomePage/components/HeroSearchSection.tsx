import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms';
import { lookupValorantProfile, isValorantApiError } from '@/services/valorant';

export function HeroSearchSection() {
  const [searchValue, setSearchValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'info' | 'error' | 'success'>('info');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = searchValue.trim();
    if (!trimmed) {
      setFeedback('Digite um Riot ID para buscar.');
      setFeedbackType('error');
      return;
    }

    // Parsear Riot ID (Nome#Tag)
    const hashIndex = trimmed.lastIndexOf('#');
    if (hashIndex === -1 || hashIndex === 0 || hashIndex === trimmed.length - 1) {
      setFeedback('Formato inválido. Use: Nome#Tag (ex: DÉTY#2269)');
      setFeedbackType('error');
      return;
    }

    const gameName = trimmed.substring(0, hashIndex).trim();
    const tagLine = trimmed.substring(hashIndex + 1).trim();

    if (!gameName || !tagLine) {
      setFeedback('Formato inválido. Use: Nome#Tag (ex: DÉTY#2269)');
      setFeedbackType('error');
      return;
    }

    setIsSearching(true);
    setFeedback('Buscando perfil na Riot API...');
    setFeedbackType('info');

    try {
      // Chamar a Edge Function real
      await lookupValorantProfile({
        gameName,
        tagLine,
        region: 'americas',
        platform: 'br',
      });

      setFeedback('Perfil encontrado! Redirecionando...');
      setFeedbackType('success');

      // Navegar para a página de perfil Riot
      setTimeout(() => {
        navigate(`/riot/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
      }, 500);
    } catch (err) {
      if (isValorantApiError(err)) {
        switch (err.code) {
          case 'PLAYER_NOT_FOUND':
            setFeedback(`Jogador "${gameName}#${tagLine}" não encontrado na Riot.`);
            break;
          case 'RATE_LIMITED':
            setFeedback('Muitas buscas seguidas. Aguarde alguns segundos.');
            break;
          case 'RIOT_API_KEY_MISSING':
            setFeedback('Serviço temporariamente indisponível. Tente novamente mais tarde.');
            break;
          case 'NETWORK_ERROR':
            setFeedback('Erro de conexão. Verifique sua internet.');
            break;
          default:
            setFeedback(err.message || 'Erro ao buscar perfil.');
        }
      } else {
        setFeedback('Erro inesperado. Tente novamente.');
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
            placeholder="Digite seu Riot ID (Ex: DÉTY#2269)"
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
                Buscando...
              </span>
            ) : (
              'Buscar'
            )}
          </Button>
        </div>
        {feedback && (
          <div className={`mt-4 text-sm font-semibold ${feedbackColors[feedbackType]}`}>
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
