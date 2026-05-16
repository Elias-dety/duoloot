-- DUO LOOT - MIGRATION 008
-- Prepara fluxo de submissão do cofre e cria RPC de envio

-- Garante que a tabela vault_submissions existe com a estrutura correta (sem recriar se já existir)
-- Nota: Ela já foi criada na Migration 001, aqui apenas garantimos a lógica de validação.

create or replace function public.submit_vault_task(
  p_event_id uuid,
  p_task_id uuid,
  p_payload jsonb default '{}'
)
returns table (
  success boolean,
  message text,
  submission_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player_id uuid;
  v_submission_id uuid;
begin
  v_player_id := auth.uid();

  -- 1. Validar autenticação
  if v_player_id is null then
    return query select false, 'Usuário não autenticado', null::uuid;
    return;
  end if;

  -- 2. Validar se o evento está ativo
  if not exists (
    select 1
    from public.vault_events
    where id = p_event_id
      and status = 'active'
  ) then
    return query select false, 'Evento não está ativo', null::uuid;
    return;
  end if;

  -- 3. Validar se o jogador está inscrito no evento
  if not exists (
    select 1
    from public.vault_participants
    where event_id = p_event_id
      and player_id = v_player_id
  ) then
    return query select false, 'Jogador não inscrito no evento', null::uuid;
    return;
  end if;

  -- 4. Validar se a tarefa pertence ao evento
  if not exists (
    select 1
    from public.vault_tasks
    where id = p_task_id
      and event_id = p_event_id
  ) then
    return query select false, 'Tarefa inválida para este evento', null::uuid;
    return;
  end if;

  -- 5. Inserir a submissão com is_valid = null (pendente)
  insert into public.vault_submissions (
    event_id,
    task_id,
    player_id,
    payload,
    is_valid
  )
  values (
    p_event_id,
    p_task_id,
    v_player_id,
    p_payload,
    null
  )
  returning id into v_submission_id;

  return query select true, 'Missão enviada para validação', v_submission_id;
end;
$$;
