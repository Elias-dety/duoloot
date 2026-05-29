# Rank Theme System

Sistema central de patentes por jogo.

Ele retorna:

- imagem do elo;
- imagem fallback temporaria;
- nome normalizado;
- paleta visual;
- intensidade por divisao.

Estrutura de codigo:

```txt
src/features/ranks/
├── types.ts
├── getGameRankTheme.ts
├── index.ts
└── games/
    └── valorantRankTheme.ts
```

Estrutura oficial de assets:

```txt
public/assets/games/valorant/ranks/
```

Para adicionar outro jogo, crie uma pasta em `public/assets/games`, crie um resolver em `src/features/ranks/games` e registre o jogo em `getGameRankTheme.ts`.
