# Testes de Segurança e Integridade da Wallet / DuoCoins

Este documento descreve os cenários de testes manuais e de segurança para validar a corretude e a robustez do sistema de Wallet no Duo Loot.

---

## Teste 1 — Idempotência

**Objetivo:** Garantir que o mesmo crédito não seja aplicado duas vezes para a mesma ação/evento.

**Cenário:**
1. Chamar a RPC `grant_wallet_credit` com uma determinada `idempotency_key`.
2. Chamar novamente `grant_wallet_credit` com os mesmos parâmetros e a mesma `idempotency_key`.

**SQL de Teste:**
```sql
-- Primeiro crédito
select public.grant_wallet_credit(
  'USER_ID_AQUI',
  500,
  'mission_reward',
  'test_idempotency',
  '00000000-0000-0000-0000-000000000001',
  'test-idempotency-key-unique-123',
  '{"test": true}'
);

-- Segunda chamada com mesma chave
select public.grant_wallet_credit(
  'USER_ID_AQUI',
  500,
  'mission_reward',
  'test_idempotency',
  '00000000-0000-0000-0000-000000000001',
  'test-idempotency-key-unique-123',
  '{"test": true}'
);
```

**Resultado esperado:**
* A primeira chamada adiciona 500 DuoCoins e retorna `'duplicated': false`.
* A segunda chamada retorna `'duplicated': true` e o saldo da conta permanece inalterado.

---

## Teste 2 — Saldo Insuficiente

**Objetivo:** Evitar que usuários comprem recompensas sem DuoCoins suficientes.

**Cenário:**
1. Garantir que um usuário tenha saldo menor que o custo de uma recompensa (ex: saldo = 100 DuoCoins).
2. Solicitar resgate de uma recompensa de custo 500 chamando `request_wallet_redemption`.

**SQL de Teste:**
```sql
-- Simula chamada do usuário
select public.request_wallet_redemption(
  'internal_badge',
  'Badge Fundador',
  500,
  '{}'::jsonb
);
```

**Resultado esperado:**
* A RPC lança uma exceção com a mensagem `'Saldo insuficiente.'`.
* Nenhum resgate é criado e o saldo permanece intocado.

---

## Teste 3 — Resgate Solicitado

**Objetivo:** Validar que ao solicitar resgate, o saldo disponível diminui e é travado no saldo bloqueado.

**Cenário:**
1. Usuário tem 1000 DuoCoins de saldo disponível (`available_balance`).
2. Solicita resgate de uma recompensa de custo 500.

**SQL de Teste:**
```sql
-- Solicitar resgate
select public.request_wallet_redemption(
  'internal_badge',
  'Badge Fundador',
  500,
  '{}'::jsonb
);

-- Checar tabelas
select available_balance, locked_balance from public.wallet_accounts where user_id = auth.uid();
select status from public.wallet_redemptions where user_id = auth.uid() order by requested_at desc limit 1;
select type, status from public.wallet_ledger_entries where user_id = auth.uid() order by created_at desc limit 1;
```

**Resultado esperado:**
* `available_balance` = 500
* `locked_balance` = 500
* `wallet_redemptions.status` = `'requested'`
* Entrada no extrato (ledger) de `type` = `'redemption_debit'` com `status` = `'pending'`

---

## Teste 4 — Resgate Aprovado

**Objetivo:** Garantir a liberação correta do saldo bloqueado para o histórico de resgatados e a confirmação no ledger.

**Cenário:**
1. Admin aprova o resgate de 500 solicitado anteriormente.

**SQL de Teste:**
```sql
-- Admin aprova (executado por conta Admin ou service_role)
select public.admin_approve_wallet_redemption(
  'REDEMPTION_ID_OBTIDO_NO_TESTE_3',
  'Aprovado pelo teste automatizado'
);

-- Checar tabelas
select available_balance, locked_balance, lifetime_redeemed from public.wallet_accounts where user_id = 'USER_ID';
select status from public.wallet_redemptions where id = 'REDEMPTION_ID';
select status from public.wallet_ledger_entries where source_id = 'REDEMPTION_ID';
```

**Resultado esperado:**
* `available_balance` = 500
* `locked_balance` = 0
* `lifetime_redeemed` = 500
* `wallet_redemptions.status` = `'paid'`
* Entrada do ledger de `redemption_debit` muda para `status` = `'confirmed'`

---

## Teste 5 — Resgate Rejeitado

**Objetivo:** Validar o estorno correto do saldo bloqueado de volta para o saldo disponível e criação do reembolso no ledger.

**Cenário:**
1. Solicitar novo resgate de 500 (locked = 500).
2. Admin rejeita este resgate.

**SQL de Teste:**
```sql
-- Admin rejeita (executado por conta Admin ou service_role)
select public.admin_reject_wallet_redemption(
  'NEW_REDEMPTION_ID',
  'Rejeitado pelo teste automatizado'
);

-- Checar tabelas
select available_balance, locked_balance from public.wallet_accounts where user_id = 'USER_ID';
select status from public.wallet_redemptions where id = 'NEW_REDEMPTION_ID';
select status from public.wallet_ledger_entries where source_id = 'NEW_REDEMPTION_ID';
```

**Resultado esperado:**
* `available_balance` volta a ser 500 (recebe estorno de 500)
* `locked_balance` = 0
* `wallet_redemptions.status` = `'rejected'`
* O ledger de débito original muda para `status` = `'cancelled'`
* É adicionada uma nova linha no ledger de `type` = `'redemption_refund'` com `status` = `'confirmed'` para registrar o reembolso.

---

## Teste 6 — Row Level Security (RLS)

**Objetivo:** Impedir invasão de privacidade e adulteração de saldos entre contas de usuários diferentes.

**Cenários de ataque:**
1. Usuário comum tenta fazer INSERT/UPDATE/DELETE diretamente na tabela `wallet_ledger_entries` ou `wallet_accounts`.
2. Usuário comum tenta ler dados de carteira (`wallet_accounts`) ou extrato (`wallet_ledger_entries`) de outro usuário.

**SQL de Teste:**
```sql
-- Como usuário_comum_1:
insert into public.wallet_ledger_entries (account_id, user_id, direction, amount, balance_after, type, idempotency_key, source)
values ('ID_WAL_OUTRO', 'ID_OUTRO', 'credit', 999999, 999999, 'admin_credit', 'fake-key', 'cheat');

update public.wallet_accounts set available_balance = 999999 where user_id = auth.uid();

-- Como usuário_comum_1 tentando bisbilhotar:
select * from public.wallet_accounts where user_id = 'ID_USUARIO_2';
```

**Resultado esperado:**
* Operações de modificação direta falham/são bloqueadas (erro de permissão ou não batem com nenhuma policy de escrita).
* O SELECT na carteira do usuário 2 retorna 0 linhas.
