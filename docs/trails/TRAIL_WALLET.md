# Trilha — Wallet / DuoCoins

Esta trilha orienta trabalhos relacionados à Carteira (Wallet), DuoCoins, saldo resgatável, catálogo de recompensas, resgates e auditoria financeira.

## Objetivo

Criar e manter um sistema de saldo resgatável separado dos pontos do Cofre. DuoCoins representam saldo com valor interno que pode ser trocado por benefícios dentro da plataforma.

## Escopo

Faz parte desta trilha:

- wallet_accounts;
- wallet_ledger_entries;
- wallet_redemptions;
- reward_catalog;
- wallet_audit_logs;
- RPCs de crédito e débito;
- RPCs de resgate (request, approve, reject);
- página WalletPage;
- página AdminWalletPage;
- serviço wallet.service.ts;
- serviço wallet-admin.service.ts;
- integração com missões do Cofre;
- antifraude e risk flags.

## Fora de escopo

Não alterar sem autorização ou trilha complementar:

- vault_participants.points (ranking do Cofre);
- vault_events, vault_missions (gamificação);
- pagamento real automático (PIX, Stripe, etc);
- dados financeiros legais ou fiscais.

## Relação com o Cofre (Vault)

```txt
Vault Points = ranking, temporada, progresso e gamificação (vault_participants.points)
DuoCoins     = saldo resgatável com valor (wallet_accounts.available_balance)
```

O Cofre pode gerar DuoCoins quando uma missão aprovada chama `grant_wallet_credit`, mas os pontos de ranking continuam no `vault_participants.points`.

## Regras de produto

1. DuoCoins são saldo interno, não dinheiro real (MVP).
2. Todo resgate passa por revisão admin manual.
3. Saldo nunca é editado diretamente — apenas via RPC.
4. Ledger é imutável — sem UPDATE/DELETE.
5. Toda ação admin gera registro em wallet_audit_logs.
6. Usuário só vê seus próprios dados (RLS).
7. Recompensas do MVP são internas (badges, temas, destaque).

## Regras técnicas

1. Todas as mutações de saldo passam por RPCs SECURITY DEFINER.
2. Idempotência obrigatória via `idempotency_key`.
3. Resgate bloqueia saldo (available → locked) antes da revisão.
4. Admin verificado por `duoloot_is_admin()` no banco.
5. Frontend não expõe ações de crédito ou admin ao usuário.
6. RLS ativo em todas as 5 tabelas da wallet.
7. Nenhuma policy de INSERT/UPDATE/DELETE para usuário regular.

## Regras de segurança

Atenção máxima para:

- fraude de DuoCoins (crédito sem missão);
- replay de idempotency_key;
- usuário tentando chamar RPC admin;
- manipulação de saldo via payload;
- IDOR em resgates;
- múltiplos resgates simultâneos;
- carteira congelada tentando resgatar.

Qualquer correção de segurança na Wallet deve ser registrada em:

`docs/security/SECURITY_HISTORY.md`

## Arquivos prováveis

- `src/features/wallet/`
- `src/pages/WalletPage.tsx`
- `src/pages/AdminWalletPage.tsx`
- `src/services/wallet.service.ts`
- `src/services/wallet-admin.service.ts`
- `supabase/migrations/025_wallet_system.sql`

## Fluxos principais

### Ganho de DuoCoins
1. Usuário completa missão no Cofre
2. Sistema marca missão como completed
3. Sistema chama `grant_wallet_credit` com idempotency_key
4. Ledger cria crédito confirmed
5. available_balance aumenta
6. Extrato mostra entrada

### Resgate
1. Usuário escolhe recompensa no catálogo
2. Sistema verifica saldo disponível
3. `request_wallet_redemption` move available → locked
4. Ledger cria debit pending
5. Admin revisa
6. Aprovado → locked diminui, ledger confirmed, redemption paid
7. Rejeitado → locked diminui, available aumenta, refund no ledger

## Pendências conhecidas

- [ ] Integrar `grant_wallet_credit` na RPC de conclusão de missão
- [ ] Criar seed de catálogo de recompensas internas
- [ ] Implementar wallet_risk_flags para antifraude
- [ ] Adicionar limites diários/semanais de ganho
- [ ] Adicionar cooldown entre resgates

## Critério de pronto

Uma alteração na Wallet só está pronta quando:

- saldo é protegido por RPC e RLS;
- ledger é imutável;
- idempotência está funcionando;
- admin é validado no banco;
- testes foram rodados ou registrados em `docs/REMOTE_TODO.md`;
- qualquer risco de fraude foi analisado;
- alterações foram registradas no changelog.
