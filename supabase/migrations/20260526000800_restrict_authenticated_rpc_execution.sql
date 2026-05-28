-- Restrict user-facing RPC execution to authenticated users.
-- Safe: no table drops and no user data deletion.
-- Trigger/helper functions are left unchanged for now.

revoke execute on function public.create_lobby(integer, text, text, text, text, jsonb) from anon;
revoke execute on function public.join_lobby(uuid) from anon;
revoke execute on function public.leave_lobby(uuid) from anon;
revoke execute on function public.get_recommended_players(text, integer) from anon;
revoke execute on function public.send_player_invite(uuid, text) from anon;
revoke execute on function public.respond_player_invite(uuid, public.player_invite_status) from anon;
revoke execute on function public.get_my_connections() from anon;
revoke execute on function public.get_my_connections_with_unread() from anon;
revoke execute on function public.get_connection_messages(uuid, integer) from anon;
revoke execute on function public.send_connection_message(uuid, text) from anon;
revoke execute on function public.mark_connection_messages_as_read(uuid) from anon;
revoke execute on function public.submit_vault_task(uuid, uuid, jsonb) from anon;
revoke execute on function public.claim_vault_winner(uuid, uuid, jsonb) from anon;
revoke execute on function public.validate_vault_submission(uuid, boolean) from anon;

grant execute on function public.create_lobby(integer, text, text, text, text, jsonb) to authenticated;
grant execute on function public.join_lobby(uuid) to authenticated;
grant execute on function public.leave_lobby(uuid) to authenticated;
grant execute on function public.get_recommended_players(text, integer) to authenticated;
grant execute on function public.send_player_invite(uuid, text) to authenticated;
grant execute on function public.respond_player_invite(uuid, public.player_invite_status) to authenticated;
grant execute on function public.get_my_connections() to authenticated;
grant execute on function public.get_my_connections_with_unread() to authenticated;
grant execute on function public.get_connection_messages(uuid, integer) to authenticated;
grant execute on function public.send_connection_message(uuid, text) to authenticated;
grant execute on function public.mark_connection_messages_as_read(uuid) to authenticated;
grant execute on function public.submit_vault_task(uuid, uuid, jsonb) to authenticated;
grant execute on function public.claim_vault_winner(uuid, uuid, jsonb) to authenticated;
grant execute on function public.validate_vault_submission(uuid, boolean) to authenticated;
