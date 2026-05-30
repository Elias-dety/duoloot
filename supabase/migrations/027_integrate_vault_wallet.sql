-- Integrate Vault with Wallet System
-- When a mission is completed, credit the reward amount to the user's wallet.
-- Points in vault_participants remain as ranking points.

create or replace function public.claim_vault_mission_progress(p_mission_id uuid, p_increment integer default 1)
returns table(success boolean, message text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player_id uuid;
  v_event_id uuid;
  v_target_value integer;
  v_points_reward integer;
  v_mission_title text;
  v_current_value integer;
  v_completed boolean;
begin
  v_player_id := auth.uid();
  if v_player_id is null then
    return query select false, 'Usuário não autenticado';
    return;
  end if;

  -- Get mission details
  select event_id, target_value, points_reward, title
  into v_event_id, v_target_value, v_points_reward, v_mission_title
  from public.vault_missions
  where id = p_mission_id and status = 'active';

  if not found then
    return query select false, 'Missão inativa ou não encontrada';
    return;
  end if;

  -- Check if participant
  if not exists (select 1 from public.vault_participants where event_id = v_event_id and player_id = v_player_id and status = 'active') then
    return query select false, 'Usuário não está participando do evento';
    return;
  end if;

  -- Get current progress
  select current_value, completed into v_current_value, v_completed
  from public.vault_mission_progress
  where mission_id = p_mission_id and player_id = v_player_id;

  if not found then
    return query select false, 'Progresso não encontrado para o usuário';
    return;
  end if;

  if v_completed then
    return query select false, 'Missão já completada';
    return;
  end if;

  -- Increment progress
  v_current_value := v_current_value + p_increment;
  
  if v_current_value >= v_target_value then
    v_current_value := v_target_value;
    
    -- Mark completed
    update public.vault_mission_progress
    set current_value = v_current_value, completed = true, completed_at = now(), updated_at = now()
    where mission_id = p_mission_id and player_id = v_player_id;

    -- Add points to participant (for ranking)
    update public.vault_participants
    set points = points + v_points_reward, updated_at = now()
    where event_id = v_event_id and player_id = v_player_id;

    -- Add points to event
    update public.vault_events
    set current_points = current_points + v_points_reward, updated_at = now()
    where id = v_event_id;

    -- Grant wallet credit (DuoCoins redeemable balance) via secure RPC with idempotency_key
    perform public.grant_wallet_credit(
      v_player_id,
      v_points_reward,
      'mission_reward',
      'vault_mission',
      p_mission_id,
      concat('vault_mission:', v_event_id, ':', p_mission_id, ':', v_player_id),
      jsonb_build_object(
        'event_id', v_event_id,
        'mission_id', p_mission_id,
        'mission_title', v_mission_title,
        'source', 'cofre'
      )
    );

    return query select true, 'Missão completada!';
  else
    -- Just update progress
    update public.vault_mission_progress
    set current_value = v_current_value, updated_at = now()
    where mission_id = p_mission_id and player_id = v_player_id;

    return query select true, 'Progresso registrado';
  end if;
end;
$$;
