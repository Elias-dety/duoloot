-- Add missing foreign-key indexes reported by Supabase performance advisor.
-- Safe: no data deletion, no table drops.

create index if not exists idx_player_connections_player_b_id
  on public.player_connections(player_b_id);

create index if not exists idx_player_connections_source_invite_id
  on public.player_connections(source_invite_id);

create index if not exists idx_player_invites_receiver_id
  on public.player_invites(receiver_id);

create index if not exists idx_vault_submissions_player_id
  on public.vault_submissions(player_id);

create index if not exists idx_vault_submissions_task_id
  on public.vault_submissions(task_id);

create index if not exists idx_vault_tasks_event_id
  on public.vault_tasks(event_id);

create index if not exists idx_vault_winners_player_id
  on public.vault_winners(player_id);

create index if not exists idx_vault_winners_submission_id
  on public.vault_winners(submission_id);

create index if not exists idx_vault_winners_task_id
  on public.vault_winners(task_id);
