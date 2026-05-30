# Trail: Duo UI Markers

Este documento registra a implementação do sistema `Duo UI Markers`, criado para facilitar a identificação visual e a comunicação com a IA sobre partes da interface do projeto Duo Loot.

## Objetivo
Criar um sistema de marcação visual (`UiMarker` e `UiSection`) que injeta tags visuais flutuantes em modo de desenvolvimento (ou configuráveis), permitindo que desenvolvedores ou a IA referenciem rapidamente blocos do sistema por um `ID` único, como `#203` ou `#301`.

## Componentes Criados
- `src/components/atoms/UiMarker.tsx`: O componente flutuante que exibe a etiqueta (ex: `#203 Hero do Cofre`). Oculta-se automaticamente em produção, exceto se configurado de outra forma.
- `src/components/atoms/UiSection.tsx`: Um wrapper opcional que desenha uma borda tracejada ao redor de uma seção para destacar a área que o marcador representa.
- `src/config/uiMarkers.ts`: Dicionário central de todos os marcadores (`UI_MARKERS`), tipados e categorizados por página (Home, Vault, Wallet, AdminWallet, Lobby, Profile, Sidebar).

## Arquivos Modificados
Para adotar os marcadores de UI, os seguintes componentes/páginas receberam a injeção do componente `<UiMarker>` e atributos `data-ui-id` / `data-ui-label`:

- **Cofre:** `src/templates/VaultTemplate/index.tsx`
- **Carteira:** `src/pages/WalletPage.tsx`
- **Admin Carteira:** `src/pages/AdminWalletPage.tsx`
- **Lobby:** 
  - `src/components/organisms/LobbyGrid.tsx`
  - `src/features/lobby/components/LobbyCard.tsx`
  - `src/features/lobby/components/LobbyFilters.tsx`
- **Layout/Sidebar:** `src/layouts/DashboardLayout.tsx`

## Padrão de Nomenclatura
Os IDs numéricos seguem faixas por área:
- **00x**: Globais / Layout (ex: `#001` Menu lateral)
- **10x**: Home (ex: `#101` Hero Home)
- **20x**: Cofre/Vault (ex: `#203` Seu progresso)
- **30x**: Carteira (ex: `#303` Catálogo de recompensas)
- **40x**: Admin Carteira (ex: `#403` Fila de resgates)
- **50x**: Lobbies (ex: `#501` Grid de lobbies)
- **60x**: Perfil (ex: `#601` Hero Perfil)

## Como utilizar

Para injetar em uma nova seção, importe o dicionário e o componente:

```tsx
import { UiMarker } from '@/components/atoms';
import { UI_MARKERS } from '@/config/uiMarkers';

// Na renderização
<section data-ui-id={UI_MARKERS.minhaSecao.id} data-ui-label={UI_MARKERS.minhaSecao.label}>
  <UiMarker {...UI_MARKERS.minhaSecao} />
  {/* Conteúdo */}
</section>
```

Em produção (`import.meta.env.MODE === 'production'`), os marcadores ficam ocultos por padrão. É possível forçar a ocultação em dev passando `hideInProduction={true}` ou outras props de controle direto.
