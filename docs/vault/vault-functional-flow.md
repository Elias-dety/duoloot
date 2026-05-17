# Fluxo Funcional do Cofre (Vault)

O sistema do Cofre agora está totalmente conectado ao backend, suportando participação, missões individuais e progresso em tempo real.

## Estrutura de Tabelas (Migração 017)

1. **vault_events**: Armazena as propriedades principais do evento do cofre, incluindo metas (`goal_points`) e progresso atual global (`current_points`).
2. **vault_participants**: Liga usuários (`player_id`) a eventos, guardando o status da inscrição e a quantidade de pontos individuais acumulados.
3. **vault_missions**: Define os contratos e missões ativas dentro de um evento, o valor alvo para completá-las e a recompensa em pontos.
4. **vault_mission_progress**: Registra o andamento individual (por usuário e por missão), atualizando contadores atômicos até a conclusão.

## Principais Endpoints e RPCs

- `join_vault_event(p_event_id)`: Registra um usuário no evento (Security Definer) e gera automaticamente o acompanhamento de progresso (`vault_mission_progress`) para todas as missões ativas (`vault_missions`).
- `claim_vault_mission_progress(p_mission_id, p_increment)`: Increciona o progresso de uma missão de forma segura para evitar inconsistências. Se a missão for concluída, adiciona pontos ao `vault_participants` e soma à meta geral do evento em `vault_events`.

## Componentes Visuais do Cofre

- **VaultPage**: Ponto central de montagem, responsável por consumir o `vault-progress.service.ts` e despachar estados (loading, auth, etc.) e ações.
- **VaultTemplate**: Posicionamento macro dos painéis seguindo o design de HUD *Tactical Underground Loot*.
- **VaultJoinPanel**: Controla o CTA para ingresso de novos participantes (exigindo autenticação se não logado).
- **VaultProgressPanel**: Visão do usuário logado demonstrando seu aproveitamento geral, pontos retidos e total de missões concluídas no torneio atual.
- **VaultStatsPanel**: Status lateral global demonstrando número de participantes totais, timer ou limite final e barra de conclusão geral.
- **VaultMissionCard**: Renderização de cada contrato (missão), suportando registro individual, visualização e *status label* de sucesso quando concluído.

## Regras de Segurança (RLS)

- Somente os donos (`player_id = auth.uid()`) podem ler seus dados em `vault_mission_progress`.
- A inserção e manipulação de pontuações ocorre internamente nos RPCs configurados como `SECURITY DEFINER`, minimizando a necessidade de expor inserção direta aos clientes.

## Atualizações em Tempo Real (Realtime)

A `VaultPage` se inscreve via Supabase no `vault-realtime-channel` e observa atualizações no progresso de missões, inscrições de novos usuários e do progresso geral do próprio evento. Toda atualização dispara re-fetches silenciosos (`fetchVaultData({ silent: true })`).
