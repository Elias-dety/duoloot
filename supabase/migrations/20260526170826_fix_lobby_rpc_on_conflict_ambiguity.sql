create or replace function public.create_lobby(
  p_slots_total integer default 5,
  p_mode text default 'competitivo',
  p_queue text default 'ranked',
  p_min_rank text default 'livre',
  p_max_rank text default 'livre',
  p_metadata jsonb default '{}'::jsonb
)
returns table(success boolean, message text, lobby_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_lobby_id uuid;
  v_slots_total integer;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    return query select false, 'Entre na sua conta para criar um lobby.'::text, null::uuid;
    return;
  end if;

  if not exists (select 1 from public.profiles p where p.id = v_user_id) then
    return query select false, 'Perfil do usuário não encontrado.'::text, null::uuid;
    return;
  end if;

  v_slots_total := greatest(2, least(coalesce(p_slots_total, 5), 5));

  update public.lobbies l
  set status = 'closed'::public.lobby_status
  where l.owner_id = v_user_id
    and l.status = 'open'::public.lobby_status;

  insert into public.lobbies (
    owner_id,
    slots_total,
    slots_filled,
    mode,
    queue,
    min_rank,
    max_rank,
    status,
    metadata
  ) values (
    v_user_id,
    v_slots_total,
    1,
    coalesce(nullif(trim(p_mode), ''), 'competitivo'),
    coalesce(nullif(trim(p_queue), ''), 'ranked'),
    coalesce(nullif(trim(p_min_rank), ''), 'livre'),
    coalesce(nullif(trim(p_max_rank), ''), 'livre'),
    'open'::public.lobby_status,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_lobby_id;

  insert into public.lobby_members (
    lobby_id,
    player_id,
    user_id,
    role,
    joined_at,
    created_at
  ) values (
    v_lobby_id,
    v_user_id,
    v_user_id,
    'owner',
    now(),
    now()
  )
  on conflict on constraint lobby_members_pkey do nothing;

  return query select true, 'Lobby criado com sucesso.'::text, v_lobby_id;
end;
$$;

create or replace function public.join_lobby(p_lobby_id uuid)
returns table(success boolean, message text, lobby_id uuid, slots_filled integer, slots_total integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_lobby public.lobbies%rowtype;
  v_member_count integer;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    return query select false, 'Entre na sua conta para entrar em um lobby.'::text, p_lobby_id, null::integer, null::integer;
    return;
  end if;

  if not exists (select 1 from public.profiles p where p.id = v_user_id) then
    return query select false, 'Perfil do usuário não encontrado.'::text, p_lobby_id, null::integer, null::integer;
    return;
  end if;

  select *
  into v_lobby
  from public.lobbies l
  where l.id = p_lobby_id
  for update;

  if not found then
    return query select false, 'Lobby não encontrado.'::text, p_lobby_id, null::integer, null::integer;
    return;
  end if;

  if v_lobby.owner_id = v_user_id then
    return query select false, 'Você já é o dono deste lobby.'::text, p_lobby_id, v_lobby.slots_filled, v_lobby.slots_total;
    return;
  end if;

  if v_lobby.status <> 'open'::public.lobby_status then
    return query select false, 'Este lobby não está mais aberto.'::text, p_lobby_id, v_lobby.slots_filled, v_lobby.slots_total;
    return;
  end if;

  if exists (
    select 1
    from public.lobby_members lm
    where lm.lobby_id = p_lobby_id
      and (lm.player_id = v_user_id or lm.user_id = v_user_id)
  ) then
    return query select true, 'Você já está neste lobby.'::text, p_lobby_id, v_lobby.slots_filled, v_lobby.slots_total;
    return;
  end if;

  select count(*)::integer
  into v_member_count
  from public.lobby_members lm
  where lm.lobby_id = p_lobby_id;

  if v_member_count >= v_lobby.slots_total then
    update public.lobbies l
    set
      status = 'full'::public.lobby_status,
      slots_filled = v_member_count
    where l.id = p_lobby_id;

    return query select false, 'Lobby cheio.'::text, p_lobby_id, v_member_count, v_lobby.slots_total;
    return;
  end if;

  insert into public.lobby_members (
    lobby_id,
    player_id,
    user_id,
    role,
    joined_at,
    created_at
  ) values (
    p_lobby_id,
    v_user_id,
    v_user_id,
    'member',
    now(),
    now()
  )
  on conflict on constraint lobby_members_pkey do nothing;

  select count(*)::integer
  into v_member_count
  from public.lobby_members lm
  where lm.lobby_id = p_lobby_id;

  update public.lobbies l
  set
    slots_filled = v_member_count,
    status = case
      when v_member_count >= l.slots_total then 'full'::public.lobby_status
      else 'open'::public.lobby_status
    end
  where l.id = p_lobby_id;

  return query select true, 'Você entrou no lobby.'::text, p_lobby_id, v_member_count, v_lobby.slots_total;
end;
$$;

grant execute on function public.create_lobby(integer, text, text, text, text, jsonb) to authenticated;
grant execute on function public.join_lobby(uuid) to authenticated;;
