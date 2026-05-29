# Regras do Projeto — Duo Loot

Este arquivo define o que o Duo Loot é como produto, qual experiência deve entregar e quais limites devem orientar qualquer decisão.

Este arquivo não é técnico. Detalhes de stack, arquitetura, banco, rotas e testes pertencem a `docs/TECHNICAL_GUIDE.md`.

## Identidade do projeto

Duo Loot é uma plataforma gamer focada em conectar jogadores, formar duos melhores e organizar matchmaking social com mais confiança.

O projeto deve ajudar jogadores a encontrar parceiros compatíveis com base em critérios reais de jogo, como:

- jogo principal;
- rank ou nível competitivo;
- função/role;
- estilo de jogo;
- objetivo da sessão;
- disponibilidade;
- comunicação;
- região;
- comportamento;
- confiança do perfil.

## Objetivo principal

O objetivo do Duo Loot é reduzir o atrito para encontrar bons parceiros de jogo.

Toda feature deve ajudar em pelo menos um destes pontos:

1. conectar jogadores compatíveis;
2. melhorar a qualidade dos lobbies;
3. aumentar confiança entre jogadores;
4. reduzir abandono, bagunça ou toxicidade;
5. incentivar participação saudável;
6. recompensar ações úteis dentro da plataforma.

## Pilares do produto

### 1. Matchmaking útil

O matchmaking deve priorizar compatibilidade real, não apenas aparência visual.

Critérios importantes:

- jogo;
- rank;
- função;
- estilo;
- comunicação;
- disponibilidade;
- intenção da sessão;
- histórico e confiança.

### 2. Lobbies organizados

Lobbies devem ser claros, fáceis de entender e seguros.

Cada lobby deve deixar evidente:

- jogo;
- modo;
- objetivo;
- vagas;
- requisitos;
- dono;
- status;
- informações relevantes para entrar ou recusar.

### 3. Perfil gamer confiável

Perfis devem ajudar outros jogadores a decidir se querem jogar com aquela pessoa.

Um perfil bom deve mostrar dados úteis, mas sem expor informação privada desnecessária.

### 4. Riot/VALORANT como validação, não dependência cega

Integração Riot/VALORANT deve melhorar confiança e contexto, mas não pode quebrar toda a experiência se a API externa estiver indisponível.

Quando integração externa falhar, a plataforma deve responder com erro controlado e experiência clara.

### 5. Vault/Cofre como engajamento saudável

O Vault/Cofre deve incentivar missões, recompensas e participação real.

Ele não deve permitir fraude simples, manipulação de pontos ou validação apenas visual pelo frontend.

### 6. Premium sem pay-to-win injusto

Premium deve melhorar experiência, organização, conveniência, destaque ou personalização.

Premium não deve destruir a confiança da plataforma nem permitir vantagem injusta que prejudique usuários gratuitos.

### 7. Segurança como parte do produto

Segurança não é etapa final. É uma regra de produto.

Qualquer recurso que envolva conta, pontos, recompensas, Premium, mensagens, convites, Riot, Vault ou dados de usuário deve nascer com validação real.

## O que o Duo Loot não deve virar

Duo Loot não deve virar:

- apenas uma landing page bonita;
- um painel cheio de mocks fingindo produção;
- um sistema onde botão escondido é tratado como segurança;
- uma plataforma pay-to-win;
- um amontoado de features sem ligação com matchmaking;
- um projeto difícil de testar;
- um app que depende de sorte para não vazar dados.

## Regras de decisão

Antes de criar uma feature, responda:

1. Isso melhora matchmaking, confiança, lobby, retenção ou recompensa saudável?
2. Isso precisa de validação no backend, banco, RPC ou Edge Function?
3. Isso pode ser explorado para fraude, abuso ou vazamento?
4. Isso depende de dados mockados?
5. Isso precisa entrar em alguma trilha de trabalho?
6. Isso cria pendência para `docs/REMOTE_TODO.md`?

## Linguagem e experiência

A experiência deve ser gamer, competitiva, clara e direta.

Evite telas confusas, promessas falsas e botões que parecem funcionar mas não têm ação real.

Se algo ainda não está pronto:

- esconda;
- desative com mensagem clara;
- ou marque como em breve.

Nunca faça mock parecer dado real em produção.