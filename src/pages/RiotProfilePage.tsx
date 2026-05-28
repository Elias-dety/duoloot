import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lookupValorantProfile, isValorantApiError } from '@/services/valorant';
import { PlayerStatsOverview } from '@/features/riot/components/PlayerStatsOverview';
import { MatchHistoryList } from '@/features/riot/components/MatchHistoryList';
import { AgentStatsGrid } from '@/features/riot/components/AgentStatsGrid';
import { MapStatsGrid } from '@/features/riot/components/MapStatsGrid';
import { Card } from '@/components/atoms';
import { LoadingState, EmptyState } from '@/components/molecules';
import { getValorantRankIcon } from '@/utils/valorantRankIcon';
import type { ValorantProfileLookupResult } from '@/types/valorant.types';

export default function RiotProfilePage() {
  const { gameName, tagLine } = useParams<{ gameName: string; tagLine: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ValorantProfileLookupResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!gameName || !tagLine) {
      setError('Riot ID inválido.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setErrorCode(null);

      const result = await lookupValorantProfile({
        gameName: decodeURIComponent(gameName),
        tagLine: decodeURIComponent(tagLine),
        region: 'americas',
        platform: 'br',
      });

      setProfile(result);
    } catch (err) {
      if (isValorantApiError(err)) {
        setError(err.message);
        setErrorCode(err.code);
      } else {
        setError('Erro inesperado ao buscar perfil.');
        setErrorCode('UNKNOWN_ERROR');
      }
    } finally {
      setIsLoading(false);
    }
  }, [gameName, tagLine]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // --- Loading state ---
  if (isLoading) {
    return <LoadingState message="Escaneando perfil Riot..." />;
  }

  // --- Error states ---
  if (error) {
    const isNotFound = errorCode === 'PLAYER_NOT_FOUND';
    return (
      <EmptyState
        icon={isNotFound ? undefined : 'error'}
        title={isNotFound ? 'Jogador não encontrado' : 'Erro ao buscar perfil'}
        description={error}
        actionLabel="Buscar outro jogador"
        onAction={() => navigate('/')}
      />
    );
  }

  if (!profile) {
    return (
      <EmptyState
        title="Perfil não encontrado"
        description="Nenhum dado disponível para este Riot ID."
        actionLabel="Buscar outro jogador"
        onAction={() => navigate('/')}
      />
    );
  }

  const rankIconUrl = getValorantRankIcon(profile.stats?.rank);

  // --- Map data to component interfaces ---
  const statsForOverview = profile.stats
    ? {
        winRate: profile.stats.winRate,
        kda: profile.stats.averageKda,
        headshotRate: profile.stats.headshotRate,
        matchesPlayed: profile.stats.matchesPlayed,
        wins: profile.stats.wins,
        losses: profile.stats.losses,
        averageScore: profile.stats.averageScore,
        currentRank: profile.stats.rank || 'Unranked',
      }
    : undefined;

  const matchesForList = profile.matches?.map((m) => ({
    id: m.id,
    result: m.result,
    agent: m.agent,
    agentImageUrl: m.agentImageUrl,
    map: m.map,
    score: m.score,
    kda: m.kda,
    kdRatio: m.kdRatio,
    combatScore: m.combatScore,
    date: m.date,
  }));

  const agentStatsForGrid = profile.stats?.agentStats?.map((a) => ({
    agentName: a.agentName,
    agentRole: a.agentRole || '',
    winRate: a.winRate,
    matchesPlayed: a.matchesPlayed,
    kda: a.kda,
  }));

  const mapStatsForGrid = profile.stats?.mapStats?.map((m) => ({
    mapName: m.mapName,
    winRate: m.winRate,
    matchesPlayed: m.matchesPlayed,
  }));

  const riotId = `${profile.account.gameName}#${profile.account.tagLine}`;
  const syncTime = profile.lastSyncAt
    ? new Date(profile.lastSyncAt).toLocaleString('pt-BR')
    : 'N/A';

  return (
    <div className="mx-auto w-full max-w-[1240px] space-y-6 px-3 pb-12 md:px-6">
      {/* Back button */}
      <button
        type="button"
        className="dl-btn dl-btn-blue mb-4 flex h-[40px] items-center gap-2 px-6"
        onClick={() => navigate('/')}
      >
        <span className="text-[14px]">◄</span> Buscar outro jogador
      </button>

      {/* Header HUD */}
      <Card variant="elevated" className="relative overflow-hidden p-[18px] md:p-[28px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,70,85,0.12),transparent_20rem),linear-gradient(120deg,transparent,rgba(255,70,85,0.04),transparent)]" />
        <div className="relative z-[2]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className="dl-hud-label"
              style={{
                color: 'var(--dl-error)',
                borderColor: 'rgba(var(--dl-error-rgb),0.34)',
                background: 'rgba(var(--dl-error-rgb),0.08)',
              }}
            >
              RIOT PROFILE SCANNER // LIVE DATA
            </span>
            {profile.cached && (
              <span
                className="dl-hud-label"
                style={{
                  color: 'var(--dl-warning)',
                  borderColor: 'rgba(var(--dl-warning-rgb),0.34)',
                  background: 'rgba(var(--dl-warning-rgb),0.08)',
                }}
              >
                CACHED
              </span>
            )}
          </div>

          <h1 className="dl-title mb-3 text-[clamp(28px,5vw,48px)] leading-[0.9]">
            <span className="text-[var(--dl-error)] drop-shadow-[0_0_24px_rgba(var(--dl-error-rgb),0.3)]">
              {profile.account.gameName}
            </span>
            <span className="text-[var(--dl-muted-light)]">#{profile.account.tagLine}</span>
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            {profile.stats?.rank && profile.stats.rank !== 'Unranked' && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted)]">
                  Rank
                </span>
                {rankIconUrl && (
                  <img
                    src={rankIconUrl}
                    alt={`Elo ${profile.stats.rank}`}
                    className="h-8 w-8 object-contain drop-shadow-[0_0_12px_rgba(var(--dl-number-rgb),0.3)]"
                    loading="lazy"
                  />
                )}
                <span className="font-bold text-[var(--dl-number)]">{profile.stats.rank}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted)]">
                Região
              </span>
              <span className="font-bold text-[var(--dl-muted-light)] uppercase">
                {profile.region}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--dl-muted)]">
                Última sync
              </span>
              <span className="font-bold text-[var(--dl-muted-light)]">{syncTime}</span>
            </div>
          </div>

          <p className="dl-muted mt-4 max-w-[600px] text-[14px] leading-[1.65]">
            Dados reais do jogador via Riot Games API. Estatísticas calculadas a partir das últimas{' '}
            {profile.stats?.matchesPlayed || 0} partidas.
          </p>
        </div>
      </Card>

      {/* Stats Overview */}
      <PlayerStatsOverview stats={statsForOverview} />

      {/* Match History */}
      <MatchHistoryList matches={matchesForList} />

      {/* Agent & Map Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <AgentStatsGrid stats={agentStatsForGrid} />
        <MapStatsGrid stats={mapStatsForGrid} />
      </div>

      {/* Info banner when no match data */}
      {(!profile.matches || profile.matches.length === 0) && profile.account && (
        <Card variant="muted" className="flex flex-col items-center justify-center p-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--dl-warning)] mb-2">
            Conta Riot encontrada
          </p>
          <p className="text-xs text-[var(--dl-muted-light)] text-center max-w-md mb-6">
            O Riot ID <strong>{riotId}</strong> foi localizado, mas os dados de partidas podem não
            estar disponíveis. Isso ocorre porque precisamos de sua permissão explícita (Riot Sign-On)
            para buscar suas partidas.
          </p>
          <button
            type="button"
            className="dl-btn dl-btn-blue h-[40px] px-6"
            onClick={() => navigate('/riot/connect')}
          >
            Conectar conta Riot para liberar estatísticas completas
          </button>
        </Card>
      )}

      {/* Debug Block */}
      {import.meta.env.DEV && (
        <Card className="mt-8 p-4 bg-black/50 border-[var(--dl-keyword)]/30">
          <h3 className="text-sm font-bold text-[var(--dl-keyword)] mb-2">🔧 Debug Mode (Apenas DEV)</h3>
          <pre className="text-[10px] text-[var(--dl-string)] overflow-x-auto whitespace-pre-wrap max-h-96">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}
