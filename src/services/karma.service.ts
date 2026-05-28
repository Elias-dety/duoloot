import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type CategoriaDesempenhoPartida = 'RUIM' | 'MEDIA' | 'BOM';
export type CategoriaComportamentoPartida = 'TOXICO' | 'NEUTRO' | 'BOM';

export type SubmitKarmaReviewPayload = {
  partidaId: string;
  avaliadoId: string;
  categoriaDesempenho: CategoriaDesempenhoPartida;
  categoriaComportamento: CategoriaComportamentoPartida;
  comentario?: string;
};

export type KarmaSummary = {
  jogadorId: string;
  scoreDesempenhoTotal: number;
  scoreComportamentoTotal: number;
  karmaGeral: number;
  totalPartidasAvaliadas: number;
  ultimaAtualizacao: string;
};

type ServiceError = {
  code?: string;
  message?: string;
};

type KarmaSummaryRecord = {
  jogador_id: string;
  score_desempenho_total: number | null;
  score_comportamento_total: number | null;
  karma_geral: number | null;
  total_partidas_avaliadas: number | null;
  ultima_atualizacao: string | null;
};

const MAX_COMMENT_LENGTH = 150;

function handleKarmaServiceError(error: ServiceError | null | undefined, fallbackMessage: string) {
  console.error(error);
  if (!isSupabaseConfigured) return 'Configuração do Supabase ausente.';
  if (error?.message?.includes('JWT')) return 'Sua sessão expirou. Entre novamente.';
  if (error?.message?.includes('authenticated')) return 'Entre na sua conta para continuar.';
  if (error?.code === 'PGRST202') return 'Sistema de Karma ainda não configurado no banco. Aplique a migration do Supabase.';
  if (error?.message?.includes('row-level security')) return 'Sem permissão no banco para esta ação. Verifique as policies/RLS.';
  return error?.message || fallbackMessage;
}

function normalizeComment(comment: string | undefined) {
  const normalized = comment?.trim() || null;

  if (!normalized) return null;

  return normalized.slice(0, MAX_COMMENT_LENGTH);
}

function mapKarmaSummary(record: KarmaSummaryRecord): KarmaSummary {
  return {
    jogadorId: record.jogador_id,
    scoreDesempenhoTotal: Number(record.score_desempenho_total) || 0,
    scoreComportamentoTotal: Number(record.score_comportamento_total) || 0,
    karmaGeral: Number(record.karma_geral) || 0,
    totalPartidasAvaliadas: Number(record.total_partidas_avaliadas) || 0,
    ultimaAtualizacao: record.ultima_atualizacao || '',
  };
}

export async function submitKarmaReview(payload: SubmitKarmaReviewPayload) {
  if (!isSupabaseConfigured) throw new Error('Supabase não configurado.');

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error('Entre na sua conta para avaliar um jogador.');

  if (user.id === payload.avaliadoId) {
    throw new Error('Você não pode avaliar a si mesmo.');
  }

  const { data, error } = await supabase
    .from('avaliacoes_partidas')
    .insert({
      partida_id: payload.partidaId,
      avaliador_id: user.id,
      avaliado_id: payload.avaliadoId,
      categoria_desempenho: payload.categoriaDesempenho,
      categoria_comportamento: payload.categoriaComportamento,
      comentario: normalizeComment(payload.comentario),
    })
    .select('id')
    .single();

  if (error) throw new Error(handleKarmaServiceError(error, 'Erro ao enviar avaliação de Karma.'));

  return data;
}

export async function getPlayerKarma(playerId: string): Promise<KarmaSummary | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('reputacao_jogador')
    .select(
      `
      jogador_id,
      score_desempenho_total,
      score_comportamento_total,
      karma_geral,
      total_partidas_avaliadas,
      ultima_atualizacao
    `
    )
    .eq('jogador_id', playerId)
    .maybeSingle();

  if (error) throw new Error(handleKarmaServiceError(error, 'Erro ao carregar Karma do jogador.'));
  if (!data) return null;

  return mapKarmaSummary(data as KarmaSummaryRecord);
}
