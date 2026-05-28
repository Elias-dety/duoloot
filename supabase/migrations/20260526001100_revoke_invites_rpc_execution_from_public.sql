-- Properly remove inherited anonymous execution through PUBLIC for player invite RPCs.
-- Safe: no table drops and no user data deletion.

revoke execute on function public.send_player_invite(uuid, text) from public;
revoke execute on function public.respond_player_invite(uuid, public.player_invite_status) from public;

grant execute on function public.send_player_invite(uuid, text) to authenticated;
grant execute on function public.respond_player_invite(uuid, public.player_invite_status) to authenticated;
