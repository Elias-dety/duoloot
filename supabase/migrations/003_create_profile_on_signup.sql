create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    name,
    nickname,
    avatar_url,
    trust_score,
    status,
    is_premium
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Jogador Duo Loot'),
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1), 'jogador'),
    new.raw_user_meta_data->>'avatar_url',
    50,
    'offline',
    false
  )
  on conflict (id) do nothing;

  insert into public.player_stats (
    player_id,
    game,
    rank,
    main_role,
    secondary_role,
    matches_played,
    win_rate,
    average_kda,
    hours_played,
    commendations,
    abandons
  )
  values (
    new.id,
    'valorant',
    'unranked',
    'flex',
    null,
    0,
    0,
    0,
    0,
    0,
    0
  )
  on conflict (player_id, game) do nothing;

  insert into public.player_preferences (
    player_id,
    mic_required,
    play_style,
    session_focus,
    availability
  )
  values (
    new.id,
    false,
    'flexível',
    'casual',
    'a combinar'
  )
  on conflict (player_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
