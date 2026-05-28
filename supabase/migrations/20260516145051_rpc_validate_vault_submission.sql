-- DUO LOOT - MIGRATION 009
-- Validação de submissão do cofre (Admin)

alter table public.profiles
add column if not exists metadata jsonb not null default '{}';

create or replace function public.validate_vault_submission(
  p_submission_id uuid,
  p_is_valid boolean
)
returns table (
  success boolean,
  message text,
  submission_id uuid,
  winner_player_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid;
  v_is_admin boolean;
  v_submission public.vault_submissions%rowtype;
  v_existing_winner uuid;
begin
  v_admin_id := auth.uid();

  if v_admin_id is null then
    return query select false, 'Usuário não autenticado', p_submission_id, null::uuid;
    return;
  end if;

  select (metadata->>'role' = 'admin')
  into v_is_admin
  from public.profiles
  where id = v_admin_id;

  if coalesce(v_is_admin, false) = false then
    return query select false, 'Apenas admins podem validar submissões', p_submission_id, null::uuid;
    return;
  end if;

  select *
  into v_submission
  from public.vault_submissions
  where id = p_submission_id
  for update;

  if not found then
    return query select false, 'Submissão não encontrada', p_submission_id, null::uuid;
    return;
  end if;

  if v_submission.is_valid is not null then
    return query select false, 'Submissão já foi validada', p_submission_id, null::uuid;
    return;
  end if;

  update public.vault_submissions
  set is_valid = p_is_valid
  where id = p_submission_id;

  if p_is_valid = false then
    return query select true, 'Submissão marcada como inválida', p_submission_id, null::uuid;
    return;
  end if;

  select player_id
  into v_existing_winner
  from public.vault_winners
  where event_id = v_submission.event_id
  for update;

  if v_existing_winner is not null then
    return query select true, 'Submissão válida, mas o evento já tem vencedor', p_submission_id, v_existing_winner;
    return;
  end if;

  insert into public.vault_winners (
    event_id,
    task_id,
    player_id,
    submission_id
  )
  values (
    v_submission.event_id,
    v_submission.task_id,
    v_submission.player_id,
    v_submission.id
  );

  return query select true, 'Submissão validada e vencedor registrado', p_submission_id, v_submission.player_id;
end;
$$;;
