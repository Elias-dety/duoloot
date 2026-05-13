import React, { useState } from 'react';

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
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const baseStyles = 'relative flex shrink-0 overflow-hidden rounded-full bg-surface-highlight items-center justify-center border border-surface-highlight/50';
  const classes = [baseStyles, sizes[size], className].filter(Boolean).join(' ');

  const showFallback = !src || imgError;

  return (
    <div className={classes}>
      {showFallback ? (
        <span className="font-medium text-zinc-400 uppercase select-none">
          {fallback.substring(0, 2)}
        </span>
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
