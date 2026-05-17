import React, { useEffect, useState } from 'react';
import { getRecommendedPlayers } from '@/services/recommendations.service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Card, Avatar, Badge, Button } from '@/components/atoms';
import { sendPlayerInvite } from '@/services';
import { usePlayerPresence } from '@/hooks/usePlayerPresence';
import { isPlayerOnline } from '@/utils/presence';

interface RecommendedPlayer {
  player_id: string;
  name?: string;
  nickname: string;
  avatar_url?: string;
  trust_score: number;
  rank?: string;
  main_role?: string;
  secondary_role?: string;
  win_rate: number;
  average_kda?: number;
  matches_played?: number;
  commendations?: number;
  abandons?: number;
  play_style?: string;
  session_focus?: string;
  availability?: string;
  compatibility_score: number;
}

export const RecommendedPlayersPanel: React.FC = () => {
  const { onlineUserIds } = usePlayerPresence();
  const [players, setPlayers] = useState<RecommendedPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [invitingIds, setInvitingIds] = useState<Set<string>>(new Set());
  const [inviteStatus, setInviteStatus] = useState<Record<string, { status: string; message: string }>>({});

  const handleInvite = async (playerId: string) => {
    if (!isSupabaseConfigured) return;
    try {
      setInvitingIds((prev) => new Set(prev).add(playerId));
      const result = await sendPlayerInvite(playerId);

      if (result.success) {
        setInviteStatus((prev) => ({
          ...prev,
          [playerId]: { status: 'sent', message: 'Convite enviado!' },
        }));
      } else {
        setInviteStatus((prev) => ({
          ...prev,
          [playerId]: { status: 'info', message: result.message },
        }));
      }
    } catch (err: unknown) {
      console.error('Error sending invite:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao convidar.';
      setInviteStatus((prev) => ({
        ...prev,
        [playerId]: { status: 'error', message: errorMessage },
      }));
    } finally {
      setInvitingIds((prev) => {
        const next = new Set(prev);
        next.delete(playerId);
        return next;
      });
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError('Recomendações indisponíveis: configure o Supabase.');
      setIsLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const data = await getRecommendedPlayers('valorant', 6);
        setPlayers((data as unknown as RecommendedPlayer[]) || []);
      } catch (err: unknown) {
        console.error('Error fetching recommendations:', err);
        const errorMessage = err instanceof Error ? err.message : '';
        
        if (errorMessage.includes('not found') || errorMessage.includes('PGRST202')) {
          setError('Módulo de recomendações ainda não está ativo.');
        } else {
          setError('Erro ao carregar recomendações táticas.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <Card className="p-6 border-[var(--dl-tactical-red)]/30 bg-[rgba(255,51,102,0.05)] border-dashed">
        <div className="text-center py-4">
          <p className="text-[var(--dl-tactical-red)] text-[12px] font-bold uppercase tracking-[0.12em]">
            Recomendações indisponíveis: configure o Supabase.
          </p>
        </div>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="p-6 border-dashed border-[var(--dl-tactical-line)] bg-white/[0.01]">
        <div className="text-center py-4">
          <p className="text-[var(--dl-tactical-muted)] text-[12px] font-bold uppercase tracking-[0.12em]">
            Entre na sua conta para receber operadores recomendados.
          </p>
        </div>
      </Card>
    );
  }

  if (isLoading && players.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse bg-white/5 border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="h-10 bg-white/10 rounded" />
              <div className="h-10 bg-white/10 rounded" />
            </div>
            <div className="h-8 bg-white/10 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-[var(--dl-tactical-red)]/30 bg-[rgba(255,51,102,0.05)]">
        <p className="text-[var(--dl-tactical-red)] text-center text-[12px] font-bold uppercase tracking-wide">
          SISTEMA // ALERTA: {error}
        </p>
      </Card>
    );
  }

  if (players.length === 0) {
    return (
      <Card className="p-6 bg-white/[0.01] border-white/5 border-dashed">
        <p className="text-[var(--dl-tactical-muted)] text-center text-[12px] font-bold uppercase tracking-[0.12em]">
          Nenhum sinal de jogador compatível no setor atual.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className="h-4 w-1 bg-[var(--dl-tactical-green)] rounded-full" />
           <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">
             Operadores Sugeridos
           </h3>
        </div>
        <Badge variant="success" className="text-[9px]">Match de Afinidade</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <Card key={player.player_id} className="relative p-4 bg-white/[0.02] border-white/5 hover:border-[var(--dl-tactical-green)]/30 transition-all group overflow-hidden">
             {/* Compatibility Indicator */}
             <div className="absolute top-0 right-0 p-2 text-right">
                <span className="block text-[14px] font-black text-[var(--dl-tactical-green)] leading-none drop-shadow-[0_0_8px_rgba(56,242,139,0.4)]">{Math.round(player.compatibility_score || 0)}%</span>
                <span className="block text-[7px] uppercase tracking-tighter text-[var(--dl-tactical-muted)] font-bold">Compatibilidade</span>
             </div>

             <div className="flex items-center gap-3 mb-5">
                <div className="relative flex-shrink-0">
                   <Avatar 
                     src={player.avatar_url} 
                     fallback={player.nickname || 'OP'} 
                     size="md" 
                   />
                   <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0B0D13] ${
                     isPlayerOnline(player.player_id, onlineUserIds)
                       ? 'bg-[var(--dl-tactical-green)] shadow-[0_0_6px_rgba(56,242,139,0.5)]'
                       : 'bg-white/20'
                   }`} />
                </div>
                <div className="overflow-hidden">
                   <h4 className="text-white font-bold truncate font-['Rajdhani'] text-lg leading-tight group-hover:text-[var(--dl-tactical-yellow)] transition-colors">{player.nickname || 'Operador'}</h4>
                   <div className="flex items-center gap-1.5 min-w-0">
                     <p className="text-[9px] text-[var(--dl-tactical-muted)] truncate uppercase tracking-[0.15em] font-medium leading-none">{player.name || 'Desconhecido'}</p>
                     <span className={`text-[7px] font-black uppercase tracking-widest leading-none ${
                       isPlayerOnline(player.player_id, onlineUserIds)
                         ? 'text-[var(--dl-tactical-green)]'
                         : 'text-[var(--dl-tactical-muted)]'
                     }`}>
                       • {isPlayerOnline(player.player_id, onlineUserIds) ? 'ON' : 'OFF'}
                     </span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-black/40 p-2.5 rounded [clip-path:var(--dl-cut-button)] border border-white/5">
                   <p className="text-[7px] uppercase text-[var(--dl-tactical-muted)] font-black tracking-widest mb-1">Rank</p>
                   <p className="text-[11px] text-[var(--dl-tactical-yellow)] font-black uppercase leading-none">{player.rank || 'Livre'}</p>
                </div>
                <div className="bg-black/40 p-2.5 rounded [clip-path:var(--dl-cut-button)] border border-white/5">
                   <p className="text-[7px] uppercase text-[var(--dl-tactical-muted)] font-black tracking-widest mb-1">Função</p>
                   <p className="text-[11px] text-white font-black uppercase leading-none">{player.main_role || 'Flex'}</p>
                </div>
             </div>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                <div className="flex flex-col">
                   <span className="text-[7px] uppercase text-[var(--dl-tactical-muted)] font-bold tracking-widest mb-0.5">Trust Score</span>
                   <div className="flex items-center gap-1.5">
                      <div className="h-1 w-8 bg-white/10 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-[var(--dl-tactical-green)]" 
                           style={{ width: `${player.trust_score || 0}%` }} 
                         />
                      </div>
                      <span className="text-[10px] font-black text-white">{player.trust_score || 0}</span>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[7px] uppercase text-[var(--dl-tactical-muted)] font-bold tracking-widest mb-0.5">Win Rate</span>
                   <span className="text-[11px] font-black text-[var(--dl-tactical-green)] leading-none">{(player.win_rate || 0).toFixed(1)}%</span>
                </div>
             </div>

             <div className="mt-5">
                <Button 
                  variant={inviteStatus[player.player_id]?.status === 'sent' ? 'success' : 'outline'}
                  size="sm" 
                  fullWidth
                  onClick={() => handleInvite(player.player_id)}
                  disabled={invitingIds.has(player.player_id) || inviteStatus[player.player_id]?.status === 'sent'}
                >
                   {invitingIds.has(player.player_id) ? (
                     'ENVIANDO...'
                   ) : inviteStatus[player.player_id]?.status === 'sent' ? (
                     'CONVITE ENVIADO'
                   ) : (
                     'CONVIDAR PARA DUO'
                   )}
                </Button>
                {inviteStatus[player.player_id]?.status && inviteStatus[player.player_id]?.status !== 'sent' && (
                  <p className={`mt-2 text-center text-[9px] font-bold uppercase ${inviteStatus[player.player_id]?.status === 'error' ? 'text-[var(--dl-tactical-red)]' : 'text-[var(--dl-tactical-yellow)]'}`}>
                    {inviteStatus[player.player_id]?.message}
                  </p>
                )}
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
