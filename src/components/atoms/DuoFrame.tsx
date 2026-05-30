import React, { HTMLAttributes } from 'react';

export type DuoFrameVariant = 'default' | 'cyan' | 'red' | 'purple' | 'soft';
export type DuoFrameThickness = 'sm' | 'md' | 'lg';
export type DuoFrameRadius = 'md' | 'lg' | 'xl';

export interface DuoFrameProps extends HTMLAttributes<HTMLDivElement> {
  variant?: DuoFrameVariant;
  thickness?: DuoFrameThickness;
  radius?: DuoFrameRadius;
  screenClassName?: string;
  contentClassName?: string;
}

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const thicknessClasses: Record<DuoFrameThickness, string> = {
  sm: 'p-2',
  md: 'p-3.5',
  lg: 'p-5',
};

const frameRadiusClasses: Record<DuoFrameRadius, string> = {
  md: 'rounded-[30px]',
  lg: 'rounded-[36px]',
  xl: 'rounded-[42px]',
};

const screenRadiusClasses: Record<DuoFrameRadius, string> = {
  md: 'rounded-[22px]',
  lg: 'rounded-[28px]',
  xl: 'rounded-[32px]',
};

const glowClasses: Record<DuoFrameVariant, string> = {
  default:
    'bg-[radial-gradient(circle_at_16%_0%,rgba(22,215,255,.18),transparent_24rem),radial-gradient(circle_at_90%_18%,rgba(255,63,102,.12),transparent_26rem),linear-gradient(135deg,rgba(255,255,255,.08),transparent_40%)] opacity-90',
  cyan:
    'bg-[radial-gradient(circle_at_16%_0%,rgba(22,215,255,.28),transparent_24rem),radial-gradient(circle_at_90%_18%,rgba(22,215,255,.10),transparent_26rem),linear-gradient(135deg,rgba(255,255,255,.08),transparent_40%)] opacity-95',
  red:
    'bg-[radial-gradient(circle_at_16%_0%,rgba(255,63,102,.18),transparent_24rem),radial-gradient(circle_at_90%_18%,rgba(255,63,102,.24),transparent_26rem),linear-gradient(135deg,rgba(255,255,255,.08),transparent_40%)] opacity-95',
  purple:
    'bg-[radial-gradient(circle_at_16%_0%,rgba(176,132,255,.22),transparent_24rem),radial-gradient(circle_at_90%_18%,rgba(22,215,255,.12),transparent_26rem),linear-gradient(135deg,rgba(255,255,255,.08),transparent_40%)] opacity-95',
  soft:
    'bg-[radial-gradient(circle_at_16%_0%,rgba(22,215,255,.12),transparent_24rem),radial-gradient(circle_at_90%_18%,rgba(255,63,102,.08),transparent_26rem),linear-gradient(135deg,rgba(255,255,255,.055),transparent_40%)] opacity-50',
};

const frameShadowClasses: Record<DuoFrameVariant, string> = {
  default: 'shadow-[0_34px_90px_rgba(0,0,0,.48),0_0_44px_rgba(22,215,255,.10)]',
  cyan: 'shadow-[0_34px_90px_rgba(0,0,0,.48),0_0_52px_rgba(22,215,255,.16)]',
  red: 'shadow-[0_34px_90px_rgba(0,0,0,.48),0_0_52px_rgba(255,63,102,.14)]',
  purple: 'shadow-[0_34px_90px_rgba(0,0,0,.48),0_0_52px_rgba(176,132,255,.14)]',
  soft: 'shadow-[0_22px_54px_rgba(0,0,0,.38),0_0_24px_rgba(22,215,255,.05)]',
};

/**
 * DuoFrame is the reusable Duo Loot neon frame used around premium cards.
 *
 * Use it as a visual wrapper around cards, panels, previews or modal content.
 * The child component should usually avoid a strong outer border, because this
 * frame already owns the contour, glow and glass edge.
 */
export const DuoFrame: React.FC<DuoFrameProps> = ({
  variant = 'default',
  thickness = 'md',
  radius = 'xl',
  className = '',
  screenClassName = '',
  contentClassName = '',
  children,
  ...props
}) => (
  <div
    className={joinClasses(
      'relative overflow-hidden border border-white/[0.14] bg-[linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.022)),rgba(255,255,255,.035)]',
      frameRadiusClasses[radius],
      thicknessClasses[thickness],
      frameShadowClasses[variant],
      className,
    )}
    {...props}
  >
    <div
      aria-hidden="true"
      className={joinClasses('pointer-events-none absolute inset-0', glowClasses[variant])}
    />

    <div
      className={joinClasses(
        'relative z-[1] overflow-hidden bg-[radial-gradient(circle_at_18%_8%,rgba(22,215,255,.13),transparent_26rem),radial-gradient(circle_at_86%_22%,rgba(255,63,102,.10),transparent_28rem),radial-gradient(circle_at_50%_100%,rgba(176,132,255,.07),transparent_32rem),rgba(5,9,18,.82)] p-2 shadow-[inset_0_0_50px_rgba(22,215,255,.035)]',
        screenRadiusClasses[radius],
        screenClassName,
      )}
    >
      <div className={contentClassName}>{children}</div>
    </div>
  </div>
);
