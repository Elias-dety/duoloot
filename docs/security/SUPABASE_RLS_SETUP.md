# Supabase RLS setup do DuoLoot

Este guia explica como aplicar a primeira migration de segurança e como avançar para RLS completo sem adivinhar o schema real.

## 1. Migration criada

Arquivo:

```txt
supabase/migrations/20260527000100_security_roles_and_helpers.sql
```

Ela cria:

- tabela `public.user_roles`;
- função `public.duoloot_current_user_role()`;
- função `public.duoloot_has_role(text[])`;
- função `public.duoloot_is_admin()`;
- RLS em `user_roles`;
- policy para usuário ver a própria role e admin ver todas.

Ela não cria admin automaticamente.

## 2. Como aplicar localmente

Com Supabase CLI configurado:

```bash
supabase db push
```

Ou, se estiver usando ambiente local:

```bash
supabase start
supabase db reset
```

Atenção: `db reset` recria o banco local. Não use em produção.

## 3. Como aplicar no projeto remoto

Use o fluxo seguro do Supabase CLI para o projeto correto:

```bash
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

Antes de aplicar em produção, revisar o SQL no arquivo de migration.

## 4. Como definir o primeiro admin

Depois de aplicar a migration, descubra o `id` do seu usuário em `auth.users` no Supabase.

Então execute usando SQL Editor com permissão segura ou service role:

```sql
insert into public.user_roles (user_id, role)
values ('COLE_AQUI_O_AUTH_USER_ID', 'owner')
on conflict (user_id)
do update set
  role = excluded.role,
  updated_at = now();
```

Nunca aceite `role`, `is_admin` ou `is_owner` vindo do frontend.

## 5. Como usar em RPCs administrativas

Toda RPC admin deve negar por padrão:

```sql
if not public.duoloot_is_admin() then
  raise exception 'permission denied' using errcode = '42501';
end if;
```

Aplicar isso obrigatoriamente em funções como:

```txt
validate_vault_submission
finalize_vault_event
```

## 6. Próxima migration recomendada

Depois de confirmar o schema real do banco, criar uma migration específica para RLS das tabelas existentes.

Ordem recomendada:

1. `profiles`
2. `lobbies`
3. `lobby_members`
4. `player_invites`
5. `player_connections`
6. `connection_messages`
7. tabelas do Vault/Cofre
8. tabelas de Premium/pontos/recompensas

## 7. Modelo de policy para profiles

Ajustar conforme schema real:

```sql
alter table public.profiles enable row level security;

create policy profiles_select_public_safe
on public.profiles
for select
to authenticated
using (true);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());
```

Observação: se `profiles` tiver campos privados, não use leitura pública direta da tabela. Crie uma view segura com apenas campos públicos.

## 8. Modelo de policy para lobbies

Ajustar conforme schema real:

```sql
alter table public.lobbies enable row level security;

create policy lobbies_select_open
on public.lobbies
for select
to authenticated
using (status = 'open' or owner_id = auth.uid() or public.duoloot_is_admin());

create policy lobbies_insert_own
on public.lobbies
for insert
to authenticated
with check (owner_id = auth.uid());

create policy lobbies_update_own_or_admin
on public.lobbies
for update
to authenticated
using (owner_id = auth.uid() or public.duoloot_is_admin())
with check (owner_id = auth.uid() or public.duoloot_is_admin());
```

## 9. Modelo de policy para convites

Ajustar nomes de colunas conforme schema real:

```sql
alter table public.player_invites enable row level security;

create policy player_invites_select_involved
on public.player_invites
for select
to authenticated
using (sender_id = auth.uid() or receiver_id = auth.uid() or public.duoloot_is_admin());

create policy player_invites_insert_sender
on public.player_invites
for insert
to authenticated
with check (sender_id = auth.uid());

create policy player_invites_update_receiver_or_admin
on public.player_invites
for update
to authenticated
using (receiver_id = auth.uid() or public.duoloot_is_admin())
with check (receiver_id = auth.uid() or public.duoloot_is_admin());
```

## 10. Checklist antes de considerar RLS pronto

- [ ] Todas as tabelas sensíveis têm RLS ativo.
- [ ] Usuário A não lê dados privados do usuário B.
- [ ] Usuário comum não executa RPC admin.
- [ ] Admin real executa RPC admin.
- [ ] Inserts não aceitam dono falso.
- [ ] Updates não aceitam trocar `owner_id`, `user_id`, `role`, `status` crítico ou `points` pelo cliente.
- [ ] Toda RPC crítica usa `auth.uid()`.
- [ ] Toda action admin usa `duoloot_is_admin()`.
- [ ] As migrations estão versionadas no GitHub.

## 11. Regra final

Não criar policies definitivas sem confirmar o schema real.

Esta primeira migration cria a base segura de roles. As próximas devem ser por tabela e testadas uma por uma.
