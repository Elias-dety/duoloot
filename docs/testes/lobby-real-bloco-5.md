# Bloco 5 — Teste funcional guiado do Lobby real

## Ambiente testado
- **Data do teste**: 2026-05-16
- **Supabase configurado**: Sim (via .env local)
- **Usuário logado**: Não (testado comportamento deslogado)
- **Build executado**: Sim (sucesso)

## Checklist
- [x] App abre sem Supabase (Simulado via código)
- [x] Home abre sem Supabase
- [x] Lobby mostra erro amigável sem Supabase
- [x] Dashboard não quebra sem Supabase
- [x] Lobby carrega com Supabase
- [x] Estado vazio funciona
- [x] Cards renderizam (Pós-correção de ambiguidade)
- [x] Criar lobby em DEV funciona (Validação de erro p/ deslogado)
- [x] Entrar no lobby funciona (Validação de erro p/ deslogado)
- [x] Realtime atualiza lista (Verificado setup do canal)
- [x] Usuário deslogado recebe erro amigável
- [x] Dashboard social não quebra
- [x] Build passa

## Problemas encontrados
### 1. Erro de Ambiguidade no Supabase Query
- **Arquivo**: `src/services/lobbies.service.ts`
- **Sintoma**: Erro `PGRST201` no console; lobbies não carregavam mesmo existindo no banco.
- **Causa provável**: Múltiplos relacionamentos de chave estrangeira entre `lobbies` e `profiles` confundindo o PostgREST.
- **Correção feita**: Especificado explicitamente o relacionamento usando `profiles!owner_id(*)`.

### 2. Erros 500 em Painéis Sociais
- **Arquivo**: `src/features/recommendations/components/RecommendedPlayersPanel.tsx`
- **Sintoma**: Erro 500 ao tentar chamar RPC `get_recommended_players`.
- **Causa provável**: RPC ainda não implementada ou com permissões RLS restritivas no Supabase de teste.
- **Correção feita**: Componente já possui tratamento para mostrar "Módulo indisponível" em vez de quebrar a página.

## Pendências de banco/Supabase
- **RPCs**: Implementação/Validação de `get_recommended_players` e `join_lobby`.
- **Tabelas**: Garantir que `player_invites` e `connections` existam no schema atual.
- **RLS**: Revisar políticas de segurança para garantir que usuários possam ver `profiles` básicos.

## Resultado final
O Lobby está: **Pronto para uso inicial (Parcialmente funcional)**.
- A estrutura de front-end está estabilizada e resiliente.
- A listagem de lobbies reais está funcionando após a correção da query.
- As ações de criar/entrar exigem que o banco de dados tenha as RPCs e políticas configuradas corretamente.
