# 📂 Guia de Organização e Uso dos Assets - Duo Loot

Todos os assets de imagem e ícones da pasta de downloads foram organizados com sucesso dentro do projeto **Duo Loot** em [d:/meusProjeto/duoloot](file:///d:/meusProjeto/duoloot). Para garantir a melhor performance, facilidade de uso e tipagem estática completa, criamos estruturas modulares e arquivos de índice (`index.ts`) para cada categoria.

---

## 🏗️ Nova Estrutura de Diretórios no Site

Os arquivos foram copiados e divididos sistematicamente nas seguintes pastas dentro do projeto:

```
d:/meusProjeto/duoloot/src/assets/
├── 📂 icons/
│   ├── 📂 red-vault/         # Ícones táticos vermelhos existentes do cofre
│   └── 📂 library/           # Nova biblioteca completa com 40 ícones SVG do site
│       ├── calendar.svg, clock.svg, home.svg, etc.
│       └── index.ts          # Exporte unificado e tipado de todos os SVGs
└── 📂 images/
    ├── logotipo-duoloot.png  # Logo oficial em alta resolução
    ├── moudura-orizontal-1.svg # Moldura horizontal decorativa
    ├── index.ts              # Exporte master unificado dos assets visuais
    ├── 📂 elos/              # Pasta com os 25 elos oficiais do Valorant (PNG)
    │   ├── ferro-1.png ... radiante.png
    │   └── index.ts          # Mapeamento estático e tipado para os elos
    ├── 📂 vault/             # Imagens de renderização do Cofre (PNG, WebP e Thumbnails)
    ├── 📂 rewards/           # Imagens dos prêmios (Duocoins e Loot Boxes)
    ├── 📂 lobby/             # Ícone de busca de lobby em alta resolução (PNG e WebP)
    └── 📂 matchmaking/       # Ícone de matchmaking em alta resolução (PNG e WebP)
```

---

## 🛠️ Arquivos de Mapeamento Criados

Criamos três arquivos de exportação principais para facilitar a importação no código React:

1. **Biblioteca de Ícones**: [library/index.ts](file:///d:/meusProjeto/duoloot/src/assets/icons/library/index.ts)
   * Mapeia e exporta todos os 40 novos ícones SVG como módulos React reutilizáveis com autocomplete inteligente.
2. **Elos do Valorant**: [elos/index.ts](file:///d:/meusProjeto/duoloot/src/assets/images/elos/index.ts)
   * Importa de forma estática os 25 elos oficiais e expõe o tipo `ValorantElo` para validação em tempo de compilação.
3. **Master Assets Index**: [images/index.ts](file:///d:/meusProjeto/duoloot/src/assets/images/index.ts)
   * Centraliza logotipo, moldura horizontal, assets do cofre, prêmios, lobby e matchmaking em um único objeto de fácil acesso (`duolootAssets`), com suporte a formatos modernos (.webp) e thumbnails leves (.webp) para maior velocidade de carregamento.

---

## 💻 Como usar no código React (Exemplos Práticos)

Abaixo estão exemplos práticos de como integrar esses novos assets no seu site:

### 1. Exibindo Elos do Valorant Dinamicamente
Para exibir o elo do usuário de acordo com o retorno da API, você pode usar o mapa de elos estáticos:

```tsx
import React from 'react';
import { eloImages, ValorantElo } from '@/assets/images/elos';

interface PlayerRankProps {
  eloName: string; // Ex: "diamante-3", "radiante", "ouro-1"
  playerName: string;
}

export const PlayerRank: React.FC<PlayerRankProps> = ({ eloName, playerName }) => {
  // Busca a imagem correspondente de forma segura com fallback
  const eloKey = eloName.toLowerCase() as ValorantElo;
  const eloImg = eloImages[eloKey] || eloImages['ferro-1'];

  return (
    <div className="flex items-center gap-3 bg-[var(--dl-tactical-metal)] p-3 border border-[var(--dl-tactical-line)] rounded">
      <img src={eloImg} alt={`Elo ${eloName}`} className="h-12 w-12 object-contain" />
      <div>
        <h4 className="text-white font-bold">{playerName}</h4>
        <p className="text-xs text-[var(--dl-tactical-muted)] capitalize">{eloName.replace('-', ' ')}</p>
      </div>
    </div>
  );
};
```

---

### 2. Usando os Novos Ícones da Biblioteca SVG
Você pode usar os SVGs importados diretamente como fontes de imagem (`src`) ou integrá-los de forma dinâmica:

```tsx
import React from 'react';
import { duolootIcons, DuolootIconName } from '@/assets/icons/library';

interface IconProps {
  name: DuolootIconName;
  size?: number;
  className?: string;
}

export const DuolootIcon: React.FC<IconProps> = ({ name, size = 20, className = '' }) => {
  const iconSrc = duolootIcons[name];

  if (!iconSrc) return null;

  return (
    <img 
      src={iconSrc} 
      alt={`${name} icon`} 
      style={{ width: size, height: size }} 
      className={`inline-block select-none pointer-events-none ${className}`}
    />
  );
};
```

---

### 3. Exibindo Imagens de Alta Performance do Cofre e Recompensas
Para carregar imagens grandes (como o cofre fechado ou o baú de recompensas) sem prejudicar o desempenho, o objeto `duolootAssets` disponibiliza formatos modernos `.webp` e as versões minificadas `.thumb.webp` ideais para carregamento progressivo (blur-up) ou visualizações em miniatura:

```tsx
import React from 'react';
import { duolootAssets } from '@/assets/images';

export const VaultBanner: React.FC = () => {
  const vault = duolootAssets.vault.closed;

  return (
    <div className="dl-panel relative overflow-hidden p-6 rounded-lg border border-[var(--dl-tactical-line)]">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <picture className="w-48 h-48 flex-shrink-0">
          <source srcSet={vault.webp} type="image/webp" />
          <img 
            src={vault.png} 
            alt="Duo Loot Cofre Fechado" 
            className="w-full h-full object-contain animate-pulse"
          />
        </picture>

        <div>
          <h2 className="font-['Rajdhani'] text-3xl font-bold uppercase text-white">
            O Cofre Tático está Trancado
          </h2>
          <p className="mt-2 text-sm text-[var(--dl-tactical-muted)]">
            Complete missões táticas nos seus lobbies favoritos de Valorant, consiga chaves e destranque recompensas exclusivas.
          </p>
        </div>
      </div>
    </div>
  );
};
```

---

### 4. Utilizando o Logotipo e a Moldura Decorativa
Para posicionar a nova logomarca e aplicar a moldura horizontal decorativa de forma elegante:

```tsx
import React from 'react';
import { duolootAssets } from '@/assets/images';

export const SiteFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[var(--dl-tactical-metal)] py-12 px-6 border-t border-[var(--dl-tactical-line)]">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        <img 
          src={duolootAssets.brand.horizontalFrame} 
          alt="Moldura Decorativa" 
          className="w-full max-w-md h-auto opacity-70"
        />

        <img 
          src={duolootAssets.brand.logoFull} 
          alt="Duo Loot Logo" 
          className="h-10 object-contain mt-4" 
        />
        
        <p className="text-xs text-[var(--dl-tactical-muted)]">
          © {new Date().getFullYear()} Duo Loot. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};
```

---

## 💎 Benefícios Desta Abordagem
* **Tipagem Estática Total**: O compilador TypeScript e o seu editor de código fornecerão sugestões de autocompletar para todos os 40 ícones da biblioteca e os 25 elos.
* **Otimização de Performance**: Disponibilização nativa de `.webp` para carregamento ultra-rápido de imagens pesadas e de thumbnails leves para componentes menores.
* **Manutenibilidade**: Se um asset mudar no futuro, basta alterar seu arquivo físico nas pastas correspondentes ou no arquivo de índice sem a necessidade de caçar referências perdidas por todo o código do projeto.
