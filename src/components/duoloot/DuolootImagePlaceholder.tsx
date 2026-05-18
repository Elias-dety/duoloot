import React from 'react';
import { ImageOff } from 'lucide-react';

interface DuolootImagePlaceholderProps {
  label: string;
  className?: string;
  src?: string;
  alt?: string;
  imageClassName?: string;
  loading?: 'eager' | 'lazy';
}

export const DuolootImagePlaceholder: React.FC<DuolootImagePlaceholderProps> = ({
  label,
  className = '',
  src,
  alt,
  imageClassName = '',
  loading = 'lazy',
}) => {
  if (src) {
    return (
      <div
        className={[
          'relative overflow-hidden rounded-[1.5rem] border border-[var(--dl-border-red)]',
          'bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.18),rgba(255,255,255,0.03)_50%,rgba(8,10,14,0.96))]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,0,0,0.1),transparent_45%,rgba(0,0,0,0.38))]" aria-hidden="true" />
        <img
          src={src}
          alt={alt ?? label}
          loading={loading}
          decoding="async"
          className={['relative h-full w-full object-contain p-8', imageClassName].filter(Boolean).join(' ')}
        />
      </div>
    );
  }

  return (
    <div
      className={[
        'flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-dashed border-[var(--dl-border-red)]',
        'bg-[linear-gradient(180deg,rgba(255,0,0,0.12),rgba(255,255,255,0.02))] px-6 text-center',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="img"
      aria-label={label}
    >
      <div className="rounded-full border border-[var(--dl-border)] bg-black/30 p-4">
        <ImageOff className="h-10 w-10 text-[var(--dl-muted-light)]" aria-hidden="true" />
      </div>
      <div>
        <p className="font-['Rajdhani'] text-xl font-bold uppercase text-[var(--dl-text)]">Image Placeholder</p>
        <p className="mt-1 text-sm text-[var(--dl-muted-light)]">{label}</p>
      </div>
    </div>
  );
};
