import type { CSSProperties } from 'react';
import { getGameRankTheme, type SupportedGameId } from '@/features/ranks';

interface GameRankBadgeProps {
  game?: SupportedGameId;
  rank?: string | null;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'pill' | 'card';
  className?: string;
}

const iconSizeBySize = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

const textSizeBySize = {
  sm: 'text-[11px]',
  md: 'text-xs',
  lg: 'text-sm',
};

export function GameRankBadge({
  game = 'valorant',
  rank,
  showLabel = true,
  size = 'md',
  variant = 'pill',
  className = '',
}: GameRankBadgeProps) {
  const theme = getGameRankTheme({ game, rank });

  const badgeStyle = {
    '--rank-primary': theme.colors.primary,
    '--rank-secondary': theme.colors.secondary,
    '--rank-accent': theme.colors.accent,
    '--rank-border': theme.colors.border,
    '--rank-bg': theme.colors.background,
    '--rank-glow': theme.colors.glow,
    '--rank-text': theme.colors.text,
  } as CSSProperties;

  const variantClasses = {
    inline: 'gap-2',
    pill: 'gap-2 rounded-full border px-3 py-1.5 shadow-[0_0_18px_var(--rank-glow)]',
    card: 'gap-3 rounded-2xl border p-3 shadow-[0_0_24px_var(--rank-glow)]',
  };

  return (
    <span
      className={`inline-flex items-center ${variantClasses[variant]} ${className}`}
      style={{
        ...badgeStyle,
        borderColor: 'var(--rank-border)',
        background:
          variant === 'inline'
            ? 'transparent'
            : 'linear-gradient(135deg, var(--rank-bg), rgba(255,255,255,0.03))',
      }}
      title={theme.label}
      data-game={theme.game}
      data-rank-tier={theme.tier}
      data-rank-division={theme.division ?? undefined}
    >
      {theme.icon && (
        <img
          src={theme.icon}
          alt={`Elo ${theme.label}`}
          className={`${iconSizeBySize[size]} object-contain drop-shadow-[0_0_12px_var(--rank-glow)]`}
          loading="lazy"
        />
      )}
      {showLabel && (
        <span
          className={`${textSizeBySize[size]} font-bold uppercase tracking-wider`}
          style={{ color: 'var(--rank-text)' }}
        >
          {theme.label}
        </span>
      )}
    </span>
  );
}
