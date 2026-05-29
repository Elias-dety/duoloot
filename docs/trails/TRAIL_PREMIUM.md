# Trilha — Premium

Esta trilha orienta qualquer trabalho relacionado a planos pagos, benefícios, permissões, limites e experiência Premium do Duo Loot.

## Objetivo

Construir um sistema Premium que melhore a experiência do usuário sem transformar o Duo Loot em pay-to-win injusto.

Premium deve oferecer conveniência, organização, destaque, personalização ou recursos extras, mas não deve quebrar a confiança do matchmaking.

## Escopo

Faz parte desta trilha:

- planos pagos;
- benefícios Premium;
- status de assinatura;
- limites por plano;
- upgrade e downgrade;
- expiração;
- integração futura com pagamento;
- permissões por plano;
- UI de planos;
- bloqueios e desbloqueios de recursos;
- histórico de assinatura;
- benefícios no matchmaking, perfil, Vault ou lobbies.

## Fora de escopo

Não alterar sem trilha ou autorização específica:

- regras centrais de segurança;
- dados reais de pagamento;
- segredo de gateway de pagamento;
- service role key;
- banco remoto de produção;
- remoção de usuários reais.

## Regras de produto

1. Premium não deve permitir fraude, abuso ou vantagem competitiva injusta.
2. Usuário gratuito deve conseguir usar o núcleo do Duo Loot.
3. Premium pode melhorar visibilidade, organização, filtros e personalização.
4. Premium pode reduzir fricção, mas não deve manipular confiança de forma falsa.
5. Benefício Premium precisa ser claro para o usuário.
6. Planos devem ser pensados para expansão futura: Free, Plus, Premium, Pro ou outros.

## Regras técnicas

1. Status Premium não pode ser confiado vindo do frontend.
2. Plano do usuário deve vir de camada confiável, preferencialmente banco/RPC.
3. UI pode esconder recurso, mas backend deve validar acesso real.
4. Benefícios sensíveis precisam de validação server-side, RLS, RPC ou Edge Function.
5. Não criar lógica duplicada de plano espalhada em componentes.
6. Criar tipos claros para plano, status e benefício.

## Regras de segurança

Nunca confiar em campos vindos do cliente como:

- `is_premium`;
- `plan`;
- `role`;
- `points`;
- `balance`;
- `subscription_status`;
- `expires_at`.

Toda alteração envolvendo Premium, pontos, recompensas ou permissões deve seguir `docs/security/SECURITY_POLICY.md`.

Se corrigir ou endurecer qualquer lógica Premium, registrar em:

`docs/security/SECURITY_HISTORY.md`

## Arquivos prováveis

- `src/features/premium/`
- `src/pages/Premium*`
- `src/services/`
- `src/routes/`
- `src/components/`
- `supabase/migrations/`
- `supabase/functions/`

## Fluxos principais

- visualizar planos;
- identificar plano atual;
- bloquear recurso não permitido;
- liberar recurso permitido;
- tratar assinatura expirada;
- impedir usuário comum de forçar plano pelo cliente;
- manter experiência clara para Free e Premium.

## Testes esperados

- usuário Free não acessa benefício restrito;
- usuário Premium acessa benefício permitido;
- alterar `is_premium` no frontend não libera recurso real;
- plano expirado não mantém benefício indevido;
- usuário comum não altera plano de outro usuário;
- build passa após alterações.

## Pendências conhecidas

- [ ] Definir modelo definitivo de planos.
- [ ] Definir tabela ou estrutura de assinaturas.
- [ ] Definir benefícios por plano.
- [ ] Definir integração futura com gateway de pagamento.
- [ ] Definir testes de autorização por plano.

## Critério de pronto

Uma alteração Premium só está pronta quando:

- regra de produto está clara;
- permissão real não depende só do frontend;
- testes foram rodados ou registrados em `docs/REMOTE_TODO.md`;
- riscos de segurança foram analisados;
- mudanças sensíveis foram registradas no histórico de segurança.