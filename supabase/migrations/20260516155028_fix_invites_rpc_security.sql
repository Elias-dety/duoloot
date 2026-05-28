-- DUO LOOT - MIGRATION 013
-- Reforço de segurança nas RPCs de convites

create or replace function public.send_player_invite(
  p_receiver_id uuid,
  p_message text default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sender_id uuid;
  v_invite_id uuid;
begin
  v_sender_id := auth.uid();

  if v_sender_id is null then
    return json_build_object('success', false, 'message', 'Usuário não autenticado.');
  end if;

  if v_sender_id = p_receiver_id then
    return json_build_object('success', false, 'message', 'Você não pode convidar a si mesmo.');
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = p_receiver_id
  ) then
    return json_build_object('success', false, 'message', 'Jogador não encontrado.');
  end if;

  if exists (
    select 1
    from public.player_invites
    where sender_id = v_sender_id
      and receiver_id = p_receiver_id
      and status = 'pending'
  ) then
    return json_build_object('success', false, 'message', 'Já existe um convite pendente para este jogador.');
  end if;

  insert into public.player_invites (
    sender_id,
    receiver_id,
    message
  )
  values (
    v_sender_id,
    p_receiver_id,
    p_message
  )
  returning id into v_invite_id;

  return json_build_object(
    'success', true,
    'message', 'Convite enviado com sucesso.',
    'invite_id', v_invite_id
  );

exception when others then
  return json_build_object('success', false, 'message', 'Erro ao enviar convite: ' || sqlerrm);
end;
$$;

create or replace function public.respond_player_invite(
  p_invite_id uuid,
  p_status player_invite_status
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_current_status player_invite_status;
  v_receiver_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    return json_build_object('success', false, 'message', 'Usuário não autenticado.');
  end if;

  if p_status not in ('accepted', 'declined') then
    return json_build_object('success', false, 'message', 'Status inválido.');
  end if;

  select status, receiver_id
  into v_current_status, v_receiver_id
  from public.player_invites
  where id = p_invite_id;

  if v_current_status is null then
    return json_build_object('success', false, 'message', 'Convite não encontrado.');
  end if;

  if v_receiver_id <> v_user_id then
    return json_build_object('success', false, 'message', 'Apenas o destinatário pode responder.');
  end if;

  if v_current_status <> 'pending' then
    return json_build_object('success', false, 'message', 'Este convite já foi processado.');
  end if;

  update public.player_invites
  set status = p_status,
      responded_at = now()
  where id = p_invite_id;

  return json_build_object(
    'success', true,
    'message', 'Resposta registrada.',
    'invite_id', p_invite_id,
    'status', p_status
  );
end;
$$;
;
