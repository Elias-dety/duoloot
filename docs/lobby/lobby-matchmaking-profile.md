# Lobby com Matchmaking Baseado no Perfil Gamer (game_profile)

Este documento especifica a arquitetura técnica, as regras de negócio e a implementação do Matchmaking dinâmico baseado no perfil tático (`game_profile`) no projeto **Duo Loot**.

---

## 1. Visão Geral

Com a implementação do onboarding tático, todo operador de elite agora possui especificações táticas detalhadas persistidas em `public.profiles.game_profile` (JSONB). O lobby radar aproveita esses metadados para:
1. **Calcular Score de Compatibilidade em Tempo Real**: Medir a afinidade entre o operador ativo e o líder de cada squad disponível.
2. **Filtragem Inteligente**: Permitir buscas precisas por jogo principal, patente, região geográfica e requisito de comunicação (microfone).
3. **Garantia de Integridade (Security Gates)**: Impedir que operadores sem perfil configurado entrem em operações ou criem novos lobbies, assegurando um ambiente competitivo de alta fidelidade.

---

## 2. O Algoritmo de Compatibilidade Tática

O score de compatibilidade é calculado dinamicamente no cliente (`src/services/lobbies.service.ts`) para cada lobby carregado, avaliando 6 critérios de sinergia com pesos específicos. O valor final é estritamente limitado entre **0%** e **100%**.

### Os 6 Critérios de Sinergia:

| Critério | Peso | Regra de Pontuação |
| :--- | :---: | :--- |
| **Jogo Principal (`mainGame`)** | `+25` | Concedido se ambos jogarem o mesmo jogo principal. |
| **Equilíbrio de Patente (`Rank`)** | Até `+20` | `+20` se possuírem exatamente o mesmo rank tático.<br>`+15` se forem ranks adjacentes na escala linear (ex: Ouro e Platina). |
| **Funções de Jogo (`Roles`)** | Até `+20` | `+20` se as funções principais forem perfeitamente complementares.<br>`+15` se houver flexibilidade de função secundária complementar. |
| **Disponibilidade (`Availability`)** | `+15` | Concedido se houver sobreposição nos horários preferidos de jogo. |
| **Modo de Jogo (`PreferredModes`)** | `+10` | Concedido se as filas ou modos preferidos coincidirem. |
| **Microfone (`Microphone`)** | `+10` | Concedido se a preferência de áudio do líder corresponder à do operador. |

### Escala de Compatibilidade no Visual HUD:

Com base na pontuação calculada, o card de lobby exibe uma classificação visual customizada:
- 🟢 **Match Ideal** (`>= 85%`): Excelente sinergia de squad. Borda azul neon/brilhante destacando o card.
- 🔵 **Compatível** (`65% - 84%`): Boa complementaridade.
- 🟡 **Neutro** (`40% - 64%`): Poucos pontos de sinergia identificados.
- 🔴 **Risco de Baixa Sinergia** (`< 40%`): Desalinhamento tático relevante (patente distante ou modos incompatíveis).

---

## 3. Fluxo de Operação e Travas (Security Gates)

### Criação de Lobby:
1. O operador clica em **"Criar Lobby"**.
2. O sistema verifica se o operador está autenticado.
3. Se autenticado, verifica se possui perfil gamer completo via helper `isGameProfileComplete(profile)`.
4. Se incompleto, bloqueia a operação, exibe alerta no console do HUD e redireciona o operador para o `/onboarding` após 1.5 segundos.
5. Se completo, o payload de inserção é populado automaticamente com os metadados reais de `profile.game_profile`, incluindo a coluna `metadata` (JSONB) criada via migração `017_add_lobby_metadata.sql`.

### Entrada em Lobby (Join Lobby):
1. O operador clica em **"Entrar no Lobby"**.
2. Verifica autenticação e completude de perfil (gates idênticos à criação).
3. Verifica se o lobby ainda está aberto (`status == 'open'`) e possui vagas disponíveis (`slots_filled < slots_total`).
4. Se o lobby estiver cheio ou inativo, bloqueia a operação e emite o aviso: `"Este lobby não está mais disponível."`

---

## 4. Filtragem Client-Side e Busca Inteligente

O console de filtros (`src/features/lobby/components/LobbyFilters.tsx`) opera de forma reativa no `LobbyTemplate`:
- **Parâmetros de Busca**:
  - Busca livre por operador, Riot ID ou biografia.
  - Filtro exclusivo por **Jogo Principal**.
  - Filtro por **Rank Mínimo**.
  - Filtro por **Região** (BR, NA, EU, LATAM).
  - Filtro por **Microfone** (Exigência vs Qualquer).
- **Zerar Filtros**: Um botão vermelho HUD permite limpar todas as configurações com um único clique.
- **Estado Vazio Tático**: Quando nenhum lobby atende aos critérios, o grid dá lugar ao painel de status `// CONTRATOS ENCONTRADOS: 0` com opção de reset imediato.

---

## 5. Estrutura de Metadados

Os metadados inseridos na coluna `metadata` da tabela `public.lobbies` possuem o seguinte formato tipado:

```typescript
export interface LobbyMetadata {
  mainGame?: string;
  riotId?: string;
  currentRank?: string;
  mainRole?: string;
  secondaryRole?: string;
  playStyle?: string;
  sessionFocus?: string;
  availability?: string[];
  microphone?: boolean;
  region?: string;
  bio?: string;
}
```

Isso garante retrocompatibilidade e permite consultas rápidas e flexíveis diretamente no Postgres se necessário no futuro.
