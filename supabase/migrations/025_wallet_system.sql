-- =============================================================================
-- DuoLoot Wallet System
-- =============================================================================
-- Purpose: Create a secure wallet/DuoCoins system separated from Vault points.
-- Vault points = ranking, seasons, gamification.
-- DuoCoins/Wallet = redeemable balance with ledger.
--
-- Tables: wallet_accounts, wallet_ledger_entries, wallet_redemptions,
--         reward_catalog, wallet_audit_logs
-- RPCs:   ensure_wallet_account, grant_wallet_credit,
--         request_wallet_redemption, admin_approve_wallet_redemption,
--         admin_reject_wallet_redemption
-- =============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. TABLES
-- ---------------------------------------------------------------------------

-- 1.1 wallet_accounts
create table if not exists public.wallet_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,

  available_balance bigint not null default 0,
  pending_balance bigint not null default 0,
  locked_balance bigint not null default 0,

  lifetime_earned bigint not null default 0,
  lifetime_redeemed bigint not null default 0,

  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint wallet_accounts_non_negative_available check (available_balance >= 0),
  constraint wallet_accounts_non_negative_pending check (pending_balance >= 0),
  constraint wallet_accounts_non_negative_locked check (locked_balance >= 0),
  constraint wallet_accounts_status_check check (
    status in ('active', 'frozen', 'closed')
  )
);

comment on table public.wallet_accounts is
  'DuoCoins wallet per user. Balance is NEVER edited directly — only via RPCs.';

