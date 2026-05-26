-- Properly remove inherited anonymous execution through PUBLIC for connections/messages RPCs.
-- Safe: no table drops and no user data deletion.

revoke execute on function public.get_my_connections() from public;
revoke execute on function public.get_my_connections_with_unread() from public;
revoke execute on function public.get_connection_messages(uuid, integer) from public;
revoke execute on function public.send_connection_message(uuid, text) from public;
revoke execute on function public.mark_connection_messages_as_read(uuid) from public;

grant execute on function public.get_my_connections() to authenticated;
grant execute on function public.get_my_connections_with_unread() to authenticated;
grant execute on function public.get_connection_messages(uuid, integer) to authenticated;
grant execute on function public.send_connection_message(uuid, text) to authenticated;
grant execute on function public.mark_connection_messages_as_read(uuid) to authenticated;
