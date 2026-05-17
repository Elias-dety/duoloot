/**
 * Verifica se um determinado jogador está online com base na lista de IDs online.
 * @param playerId ID do jogador a ser verificado
 * @param onlineUserIds Lista de IDs de jogadores atualmente online via Supabase Presence
 */
export const isPlayerOnline = (playerId: string, onlineUserIds: string[]): boolean => {
  if (!playerId || !onlineUserIds) return false;
  return onlineUserIds.includes(playerId);
};
