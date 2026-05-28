revoke execute on function public.create_lobby(integer, text, text, text, text, jsonb) from public;
revoke execute on function public.join_lobby(uuid) from public;
revoke execute on function public.leave_lobby(uuid) from public;

grant execute on function public.create_lobby(integer, text, text, text, text, jsonb) to authenticated;
grant execute on function public.join_lobby(uuid) to authenticated;
grant execute on function public.leave_lobby(uuid) to authenticated;;
