create or replace function public.leave_lobby(p_lobby_id uuid)
returns table(success boolean, message text, lobby_id uuid, slots_filled integer, status public.lobby_status)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_lobby public.lobbies%rowtype;
  v_member_count integer;
  v_new_status public.lobby_status;
  v_is_owner boolean;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    return query select false, 'Entre na sua conta para sair do lobby.'::text, p_lobby_id, null::integer, null::public.lobby_status;
    return;
  end if;

  select *
  into v_lobby
  from public.lobbies l
  where l.id = p_lobby_id
  for update;

  if not found then
    return query select false, 'Lobby não encontrado.'::text, p_lobby_id, null::integer, null::public.lobby_status;
    return;
  end if;

  v_is_owner := v_lobby.owner_id = v_user_id;

  if not exists (
    select 1
    from public.lobby_members lm
    where lm.lobby_id = p_lobby_id
      and (lm.player_id = v_user_id or lm.user_id = v_user_id)
  ) then
    return query select false, 'Você não está neste lobby.'::text, p_lobby_id, v_lobby.slots_filled, v_lobby.status;
    return;
  end if;

  delete from public.lobby_members lm
  where lm.lobby_id = p_lobby_id
    and (lm.player_id = v_user_id or lm.user_id = v_user_id);

  select count(*)::integer
  into v_member_count
  from public.lobby_members lm
  where lm.lobby_id = p_lobby_id;

  if v_is_owner then
    v_new_status := 'closed'::public.lobby_status;

    update public.lobbies l
    set
      status = v_new_status,
      slots_filled = greatest(v_member_count, 1)
    where l.id = p_lobby_id;

    return query select true, 'Lobby fechado com sucesso.'::text, p_lobby_id, greatest(v_member_count, 1), v_new_status;
    return;
  end if;

  v_new_status := case
    when v_member_count >= v_lobby.slots_total then 'full'::public.lobby_status
    else 'open'::public.lobby_status
  end;

  update public.lobbies l
  set
    slots_filled = greatest(v_member_count, 1),
    status = v_new_status
  where l.id = p_lobby_id;

  return query select true, 'Você saiu do lobby.'::text, p_lobby_id, greatest(v_member_count, 1), v_new_status;
end;
$$;

grant execute on function public.leave_lobby(uuid) to authenticated;;
