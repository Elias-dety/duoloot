-- Sistema base de Karma/Reputacao Duo Loot
-- Escopo desta migration: enums, tabelas, RLS e trigger simples de calculo automatico.

create extension if not exists pgcrypto with schema extensions;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'categoria_desempenho_partida') then
    create type public.categoria_desempenho_partida as enum ('RUIM', 'MEDIA', 'BOM');
  end if;

  if not exists (select 1 from pg_type where typname = 'categoria_comportamento_partida') then
    create type public.categoria_comportamento_partida as enum ('TOXICO', 'NEUTRO', 'BOM');
  end if;
end;
$$;

create table if not exists public.avaliacoes_partidas (
  id uuid primary key default gen_random_uuid(),
  partida_id uuid not null references public.lobbies(id) on delete cascade,
  avaliador_id uuid not null references public.profiles(id) on delete cascade,
  avaliado_id uuid not null references public.profiles(id) on delete cascade,
  categoria_desempenho public.categoria_desempenho_partida not null,
  categoria_comportamento public.categoria_comportamento_partida not null,
  comentario varchar(150),
  criado_em timestamptz not null default now(),
  constraint avaliacoes_partidas_sem_autoavaliacao check (avaliador_id <> avaliado_id),
  constraint avaliacoes_partidas_comentario_limite check (comentario is null or char_length(comentario) <= 150)
);

create unique index if not exists avaliacoes_partidas_unica_por_contexto_idx
  on public.avaliacoes_partidas (partida_id, avaliador_id, avaliado_id);

create index if not exists avaliacoes_partidas_avaliado_idx
  on public.avaliacoes_partidas (avaliado_id, criado_em desc);

create index if not exists avaliacoes_partidas_avaliador_idx
  on public.avaliacoes_partidas (avaliador_id, criado_em desc);

create index if not exists avaliacoes_partidas_partida_idx
  on public.avaliacoes_partidas (partida_id);

create table if not exists public.reputacao_jogador (
  jogador_id uuid primary key references public.profiles(id) on delete cascade,
  score_desempenho_total integer not null default 0,
  score_comportamento_total integer not null default 0,
  karma_geral integer not null default 0,
  total_partidas_avaliadas integer not null default 0,
  ultima_atualizacao timestamptz not null default now()
);

comment on table public.avaliacoes_partidas is 'Avaliacoes obrigatorias feitas por jogadores apos partida/lobby.';
comment on table public.reputacao_jogador is 'Resumo agregado de Karma por jogador para cards, perfis e matchmaking futuro.';
comment on column public.reputacao_jogador.karma_geral is 'Soma de score_desempenho_total + score_comportamento_total.';

create or replace function public.pontos_desempenho_partida(categoria public.categoria_desempenho_partida)
returns integer
language sql
immutable
as $$
  select case categoria
    when 'RUIM' then 0
    when 'MEDIA' then 1
    when 'BOM' then 3
  end;
$$;

create or replace function public.pontos_comportamento_partida(categoria public.categoria_comportamento_partida)
returns integer
language sql
immutable
as $$
  select case categoria
    when 'TOXICO' then -5
    when 'NEUTRO' then 1
    when 'BOM' then 3
  end;
$$;

create or replace function public.recalcular_reputacao_jogador(p_jogador_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_score_desempenho integer := 0;
  v_score_comportamento integer := 0;
  v_total integer := 0;
begin
  if p_jogador_id is null then
    return;
  end if;

  select
    coalesce(sum(public.pontos_desempenho_partida(categoria_desempenho)), 0)::integer,
    coalesce(sum(public.pontos_comportamento_partida(categoria_comportamento)), 0)::integer,
    count(*)::integer
  into v_score_desempenho, v_score_comportamento, v_total
  from public.avaliacoes_partidas
  where avaliado_id = p_jogador_id;

  if v_total = 0 then
    delete from public.reputacao_jogador where jogador_id = p_jogador_id;
    return;
  end if;

  insert into public.reputacao_jogador (
    jogador_id,
    score_desempenho_total,
    score_comportamento_total,
    karma_geral,
    total_partidas_avaliadas,
    ultima_atualizacao
  ) values (
    p_jogador_id,
    v_score_desempenho,
    v_score_comportamento,
    v_score_desempenho + v_score_comportamento,
    v_total,
    now()
  )
  on conflict (jogador_id) do update set
    score_desempenho_total = excluded.score_desempenho_total,
    score_comportamento_total = excluded.score_comportamento_total,
    karma_geral = excluded.karma_geral,
    total_partidas_avaliadas = excluded.total_partidas_avaliadas,
    ultima_atualizacao = now();
end;
$$;

create or replace function public.sincronizar_reputacao_jogador()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.recalcular_reputacao_jogador(old.avaliado_id);
    return old;
  end if;

  perform public.recalcular_reputacao_jogador(new.avaliado_id);

  if tg_op = 'UPDATE' and old.avaliado_id <> new.avaliado_id then
    perform public.recalcular_reputacao_jogador(old.avaliado_id);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_sincronizar_reputacao_jogador on public.avaliacoes_partidas;
create trigger trg_sincronizar_reputacao_jogador
after insert or update or delete on public.avaliacoes_partidas
for each row
execute function public.sincronizar_reputacao_jogador();

alter table public.avaliacoes_partidas enable row level security;
alter table public.reputacao_jogador enable row level security;

drop policy if exists "Jogadores leem avaliacoes envolvendo eles" on public.avaliacoes_partidas;
create policy "Jogadores leem avaliacoes envolvendo eles"
on public.avaliacoes_partidas
for select
to authenticated
using (auth.uid() = avaliador_id or auth.uid() = avaliado_id);

drop policy if exists "Jogadores criam avaliacoes como avaliador" on public.avaliacoes_partidas;
create policy "Jogadores criam avaliacoes como avaliador"
on public.avaliacoes_partidas
for insert
to authenticated
with check (auth.uid() = avaliador_id and avaliador_id <> avaliado_id);

drop policy if exists "Jogadores atualizam suas avaliacoes" on public.avaliacoes_partidas;
create policy "Jogadores atualizam suas avaliacoes"
on public.avaliacoes_partidas
for update
to authenticated
using (auth.uid() = avaliador_id)
with check (auth.uid() = avaliador_id and avaliador_id <> avaliado_id);

drop policy if exists "Jogadores apagam suas avaliacoes" on public.avaliacoes_partidas;
create policy "Jogadores apagam suas avaliacoes"
on public.avaliacoes_partidas
for delete
to authenticated
using (auth.uid() = avaliador_id);

drop policy if exists "Usuarios autenticados leem karma" on public.reputacao_jogador;
create policy "Usuarios autenticados leem karma"
on public.reputacao_jogador
for select
to authenticated
using (true);

grant select, insert, update, delete on public.avaliacoes_partidas to authenticated;
grant select on public.reputacao_jogador to authenticated;

do $$
begin
  notify pgrst, 'reload schema';
exception
  when others then null;
end;
$$;
