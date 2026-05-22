import React from 'react';

interface MissingImagePlaceholderProps {
  text?: string;
  className?: string;
}

export function MissingImagePlaceholder({ text = "Imagem será adicionada depois", className = "" }: MissingImagePlaceholderProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-[1.35rem] border border-dashed border-[var(--dl-border)] bg-[var(--dl-surface-2)] p-6 text-center ${className}`}>
      <svg
        className="mb-3 h-8 w-8 text-[var(--dl-muted)]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      {text && (
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--dl-muted)]">
          {text}
        </span>
      )}
    </div>
  );
}