-- 1.2 wallet_ledger_entries
create table if not exists public.wallet_ledger_entries (
  id uuid primary key default gen_random_uuid(),

  account_id uuid not null references public.wallet_accounts(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,

  direction text not null,
  amount bigint not null,
  balance_after bigint not null,

  type text not null,
  status text not null default 'confirmed',

  source text not null,
  source_id uuid,
  idempotency_key text not null unique,

  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,

  created_at timestamptz not null default now(),

  constraint wallet_ledger_amount_positive check (amount > 0),
  constraint wallet_ledger_direction_check check (
    direction in ('credit', 'debit')
  ),
  constraint wallet_ledger_status_check check (
    status in ('pending', 'confirmed', 'cancelled', 'reversed')
  ),
  constraint wallet_ledger_type_check check (
    type in (
      'mission_reward',
      'event_bonus',
      'admin_credit',
      'admin_debit',
      'redemption_debit',
      'redemption_refund',
      'fraud_reversal',
      'manual_adjustment'
    )
  )
);

comment on table public.wallet_ledger_entries is
  'Immutable ledger. No user INSERT/UPDATE/DELETE — only via SECURITY DEFINER RPCs.';

-- 1.3 wallet_redemptions
create table if not exists public.wallet_redemptions (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete restrict,
  account_id uuid not null references public.wallet_accounts(id) on delete restrict,

  amount bigint not null,
  reward_type text not null,
  reward_label text not null,

  status text not null default 'requested',

  payout_method text,
  payout_payload jsonb not null default '{}'::jsonb,

  requested_at timestamptz not null default now(),
  reviewed_at timestamptz,
  paid_at timestamptz,
  cancelled_at timestamptz,

  reviewed_by uuid references auth.users(id) on delete set null,
  admin_notes text,

  metadata jsonb not null default '{}'::jsonb,

  constraint wallet_redemptions_amount_positive check (amount > 0),
  constraint wallet_redemptions_status_check check (
    status in (
      'requested',
      'under_review',
      'approved',
      'paid',
      'rejected',
      'cancelled'
    )
  ),
  constraint wallet_redemptions_reward_type_check check (
    reward_type in ('internal_badge', 'duocoins_bonus', 'gift_card', 'coupon', 'pix', 'manual')
  )
);

comment on table public.wallet_redemptions is
  'Redemption requests. Users can only SELECT own rows. Status changes via admin RPCs.';

-- 1.4 reward_catalog
create table if not exists public.reward_catalog (
  id uuid primary key default gen_random_uuid(),

  title text not null,
  description text,
  cost bigint not null,

  reward_type text not null,
  status text not null default 'active',

  stock_total integer,
  stock_available integer,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint reward_catalog_cost_positive check (cost > 0),
  constraint reward_catalog_status_check check (
    status in ('active', 'inactive', 'sold_out', 'archived')
  )
);

comment on table public.reward_catalog is
  'Available rewards for DuoCoins redemption. Users can read active items.';

-- 1.5 wallet_audit_logs
create table if not exists public.wallet_audit_logs (
  id uuid primary key default gen_random_uuid(),

  actor_user_id uuid references auth.users(id) on delete set null,
  target_user_id uuid references auth.users(id) on delete set null,

  action text not null,
  entity_type text not null,
  entity_id uuid,

  before_snapshot jsonb,
  after_snapshot jsonb,

  ip_address text,
  user_agent text,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

comment on table public.wallet_audit_logs is
  'Audit trail for all wallet operations. Not readable by regular users.';

-- ---------------------------------------------------------------------------
-- 2. INDEXES
-- ---------------------------------------------------------------------------

create index if not exists idx_wallet_accounts_user_id
  on public.wallet_accounts(user_id);

create index if not exists idx_wallet_ledger_user_id_created_at
  on public.wallet_ledger_entries(user_id, created_at desc);

create index if not exists idx_wallet_ledger_account_id_created_at
  on public.wallet_ledger_entries(account_id, created_at desc);

create index if not exists idx_wallet_ledger_source
  on public.wallet_ledger_entries(source, source_id);

create index if not exists idx_wallet_redemptions_user_id_created_at
  on public.wallet_redemptions(user_id, requested_at desc);

create index if not exists idx_wallet_redemptions_status
  on public.wallet_redemptions(status);

create index if not exists idx_wallet_audit_logs_target_user
  on public.wallet_audit_logs(target_user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------

alter table public.wallet_accounts enable row level security;
alter table public.wallet_ledger_entries enable row level security;
alter table public.wallet_redemptions enable row level security;
alter table public.reward_catalog enable row level security;
alter table public.wallet_audit_logs enable row level security;

-- 3.1 Users can read own wallet account
create policy "Users can read own wallet account"
  on public.wallet_accounts
  for select
  to authenticated
  using (auth.uid() = user_id);

-- 3.2 Users can read own ledger entries
create policy "Users can read own ledger entries"
  on public.wallet_ledger_entries
  for select
  to authenticated
  using (auth.uid() = user_id);

-- 3.3 Users can read own redemptions
create policy "Users can read own redemptions"
  on public.wallet_redemptions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- 3.4 Users can read active reward catalog
create policy "Users can read active reward catalog"
  on public.reward_catalog
  for select
  to authenticated
  using (status = 'active');

-- 3.5 Admins can read all redemptions (for review queue)
create policy "Admins can read all redemptions"
  on public.wallet_redemptions
  for select
  to authenticated
  using (public.duoloot_is_admin());

-- 3.6 Admins can read all wallet accounts (for investigation)
create policy "Admins can read all wallet accounts"
  on public.wallet_accounts
  for select
  to authenticated
  using (public.duoloot_is_admin());

-- 3.7 Admins can read all ledger entries (for audit)
create policy "Admins can read all ledger entries"
  on public.wallet_ledger_entries
  for select
  to authenticated
  using (public.duoloot_is_admin());

-- 3.8 Admins can read audit logs
create policy "Admins can read wallet audit logs"
  on public.wallet_audit_logs
  for select
  to authenticated
  using (public.duoloot_is_admin());

-- 3.9 Admins can manage reward catalog
create policy "Admins can manage reward catalog"
  on public.reward_catalog
  for all
  to authenticated
  using (public.duoloot_is_admin())
  with check (public.duoloot_is_admin());

-- No INSERT/UPDATE/DELETE policies for regular users on:
--   wallet_accounts, wallet_ledger_entries, wallet_redemptions, wallet_audit_logs
-- All mutations go through SECURITY DEFINER RPCs.

-- ---------------------------------------------------------------------------
-- 4. REVOKE direct table access from anon
-- ---------------------------------------------------------------------------

revoke all on public.wallet_accounts from anon;
revoke all on public.wallet_ledger_entries from anon;
revoke all on public.wallet_redemptions from anon;
revoke all on public.reward_catalog from anon;
revoke all on public.wallet_audit_logs from anon;

-- ---------------------------------------------------------------------------
-- 5. RPCs
-- ---------------------------------------------------------------------------

-- 5.1 ensure_wallet_account
create or replace function public.ensure_wallet_account(p_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account_id uuid;
begin
  insert into public.wallet_accounts (user_id)
  values (p_user_id)
  on conflict (user_id) do update
    set updated_at = now()
  returning id into v_account_id;

  return v_account_id;
end;
$$;

comment on function public.ensure_wallet_account(uuid) is
  'Creates or retrieves wallet account for given user. Called internally by other RPCs.';

-- 5.2 grant_wallet_credit — heart of the system
create or replace function public.grant_wallet_credit(
  p_user_id uuid,
  p_amount bigint,
  p_type text,
  p_source text,
  p_source_id uuid,
  p_idempotency_key text,
  p_metadata jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account_id uuid;
  v_account public.wallet_accounts%rowtype;
  v_new_balance bigint;
  v_existing_entry public.wallet_ledger_entries%rowtype;
begin
  -- Validate amount
  if p_amount <= 0 then
    raise exception 'Valor invalido.';
  end if;

  -- Idempotency check
  select *
  into v_existing_entry
  from public.wallet_ledger_entries
  where idempotency_key = p_idempotency_key
  limit 1;

  if found then
    return jsonb_build_object(
      'success', true,
      'duplicated', true,
      'message', 'Credito ja processado anteriormente.'
    );
  end if;

  -- Ensure wallet exists
  v_account_id := public.ensure_wallet_account(p_user_id);

  -- Lock the account row
  select *
  into v_account
  from public.wallet_accounts
  where id = v_account_id
  for update;

  -- Check wallet status
  if v_account.status <> 'active' then
    raise exception 'Carteira bloqueada ou encerrada.';
  end if;

  -- Calculate new balance
  v_new_balance := v_account.available_balance + p_amount;

  -- Update account
  update public.wallet_accounts
  set
    available_balance = v_new_balance,
    lifetime_earned = lifetime_earned + p_amount,
    updated_at = now()
  where id = v_account_id;

  -- Insert ledger entry
  insert into public.wallet_ledger_entries (
    account_id, user_id, direction, amount, balance_after,
    type, status, source, source_id, idempotency_key,
    metadata, created_by
  )
  values (
    v_account_id, p_user_id, 'credit', p_amount, v_new_balance,
    p_type, 'confirmed', p_source, p_source_id, p_idempotency_key,
    p_metadata, auth.uid()
  );

  -- Audit log
  insert into public.wallet_audit_logs (
    actor_user_id, target_user_id, action, entity_type, entity_id,
    after_snapshot, metadata
  )
  values (
    auth.uid(), p_user_id, 'wallet_credit_granted', 'wallet_account', v_account_id,
    jsonb_build_object(
      'amount', p_amount,
      'balance_after', v_new_balance,
      'source', p_source,
      'source_id', p_source_id
    ),
    p_metadata
  );

  return jsonb_build_object(
    'success', true,
    'duplicated', false,
    'balance', v_new_balance
  );
end;
$$;

comment on function public.grant_wallet_credit(uuid, bigint, text, text, uuid, text, jsonb) is
  'Credits DuoCoins to a user wallet. Uses idempotency_key to prevent duplicate payments. SECURITY DEFINER.';

-- 5.3 request_wallet_redemption — user-facing
create or replace function public.request_wallet_redemption(
  p_reward_type text,
  p_reward_label text,
  p_amount bigint,
  p_payout_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_account public.wallet_accounts%rowtype;
  v_redemption_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Usuario nao autenticado.';
  end if;

  if p_amount <= 0 then
    raise exception 'Valor invalido.';
  end if;

  -- Ensure wallet exists
  perform public.ensure_wallet_account(v_user_id);

  -- Lock account
  select *
  into v_account
  from public.wallet_accounts
  where user_id = v_user_id
  for update;

  if v_account.status <> 'active' then
    raise exception 'Carteira bloqueada ou encerrada.';
  end if;

  if v_account.available_balance < p_amount then
    raise exception 'Saldo insuficiente.';
  end if;

  -- Move available -> locked
  update public.wallet_accounts
  set
    available_balance = available_balance - p_amount,
    locked_balance = locked_balance + p_amount,
    updated_at = now()
  where id = v_account.id;

  -- Create redemption
  insert into public.wallet_redemptions (
    user_id, account_id, amount, reward_type, reward_label,
    status, payout_payload
  )
  values (
    v_user_id, v_account.id, p_amount, p_reward_type, p_reward_label,
    'requested', p_payout_payload
  )
  returning id into v_redemption_id;

  -- Ledger debit (pending until admin approves)
  insert into public.wallet_ledger_entries (
    account_id, user_id, direction, amount, balance_after,
    type, status, source, source_id, idempotency_key,
    metadata, created_by
  )
  values (
    v_account.id, v_user_id, 'debit', p_amount,
    v_account.available_balance - p_amount,
    'redemption_debit', 'pending', 'wallet_redemption', v_redemption_id,
    concat('wallet_redemption_request:', v_redemption_id),
    jsonb_build_object(
      'reward_type', p_reward_type,
      'reward_label', p_reward_label
    ),
    v_user_id
  );

  -- Audit log
  insert into public.wallet_audit_logs (
    actor_user_id, target_user_id, action, entity_type, entity_id,
    after_snapshot
  )
  values (
    v_user_id, v_user_id, 'wallet_redemption_requested', 'wallet_redemption',
    v_redemption_id,
    jsonb_build_object(
      'amount', p_amount,
      'reward_type', p_reward_type,
      'reward_label', p_reward_label
    )
  );

  return jsonb_build_object(
    'success', true,
    'redemption_id', v_redemption_id,
    'message', 'Resgate solicitado com sucesso.'
  );
end;
$$;

comment on function public.request_wallet_redemption(text, text, bigint, jsonb) is
  'User requests redemption. Moves funds from available to locked. Requires auth.';

-- 5.4 admin_approve_wallet_redemption
create or replace function public.admin_approve_wallet_redemption(
  p_redemption_id uuid,
  p_admin_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid;
  v_redemption public.wallet_redemptions%rowtype;
  v_account public.wallet_accounts%rowtype;
begin
  v_admin_id := auth.uid();

  if not public.duoloot_is_admin() then
    raise exception 'Permissao insuficiente.';
  end if;

  -- Lock redemption
  select *
  into v_redemption
  from public.wallet_redemptions
  where id = p_redemption_id
  for update;

  if not found then
    raise exception 'Resgate nao encontrado.';
  end if;

  if v_redemption.status not in ('requested', 'under_review', 'approved') then
    raise exception 'Estado invalido para aprovacao.';
  end if;

  -- Lock account
  select *
  into v_account
  from public.wallet_accounts
  where id = v_redemption.account_id
  for update;

  if v_account.locked_balance < v_redemption.amount then
    raise exception 'Saldo bloqueado insuficiente.';
  end if;

  -- Deduct locked, add to lifetime_redeemed
  update public.wallet_accounts
  set
    locked_balance = locked_balance - v_redemption.amount,
    lifetime_redeemed = lifetime_redeemed + v_redemption.amount,
    updated_at = now()
  where id = v_account.id;

  -- Mark redemption as paid
  update public.wallet_redemptions
  set
    status = 'paid',
    reviewed_at = coalesce(reviewed_at, now()),
    paid_at = now(),
    reviewed_by = v_admin_id,
    admin_notes = p_admin_notes
  where id = p_redemption_id;

  -- Confirm the pending ledger debit
  update public.wallet_ledger_entries
  set status = 'confirmed'
  where source = 'wallet_redemption'
    and source_id = p_redemption_id
    and type = 'redemption_debit';

  -- Audit log
  insert into public.wallet_audit_logs (
    actor_user_id, target_user_id, action, entity_type, entity_id,
    after_snapshot, metadata
  )
  values (
    v_admin_id, v_redemption.user_id, 'wallet_redemption_paid',
    'wallet_redemption', p_redemption_id,
    jsonb_build_object(
      'amount', v_redemption.amount,
      'status', 'paid'
    ),
    jsonb_build_object('admin_notes', p_admin_notes)
  );

  return jsonb_build_object(
    'success', true,
    'message', 'Resgate aprovado e pago.'
  );
end;
$$;

comment on function public.admin_approve_wallet_redemption(uuid, text) is
  'Admin approves redemption. Deducts locked balance and confirms ledger entry. Requires duoloot_is_admin().';

-- 5.5 admin_reject_wallet_redemption
create or replace function public.admin_reject_wallet_redemption(
  p_redemption_id uuid,
  p_admin_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid;
  v_redemption public.wallet_redemptions%rowtype;
  v_account public.wallet_accounts%rowtype;
  v_new_balance bigint;
begin
  v_admin_id := auth.uid();

  if not public.duoloot_is_admin() then
    raise exception 'Permissao insuficiente.';
  end if;

  -- Lock redemption
  select *
  into v_redemption
  from public.wallet_redemptions
  where id = p_redemption_id
  for update;

  if not found then
    raise exception 'Resgate nao encontrado.';
  end if;

  if v_redemption.status not in ('requested', 'under_review', 'approved') then
    raise exception 'Estado invalido para rejeicao.';
  end if;

  -- Lock account
  select *
  into v_account
  from public.wallet_accounts
  where id = v_redemption.account_id
  for update;

  if v_account.locked_balance < v_redemption.amount then
    raise exception 'Saldo bloqueado insuficiente.';
  end if;

  v_new_balance := v_account.available_balance + v_redemption.amount;

  -- Return locked -> available
  update public.wallet_accounts
  set
    available_balance = available_balance + v_redemption.amount,
    locked_balance = locked_balance - v_redemption.amount,
    updated_at = now()
  where id = v_account.id;

  -- Mark redemption as rejected
  update public.wallet_redemptions
  set
    status = 'rejected',
    reviewed_at = now(),
    reviewed_by = v_admin_id,
    admin_notes = p_admin_notes
  where id = p_redemption_id;

  -- Cancel original debit
  update public.wallet_ledger_entries
  set status = 'cancelled'
  where source = 'wallet_redemption'
    and source_id = p_redemption_id
    and type = 'redemption_debit';

  -- Refund entry in ledger
  insert into public.wallet_ledger_entries (
    account_id, user_id, direction, amount, balance_after,
    type, status, source, source_id, idempotency_key,
    metadata, created_by
  )
  values (
    v_account.id, v_redemption.user_id, 'credit', v_redemption.amount, v_new_balance,
    'redemption_refund', 'confirmed', 'wallet_redemption', p_redemption_id,
    concat('wallet_redemption_refund:', p_redemption_id),
    jsonb_build_object('reason', 'redemption_rejected'),
    v_admin_id
  );

  -- Audit log
  insert into public.wallet_audit_logs (
    actor_user_id, target_user_id, action, entity_type, entity_id,
    after_snapshot, metadata
  )
  values (
    v_admin_id, v_redemption.user_id, 'wallet_redemption_rejected',
    'wallet_redemption', p_redemption_id,
    jsonb_build_object(
      'amount', v_redemption.amount,
      'status', 'rejected',
      'balance_after', v_new_balance
    ),
    jsonb_build_object('admin_notes', p_admin_notes)
  );

  return jsonb_build_object(
    'success', true,
    'message', 'Resgate rejeitado e saldo devolvido.'
  );
end;
$$;

comment on function public.admin_reject_wallet_redemption(uuid, text) is
  'Admin rejects redemption. Returns locked funds to available and creates refund ledger entry. Requires duoloot_is_admin().';

-- ---------------------------------------------------------------------------
-- 6. REVOKE RPC execution from public/anon
-- ---------------------------------------------------------------------------

revoke all on function public.ensure_wallet_account(uuid) from public;
revoke all on function public.ensure_wallet_account(uuid) from anon;
grant execute on function public.ensure_wallet_account(uuid) to service_role;

revoke all on function public.grant_wallet_credit(uuid, bigint, text, text, uuid, text, jsonb) from public;
revoke all on function public.grant_wallet_credit(uuid, bigint, text, text, uuid, text, jsonb) from anon;
grant execute on function public.grant_wallet_credit(uuid, bigint, text, text, uuid, text, jsonb) to authenticated, service_role;

revoke all on function public.request_wallet_redemption(text, text, bigint, jsonb) from public;
revoke all on function public.request_wallet_redemption(text, text, bigint, jsonb) from anon;
grant execute on function public.request_wallet_redemption(text, text, bigint, jsonb) to authenticated;

revoke all on function public.admin_approve_wallet_redemption(uuid, text) from public;
revoke all on function public.admin_approve_wallet_redemption(uuid, text) from anon;
grant execute on function public.admin_approve_wallet_redemption(uuid, text) to authenticated;

revoke all on function public.admin_reject_wallet_redemption(uuid, text) from public;
revoke all on function public.admin_reject_wallet_redemption(uuid, text) from anon;
grant execute on function public.admin_reject_wallet_redemption(uuid, text) to authenticated;

commit;
