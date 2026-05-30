-- Seed reward catalog with internal cosmetic and early access rewards.
-- PIX and real money rewards are explicitly NOT included.

insert into public.reward_catalog (
  title,
  description,
  cost,
  reward_type,
  status,
  stock_total,
  stock_available,
  metadata
)
values
(
  'Badge Fundador',
  'Badge visual para perfil beta.',
  500,
  'internal_badge',
  'active',
  null,
  null,
  '{"badge_key":"founder_beta","category":"profile_cosmetic"}'
),
(
  'Tema Neon Perfil',
  'Tema visual especial para o perfil do jogador.',
  1000,
  'internal_badge',
  'active',
  null,
  null,
  '{"theme_key":"neon_profile","category":"profile_theme"}'
),
(
  'Destaque no Ranking',
  'Destaque visual temporário no ranking do Cofre.',
  750,
  'coupon',
  'active',
  50,
  50,
  '{"duration_days":7,"category":"visibility"}'
),
(
  'Entrada Beta Premium',
  'Acesso antecipado a uma feature premium em teste.',
  1500,
  'coupon',
  'active',
  25,
  25,
  '{"beta_access":true,"category":"early_access"}'
)
on conflict do nothing;
