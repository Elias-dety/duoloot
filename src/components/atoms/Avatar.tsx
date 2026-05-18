import React, { useState } from 'react';

import { ASSETS } from '@/constants/assets';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
  };

  const baseStyles =
    'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-primary/25 bg-surface-elevated shadow-sm';
  const classes = [baseStyles, sizes[size], className].filter(Boolean).join(' ');
  const showFallback = !src || imgError;

  return (
    <div className={classes} title={showFallback ? '[Imagem pendente: avatar do jogador]' : undefined}>
      {showFallback ? (
        <div className="relative flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.22),rgba(255,255,255,0.04)_48%,rgba(8,10,14,0.95))]">
          <img
            src={ASSETS.avatars.generic}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-contain p-[18%] opacity-35"
          />
          <span className="relative select-none font-black uppercase text-brand-primary">
            {fallback.substring(0, 2)}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setImgError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      )}
    </div>
  );
};
