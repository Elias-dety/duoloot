# Supabase Integration - Duo Loot

Este documento serve como **Fonte de Verdade (Source of Truth)** para a integração do projeto Duo Loot com o [Supabase](https://supabase.com). Ele detalha como a aplicação se conecta, quais são as dependências, e como o código interage com o banco de dados e autenticação.

---

## 1. Visão Geral da Arquitetura

O Duo Loot utiliza a biblioteca oficial `@supabase/supabase-js` para interagir com os serviços de **Auth**, **PostgreSQL Database** e **Realtime** do Supabase.

A inicialização e exportação do cliente principal ficam centralizadas no arquivo:
`src/lib/supabase.ts`

### 1.1 Degradação Graciosa (Mock Fallback)
A aplicação possui um sistema de segurança (`isSupabaseConfigured`) para evitar que a interface quebre caso as variáveis de ambiente não estejam configuradas. Se o banco não for detectado, os serviços retornam valores nulos ou falsos, permitindo que as páginas exibam componentes `EmptyState` e continuem navegáveis.

### 1.2 Variáveis de Ambiente
Para plugar a aplicação real, você deve fornecer as seguintes variáveis de ambiente (no arquivo `.env.local` ou na Vercel):
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

---

## 2. Autenticação (Supabase Auth)

A autenticação da aplicação é puramente controlada pelo Supabase Auth. Não controlamos senhas nem tokens diretamente.

- **Provedor**: E-mail e Senha.
- **Provider de Contexto**: `src/features/auth/AuthProvider.tsx` gerencia o estado global de autenticação injetando a `session`.
- **Registro**: Utiliza `supabase.auth.signUp()`.
- **Login**: Utiliza `supabase.auth.signInWithPassword()`.
- **Proteção de Rotas**: O componente `ProtectedRoute.tsx` verifica se o usuário possui sessão. Se não houver, expulsa para `/login`.

### 2.1 Sincronização Auth ➔ Tabela Public
O Supabase armazena usuários no schema `auth.users` (privado). O sistema depende de uma tabela pública chamada `public.profiles` para renderizar avatares e nomes. O código `auth.service.ts` contém a função `ensureUserProfile` que tenta forçar a criação deste perfil no ato do cadastro, no entanto, a **prática ideal em produção é usar uma Database Trigger no Supabase** que faz o `INSERT` em `public.profiles` automaticamente após um novo registro em `auth.users`.

---

## 3. Estrutura de Banco de Dados

Os serviços no diretório `src/services/` usam extensivamente chamadas RPC (`supabase.rpc`) e queries diretas (`supabase.from`). O banco DEVE ter a seguinte estrutura para que a aplicação funcione:

### Tabelas Principais:
1. `profiles`: Armazena o Perfil Público (nome, nickname, trust score, is_premium, stats).
2. `lobbies`: Lobbies de partida criados pelos jogadores.
3. `player_invites`: Sistema de convite para conexões (amizades).
4. `player_connections`: Amizades confirmadas e chat entre os usuários.
5. `connection_messages`: Histórico de chat.

### Tabelas do Vault (Cofre):
O Vault é o ecossistema mais complexo de banco de dados do projeto:
- `vault_events`: Controla se uma temporada/cofre está ativo.
- `vault_missions`: As missões vinculadas ao cofre.
- `vault_participants`: Quem se inscreveu no cofre (Leaderboard).
- `vault_mission_progress`: O progresso individual do player.
- `vault_submissions`: Casos em que o player envia prints/provas (se manual).
- `vault_winners`: Premiação final do cofre.

---

## 4. Comunicação e Consumo de Dados (Frontend ➔ Supabase)

Para garantir segurança de tipos e segurança no banco (RLS - Row Level Security), o frontend delega operações sensíveis para **RPCs (Remote Procedure Calls)** ou as chama via `.from()`.

### Padrão de Serviço (`src/services/`)
Toda requisição externa passa por um "Service". O Service captura possíveis erros técnicos e os transforma em strings amigáveis para a interface através do método interno `handleServiceError()`.

- **Exemplo de Query Direta**: 
  A obtenção dos *Lobbies abertos* faz uma query clássica com Join:
  ```ts
  supabase.from('lobbies').select('*, owner:profiles!owner_id(*)').eq('status', 'open')
  ```

- **Exemplo de RPC**:
  Em regras onde há concorrência (ex: ganhar pontos no Vault), a UI não atualiza a tabela progress manualmente, ela envia a requisição para uma função do banco:
  ```ts
  supabase.rpc('claim_vault_mission_progress', { p_mission_id: ID, p_increment: 1 })
  ```

### Integração com Zod
Para os dados que retornam do banco (onde JSON é volátil), o frontend usa **Zod** (`src/schemas/*.ts`) ou asserção de tipos rígida nas promessas para parsear o resultado e garantir que a UI nunca quebre por um tipo incorreto.

---

## 5. Security (Row Level Security - RLS)

Todas as tabelas devem ter o RLS (`Enable Row Level Security`) ativado. As Políticas Básicas esperadas são:
- **`profiles` / `lobbies`**: Leitura pública para que qualquer pessoa (mesmo deslogada) possa ver a vitrine/dashboard, mas Escrita/Update apenas pelo respectivo `auth.uid()`.
- **`vault_events` / `vault_missions`**: Leitura pública. Alteração bloqueada para todos (somente `service_role` / painel admin pode criar).

## 6. Fluxos de Exceção (Fallback Local)
Atualmente a aplicação possui diretórios como `src/data/mocks`. Esses *mocks* operam **APENAS** se o Supabase retornar vazio (ou se houver mock explícito forçado nas flags de teste E2E). Ao colocar a aplicação online com as chaves inseridas, o Duo Loot abandonará imediatamente as simulações e tentará ler do seu Supabase.
