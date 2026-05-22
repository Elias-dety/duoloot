---
description: 
---

# Executar o Duo Loot no navegador

Este guia serve para abrir o projeto **Duo Loot** localmente no navegador.

## 1. Abrir a pasta do projeto

No VS Code, Antigravity ou terminal, abra a pasta principal do projeto:

```bash
duoloot

A pasta correta é a que contém arquivos como:

package.json
src/
vite.config.ts
tailwind.config.ts
2. Instalar dependências

Rode:

npm install

Use isso quando:

abriu o projeto pela primeira vez;
puxou alterações novas do GitHub;
apareceu erro dizendo que falta algum pacote.
3. Criar ou conferir o arquivo .env

Na raiz do projeto, confira se existe um arquivo:

.env

Se não existir, crie com base no .env.example.

Exemplo:

VITE_SUPABASE_URL=coloque_a_url_do_supabase_aqui
VITE_SUPABASE_ANON_KEY=coloque_a_anon_key_aqui

Atenção:

Nunca coloque RIOT_API_KEY no front-end.
A chave da Riot deve ficar somente no backend ou Supabase Edge Functions.
4. Rodar o projeto

Execute:

npm run dev

O terminal deve mostrar algo parecido com:

Local: http://localhost:5173/

Abra esse link no navegador.

5. Abrir no navegador

Acesse:

http://localhost:5173/

Rotas úteis do Duo Loot:

Home:        http://localhost:5173/
Lobby:       http://localhost:5173/lobby
Cofre:       http://localhost:5173/cofre
Login:       http://localhost:5173/login
Cadastro:   http://localhost:5173/cadastro
Dashboard:  http://localhost:5173/dashboard
Premium:    http://localhost:5173/premium
Onboarding: http://localhost:5173/onboarding
6. Testar se está tudo certo

Depois de alterações importantes, rode:

npm run lint
npm run build
npm run test -- --run

Se quiser testar E2E:

npm run test:e2e
7. Quando puxar atualizações do GitHub

Antes de trabalhar, rode:

git status
git pull origin main
npm install
npm run dev

Se tiver alterações locais e o pull der conflito, use:

git status

Leia os arquivos conflitantes antes de aceitar qualquer mudança automática.

8. Problemas comuns
Porta ocupada

Se o Vite usar outra porta, ele pode mostrar algo como:

http://localhost:5174/

Use o link que aparecer no terminal.

Tela branca

Tente:

npm install
npm run dev

Depois abra o console do navegador com:

F12 > Console

Veja o erro exibido.

Erro de Supabase

Confira se o .env existe e se as variáveis estão corretas:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

Depois reinicie o servidor:

CTRL + C
npm run dev
Visual não atualizou

Pare o servidor e rode de novo:

CTRL + C
npm run dev

Também pode limpar o cache do navegador com:

CTRL + F5
9. Identidade visual atual

O projeto está usando a identidade:

Duo Loot Codefire UI

Resumo visual:

Dark mode premium
Riot Mobile + VS Code Dark Theme
Cards arredondados
Bordas finas
Cores de destaque em estilo syntax highlight
Visual gamer moderno e limpo

Cores principais:

Fundo: #0f0f12
Painel: #18181c
Painel elevado: #202026
Borda: #29292f
Vermelho CTA: #ff4655
Ciano stats: #0df0ff
Verde sucesso: #3bd982
Roxo premium/função: #b084ff
Amarelo recompensa: #ffd166
Erro/derrota: #ff5c7a
10. Comando rápido

Para abrir o projeto no navegador:

npm install
npm run dev

Depois acesse:

http://localhost:5173/