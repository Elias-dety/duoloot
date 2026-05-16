import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getMyPendingInvites, respondPlayerInvite } from '@/services';
import { Card, Avatar, Button, Badge } from '@/components/atoms';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface PendingInvite {
  id: string;
  sender_id: string;
  message: string | null;
  created_at: string;
  sender: {
    id: string;
    name: string;
    nickname: string;
    avatar_url: string;
    trust_score: number;
  };
}

export const PendingInvitesPanel: React.FC = () => {
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const isMounted = useRef(true);

  const fetchInvites = useCallback(async (options?: { silent?: boolean }) => {
    if (!isSupabaseConfigured) return;
    try {
      if (!options?.silent) setIsLoading(true);
      const data = await getMyPendingInvites();
      if (isMounted.current) {
        setInvites((data as PendingInvite[]) || []);
      }
    } catch (err: unknown) {
      console.error('Error fetching invites:', err);
      if (!options?.silent && isMounted.current) {
        setError('Falha ao sincronizar convites.');
      }
    } finally {
      if (!options?.silent && isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    
    if (isSupabaseConfigured) {
      fetchInvites();

      const channel = supabase
        .channel('pending-invites-realtime-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'player_invites',
          },
          () => {
            fetchInvites({ silent: true });
          }
        )
        .subscribe();

      return () => {
        isMounted.current = false;
        supabase.removeChannel(channel);
      };
    }

    return () => {
      isMounted.current = false;
    };
  }, [fetchInvites]);

  const handleResponse = async (inviteId: string, status: 'accepted' | 'declined') => {
    if (!isSupabaseConfigured) return;
    try {
      setRespondingId(inviteId);
      setError(null);
      setSuccessMsg(null);
      
      const result = await respondPlayerInvite(inviteId, status);
      
      if (!isMounted.current) return;

      if (result.success) {
        setInvites(prev => prev.filter(inv => inv.id !== inviteId));
        setSuccessMsg(status === 'accepted' ? 'Operação autorizada: Convite aceito.' : 'Operação encerrada: Convite recusado.');
        
        setTimeout(() => {
          if (isMounted.current) setSuccessMsg(null);
        }, 3000);
      } else {
        setError(result.message);
      }
    } catch (err: unknown) {
      console.error('Error responding to invite:', err);
      if (isMounted.current) setError('Erro ao processar resposta.');
    } finally {
      if (isMounted.current) setRespondingId(null);
    }
  };

  if (!isSupabaseConfigured) return null;

  if (isLoading && invites.length === 0) {
    return (
      <Card className="p-4 animate-pulse border-white/5 bg-white/[0.02]">
        <div className="h-4 w-32 bg-white/10 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-24 bg-white/10 rounded" />
        </div>
      </Card>
    );
  }

  if (invites.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className="h-4 w-1 bg-[var(--dl-tactical-blue)] rounded-full" />
           <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-white">
             Sinais de Convite
           </h3>
        </div>
        <Badge variant="info" className="text-[9px]">{invites.length} Pendentes</Badge>
      </div>

      {successMsg && (
        <div className="p-3 bg-[var(--dl-tactical-green)]/10 border border-[var(--dl-tactical-green)]/20 rounded mb-2 [clip-path:var(--dl-cut-button)]">
          <p className="text-[10px] text-[var(--dl-tactical-green)] font-bold uppercase text-center">{successMsg}</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-[var(--dl-tactical-red)]/10 border border-[var(--dl-tactical-red)]/20 rounded mb-2 [clip-path:var(--dl-cut-button)]">
          <p className="text-[10px] text-[var(--dl-tactical-red)] font-bold uppercase text-center">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {invites.map((invite) => (
          <Card key={invite.id} className="relative p-4 bg-white/[0.03] border-white/10 hover:border-[var(--dl-tactical-blue)]/30 transition-all overflow-hidden">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <Avatar src={invite.sender?.avatar_url} fallback={invite.sender?.nickname || 'OP'} size="md" />
                <div>
                  <h4 className="text-white font-bold font-['Rajdhani'] text-lg leading-none">{invite.sender?.nickname || 'Operador'}</h4>
                  <p className="text-[9px] text-[var(--dl-tactical-muted)] uppercase tracking-widest mt-1.5 font-medium">
                    Detectado {formatDistanceToNow(new Date(invite.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[8px] uppercase text-[var(--dl-tactical-muted)] block font-black tracking-widest mb-0.5">Trust Score</span>
                <span className="text-[14px] font-black text-[var(--dl-tactical-green)] drop-shadow-[0_0_8px_rgba(56,242,139,0.3)]">{invite.sender?.trust_score || 0}</span>
              </div>
            </div>

            {invite.message && (
              <div className="bg-black/40 p-3 rounded mb-4 border border-white/5 italic text-[11px] text-white/70 leading-relaxed">
                "{invite.message}"
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                variant="success" 
                size="sm" 
                className="flex-1 text-[11px]"
                onClick={() => handleResponse(invite.id, 'accepted')}
                disabled={respondingId === invite.id}
              >
                {respondingId === invite.id ? 'PROCESSANDO...' : 'ACEITAR'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-[11px] hover:border-[var(--dl-tactical-red)]/40 hover:text-[var(--dl-tactical-red)]"
                onClick={() => handleResponse(invite.id, 'declined')}
                disabled={respondingId === invite.id}
              >
                RECUSAR
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
