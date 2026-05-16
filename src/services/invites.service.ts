import { supabase } from '@/lib/supabase';

export interface InviteResponse {
  success: boolean;
  message: string;
  invite_id?: string;
  status?: string;
}

export const sendPlayerInvite = async (receiverId: string, message?: string): Promise<InviteResponse> => {
  const { data, error } = await supabase.rpc('send_player_invite', {
    p_receiver_id: receiverId,
    p_message: message || null
  });

  if (error) throw error;
  return data as InviteResponse;
};

export const respondPlayerInvite = async (inviteId: string, status: 'accepted' | 'declined'): Promise<InviteResponse> => {
  const { data, error } = await supabase.rpc('respond_player_invite', {
    p_invite_id: inviteId,
    p_status: status
  });

  if (error) throw error;
  return data as InviteResponse;
};

export const getMyPendingInvites = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('player_invites')
    .select(`
      *,
      sender:profiles!player_invites_sender_id_fkey(id, name, nickname, avatar_url, trust_score)
    `)
    .eq('receiver_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};
