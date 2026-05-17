# SISTEMA OPERACIONAL DUO LOOT // PROTOCOLO DE AUTENTICAÇÃO
`STATUS: OPERACIONAL // ENCRYPTED ACCESS`

Este documento detalha o fluxo de autenticação real do **Duo Loot**, as políticas de segurança e a sincronização automática dos perfis dos operadores no banco de dados do Supabase.

---

## 1. Arquitetura de Rotas e Proteção

O sistema operacional de rotas é dividido estritamente em zonas de acesso público e privado através do React Router v6.

### Rotas Disponíveis

*   **Públicas** (`public-routes.tsx`):
    *   `/` — Painel Inicial / Scanner de Atividades.
    *   `/lobby` — Lobby Radar (público para visualização, exige login para criar ou entrar).
    *   `/login` — Acesso de Operador ("ACCESS GATE").
    *   `/cadastro` — Registro de Novo Operador.
    *   `/coaches` — Central de Treinamento.
    *   `/perfil/:playerId` — Estatísticas de Operadores.
    *   `/cofre` — Eventos ativos do Vault.
*   **Privadas** (`private-routes.tsx` - protegidas por `ProtectedRoute`):
    *   `/dashboard` — Command Center principal (social, convites, recomendações e conexões).
    *   `/premium` — Atualização de licença operacional.
    *   `/admin/cofre` — Painel do administrador do Vault.

---

## 2. O Papel do AuthProvider

O `AuthProvider` gerencia o estado tático central da sessão da aplicação.

### Estados Expostos:
*   `user`: Usuário nativo retornado pelo Supabase Auth.
*   `session`: Tokens de sessão ativos.
*   `profile`: Perfil do jogador carregado diretamente da tabela `public.profiles`.
*   `isLoading`: Flag de decodificação tática da sessão na inicialização do app.
*   `isAuthenticated`: Booleano indicando status ativo da sessão.

### Ações Expostas:
*   `signIn(email, password)`: Autenticação via email/senha.
*   `signUp(email, password, metadata)`: Registro de nova conta injetando metadados de nome e nickname para criação segura de perfil.
*   `signOut()`: Desconexão limpa do terminal.
*   `refreshProfile()`: Força a atualização do cache do perfil com o banco de dados.

---

## 3. Garantia de Profile Inicial e Sincronização

Todo operador que autentica com sucesso deve possuir um perfil correspondente em `public.profiles`. Para garantir consistência sem duplicidade ou crash de RLS, implementamos o método robusto `ensureUserProfile(user)` em `src/services/auth.service.ts`.

### Fluxo de Registro Seguro:
1.  **Busca de segurança**: O sistema verifica se existe um profile com o `id` correspondente ao UUID do Auth.
2.  **Criação Fallback**: Se o profile não for encontrado, ele é inserido atômica e imediatamente utilizando metadados injetados no cadastro ou fallback baseado no prefixo do e-mail.
3.  **Segurança RLS**: RLS está habilitado na tabela de `profiles`. A inserção inicial do perfil é garantida através de políticas seguras.

---

## 4. Políticas de Banco e Segurança (Row Level Security - RLS)

As tabelas associadas à autenticação seguem regras estritas no Supabase:

### `public.profiles`
*   **Select**: Público (qualquer operador pode ver perfis públicos para recomendações, conexões ou ranking).
*   **Insert**: Permitido apenas para o próprio usuário autenticado (`auth.uid() = id`).
*   **Update**: Permitido apenas se o operador for o proprietário do perfil (`auth.uid() = id`).

### `public.connection_messages` e `public.connections`
*   Proteção por RLS que valida se o `auth.uid()` faz parte da conexão antes de permitir inserção, leitura ou execução da RPC `mark_connection_messages_as_read`.

---

## 5. Resiliência do Sistema (Modo Sandbox)

Caso o terminal seja executado em um ambiente offline ou sem as chaves `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, o aplicativo **não quebrará**.
*   O estado de auth se inicializará graciosamente com valores nulos.
*   Os formulários de login e cadastro exibirão banners táticos de aviso de terminal offline.
*   Rotas públicas continuarão navegáveis graciosamente.

---

## 6. Próximos Passos & Pendências

1.  **OAuth Operators**: Integração com Discord e contas de jogos (ex: Riot Games) para sincronização automática de avatares e nicknames.
2.  **Validação de Nickname**: Integração contínua com banco de dados para evitar conflitos de nickname idênticos no registro.
