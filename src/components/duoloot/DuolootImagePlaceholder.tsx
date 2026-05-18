import React from 'react';
import { ImageOff } from 'lucide-react';

interface DuolootImagePlaceholderProps {
  label: string;
  className?: string;
}

export const DuolootImagePlaceholder: React.FC<DuolootImagePlaceholderProps> = ({ label, className = '' }) => (
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
