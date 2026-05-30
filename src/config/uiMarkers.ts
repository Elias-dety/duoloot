export type UiMarkerConfig = {
  id: string;
  label: string;
  page: string;
  description?: string;
};

export const UI_MARKERS = {
  home: {
    hero: {
      id: 'home.hero.101',
      label: 'Hero da Home',
      page: 'Home',
      description: 'Seção principal da página inicial.',
    },
    features: {
      id: 'home.features.102',
      label: 'Recursos principais',
      page: 'Home',
      description: 'Bloco que apresenta os principais recursos do Duo Loot.',
    },
    howItWorks: {
      id: 'home.how_it_works.103',
      label: 'Como funciona',
      page: 'Home',
      description: 'Explicação do fluxo principal do produto.',
    },
    cta: {
      id: 'home.cta.104',
      label: 'Chamada principal',
      page: 'Home',
      description: 'Área de conversão principal da Home.',
    },
  },

  vault: {
    hero: {
      id: 'vault.hero.201',
      label: 'Hero do Cofre',
      page: 'Cofre',
      description: 'Topo da página do Cofre com título, descrição e CTA.',
    },
    eventStatus: {
      id: 'vault.event_status.202',
      label: 'Status do evento',
      page: 'Cofre',
      description: 'Painel com informações gerais do evento ativo.',
    },
    progress: {
      id: 'vault.progress.203',
      label: 'Seu progresso',
      page: 'Cofre',
      description: 'Bloco que mostra progresso do usuário no evento.',
    },
    missions: {
      id: 'vault.missions.204',
      label: 'Missões ativas',
      page: 'Cofre',
      description: 'Lista/cards de missões disponíveis no Cofre.',
    },
    leaderboard: {
      id: 'vault.leaderboard.205',
      label: 'Ranking do Cofre',
      page: 'Cofre',
      description: 'Ranking de participantes do evento.',
    },
    rewards: {
      id: 'vault.rewards.206',
      label: 'Recompensas do Cofre',
      page: 'Cofre',
      description: 'Área que explica recompensas ligadas ao evento.',
    },
    winners: {
      id: 'vault.winners.207',
      label: 'Vencedores',
      page: 'Cofre',
      description: 'Painel com vencedores recentes ou finais.',
    },
    seasonHistory: {
      id: 'vault.season_history.208',
      label: 'Histórico de temporadas',
      page: 'Cofre',
      description: 'Lista de eventos anteriores do Cofre.',
    },
    howItWorks: {
      id: 'vault.how_it_works.209',
      label: 'Como funciona o Cofre',
      page: 'Cofre',
      description: 'Explicação curta sobre missões, pontos e recompensas.',
    },
    walletBridge: {
      id: 'vault.wallet_bridge.210',
      label: 'DuoCoins do Cofre',
      page: 'Cofre',
      description: 'Bloco que explica a ligação entre Cofre, DuoCoins e Carteira.',
    },
  },

  wallet: {
    hero: {
      id: 'wallet.hero.301',
      label: 'Hero da Carteira',
      page: 'Carteira',
      description: 'Topo da página da Carteira Duo Loot.',
    },
    balanceSummary: {
      id: 'wallet.balance_summary.302',
      label: 'Resumo de saldo',
      page: 'Carteira',
      description: 'Cards de saldo disponível, bloqueado, ganho e resgatado.',
    },
    availableBalance: {
      id: 'wallet.available_balance.303',
      label: 'Saldo disponível',
      page: 'Carteira',
      description: 'Card ou bloco que mostra DuoCoins disponíveis.',
    },
    lockedBalance: {
      id: 'wallet.locked_balance.304',
      label: 'Saldo bloqueado',
      page: 'Carteira',
      description: 'Card ou bloco que mostra DuoCoins reservadas em resgates.',
    },
    rewardCatalog: {
      id: 'wallet.reward_catalog.305',
      label: 'Catálogo de recompensas',
      page: 'Carteira',
      description: 'Lista de recompensas disponíveis para resgate.',
    },
    redemptionHistory: {
      id: 'wallet.redemption_history.306',
      label: 'Histórico de resgates',
      page: 'Carteira',
      description: 'Lista de resgates solicitados, aprovados, entregues ou rejeitados.',
    },
    ledger: {
      id: 'wallet.ledger.307',
      label: 'Extrato da Carteira',
      page: 'Carteira',
      description: 'Extrato imutável de entradas e saídas de DuoCoins.',
    },
    explainer: {
      id: 'wallet.explainer.308',
      label: 'Como funcionam as DuoCoins',
      page: 'Carteira',
      description: 'Painel explicativo sobre DuoCoins, saldo interno e MVP.',
    },
    emptyState: {
      id: 'wallet.empty_state.309',
      label: 'Carteira vazia',
      page: 'Carteira',
      description: 'Estado visual quando o usuário ainda não possui DuoCoins.',
    },
  },

  adminWallet: {
    hero: {
      id: 'admin_wallet.hero.401',
      label: 'Hero Admin Carteira',
      page: 'Admin Carteira',
      description: 'Topo da área administrativa da Carteira.',
    },
    operationalSummary: {
      id: 'admin_wallet.operational_summary.402',
      label: 'Resumo operacional',
      page: 'Admin Carteira',
      description: 'Cards com pendentes, pagos, rejeitados e saldo bloqueado.',
    },
    pendingRedemptions: {
      id: 'admin_wallet.pending_redemptions.403',
      label: 'Fila de resgates',
      page: 'Admin Carteira',
      description: 'Lista de resgates aguardando análise.',
    },
    redemptionCard: {
      id: 'admin_wallet.redemption_card.404',
      label: 'Card de resgate',
      page: 'Admin Carteira',
      description: 'Card individual de um pedido de resgate.',
    },
    approveAction: {
      id: 'admin_wallet.approve_action.405',
      label: 'Aprovar entrega',
      page: 'Admin Carteira',
      description: 'Ação administrativa para confirmar entrega e consumir saldo bloqueado.',
    },
    rejectAction: {
      id: 'admin_wallet.reject_action.406',
      label: 'Rejeitar resgate',
      page: 'Admin Carteira',
      description: 'Ação administrativa para rejeitar pedido e devolver DuoCoins.',
    },
    adminNote: {
      id: 'admin_wallet.admin_note.407',
      label: 'Observação admin',
      page: 'Admin Carteira',
      description: 'Campo de motivo/observação usado em decisões administrativas.',
    },
    redemptionHistory: {
      id: 'admin_wallet.redemption_history.408',
      label: 'Histórico admin de resgates',
      page: 'Admin Carteira',
      description: 'Histórico geral de resgates revisados.',
    },
  },

  lobby: {
    pageHero: {
      id: 'lobby.page_hero.501',
      label: 'Hero dos Lobbies',
      page: 'Lobby',
      description: 'Topo da página de lobbies.',
    },
    filters: {
      id: 'lobby.filters.502',
      label: 'Filtros de Lobby',
      page: 'Lobby',
      description: 'Área de filtros e busca de lobbies.',
    },
    grid: {
      id: 'lobby.grid.503',
      label: 'Grid de Lobbies',
      page: 'Lobby',
      description: 'Grid onde os cards de lobby são renderizados.',
    },
    card: {
      id: 'lobby.card.504',
      label: 'Card de Lobby',
      page: 'Lobby',
      description: 'Card individual de lobby.',
    },
    cardPlayerInfo: {
      id: 'lobby.card_player_info.505',
      label: 'Informações do jogador',
      page: 'Lobby',
      description: 'Área do card com elo, nickname, função e agente.',
    },
    cardSlots: {
      id: 'lobby.card_slots.506',
      label: 'Vagas do Lobby',
      page: 'Lobby',
      description: 'Área do card com ocupação e vagas abertas.',
    },
    cardMatchmaking: {
      id: 'lobby.card_matchmaking.507',
      label: 'Matchmaking do Lobby',
      page: 'Lobby',
      description: 'Área do card com compatibilidade do lobby.',
    },
    cardActions: {
      id: 'lobby.card_actions.508',
      label: 'Ações do Lobby',
      page: 'Lobby',
      description: 'Botões Ver mais, Entrar, Sair ou Solicitar.',
    },
    detailsModal: {
      id: 'lobby.details_modal.509',
      label: 'Modal de detalhes do Lobby',
      page: 'Lobby',
      description: 'Modal com informações completas do lobby.',
    },
  },

  profile: {
    hero: {
      id: 'profile.hero.601',
      label: 'Hero do Perfil',
      page: 'Perfil',
      description: 'Topo do perfil do jogador.',
    },
    rankCard: {
      id: 'profile.rank_card.602',
      label: 'Card de Elo',
      page: 'Perfil',
      description: 'Card com elo/rank do jogador.',
    },
    gameProfile: {
      id: 'profile.game_profile.603',
      label: 'Perfil gamer',
      page: 'Perfil',
      description: 'Informações de jogo, função, agente e preferências.',
    },
    karma: {
      id: 'profile.karma.604',
      label: 'Karma do jogador',
      page: 'Perfil',
      description: 'Resumo de reputação e avaliações.',
    },
    history: {
      id: 'profile.history.605',
      label: 'Histórico do jogador',
      page: 'Perfil',
      description: 'Atividades recentes, partidas ou interações.',
    },
  },
} as const;

export type UiMarkerGroup = keyof typeof UI_MARKERS;

export function getUiMarkerShortId(id: string): string {
  return id.split('.').at(-1) ?? id;
}

export function getUiMarkerDisplay(marker: Pick<UiMarkerConfig, 'id' | 'label'>): string {
  return `↳ ${marker.label} #${getUiMarkerShortId(marker.id)}`;
}
