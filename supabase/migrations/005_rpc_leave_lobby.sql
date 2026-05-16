-- DUO LOOT - MIGRATION 005
-- RPC leave_lobby: Gerenciamento transacional de saída de lobbies

create or replace function public.leave_lobby(p_lobby_id uuid)
returns table (
  success boolean,
  message text,
  lobby_id uuid,
  slots_filled int,
  status lobby_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player_id uuid;
  v_lobby public.lobbies%rowtype;
  v_new_slots_filled int;
  v_new_status lobby_status;
begin
  -- 1. Obter usuário autenticado
  v_player_id := auth.uid();

  if v_player_id is null then
    return query select false, 'Usuário não autenticado', p_lobby_id, 0, null::lobby_status;
    return;
  end if;

  -- 2. Travar o lobby para atualização
  select *
  into v_lobby
  from public.lobbies
  where id = p_lobby_id
  for update;

  if not found then
    return query select false, 'Lobby não encontrado', p_lobby_id, 0, null::lobby_status;
    return;
  end if;

  -- 3. Validar se o jogador está no lobby
  if not exists (
    select 1
    from public.lobby_members
    where lobby_members.lobby_id = p_lobby_id
      and lobby_members.player_id = v_player_id
  ) and v_lobby.owner_id <> v_player_id then
    return query select false, 'Você não está neste lobby', p_lobby_id, v_lobby.slots_filled, v_lobby.status;
    return;
  end if;

  -- 4. Se o jogador for o dono, o lobby é fechado
  if v_lobby.owner_id = v_player_id then
    -- Remove todos os membros
    delete from public.lobby_members
    where lobby_members.lobby_id = p_lobby_id;

    -- Atualiza o status do lobby
    update public.lobbies
    set slots_filled = 0,
        status = 'closed',
        updated_at = now()
    where id = p_lobby_id;

    return query select true, 'Lobby fechado pelo dono', p_lobby_id, 0, 'closed'::lobby_status;
    return;
  end if;

  -- 5. Se for um membro comum saindo
  delete from public.lobby_members
  where lobby_members.lobby_id = p_lobby_id
    and lobby_members.player_id = v_player_id;

  -- 6. Recalcular vagas (não pode ser menor que 1, pois o dono sempre conta)
  v_new_slots_filled := greatest(v_lobby.slots_filled - 1, 1);

  -- 7. Atualizar status se necessário
  if v_lobby.status = 'full' then
    v_new_status := 'open';
  else
    v_new_status := v_lobby.status;
  end if;

  -- 8. Persistir mudanças
  update public.lobbies
  set slots_filled = v_new_slots_filled,
      status = v_new_status,
      updated_at = now()
  where id = p_lobby_id;

  return query select true, 'Saída do lobby confirmada', p_lobby_id, v_new_slots_filled, v_new_status;
end;
$$;
