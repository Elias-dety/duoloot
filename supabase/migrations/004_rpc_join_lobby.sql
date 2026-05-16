-- DUO LOOT - MIGRATION 004
-- RPC join_lobby: Gerenciamento transacional de entrada em lobbies

create or replace function public.join_lobby(p_lobby_id uuid)
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

  -- 2. Travar o lobby para atualização (atomicidade)
  select *
  into v_lobby
  from public.lobbies
  where id = p_lobby_id
  for update;

  if not found then
    return query select false, 'Lobby não encontrado', p_lobby_id, 0, null::lobby_status;
    return;
  end if;

  -- 3. Validar se o lobby está aberto
  if v_lobby.status <> 'open' then
    return query select false, 'Lobby não está aberto', p_lobby_id, v_lobby.slots_filled, v_lobby.status;
    return;
  end if;

  -- 4. Validar se o jogador já está no lobby
  if exists (
    select 1
    from public.lobby_members
    where lobby_members.lobby_id = p_lobby_id
      and lobby_members.player_id = v_player_id
  ) then
    return query select false, 'Você já está neste lobby', p_lobby_id, v_lobby.slots_filled, v_lobby.status;
    return;
  end if;

  -- 5. Validar se há vagas
  if v_lobby.slots_filled >= v_lobby.slots_total then
    -- Correção preventiva de status se houver divergência
    update public.lobbies
    set status = 'full',
        updated_at = now()
    where id = p_lobby_id;

    return query select false, 'Lobby já está cheio', p_lobby_id, v_lobby.slots_filled, 'full'::lobby_status;
    return;
  end if;

  -- 6. Inserir o novo membro
  insert into public.lobby_members (
    lobby_id,
    player_id
  )
  values (
    p_lobby_id,
    v_player_id
  );

  -- 7. Calcular novos valores
  v_new_slots_filled := v_lobby.slots_filled + 1;

  if v_new_slots_filled >= v_lobby.slots_total then
    v_new_status := 'full';
  else
    v_new_status := 'open';
  end if;

  -- 8. Atualizar o lobby
  update public.lobbies
  set slots_filled = v_new_slots_filled,
      status = v_new_status,
      updated_at = now()
  where id = p_lobby_id;

  return query select true, 'Entrada no lobby confirmada', p_lobby_id, v_new_slots_filled, v_new_status;
end;
$$;
