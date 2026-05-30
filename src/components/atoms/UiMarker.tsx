import React from 'react';

export type UiMarkerTone = 'default' | 'cyan' | 'red' | 'yellow' | 'green' | 'purple';

export interface UiMarkerProps {
  id: string;
  label: string;
  tone?: UiMarkerTone;
  className?: string;
  hideInProduction?: boolean;
}

const toneClasses: Record<UiMarkerTone, string> = {
  default: 'text-[var(--dl-muted-light)] border-white/[0.08] bg-white/[0.04]',
  cyan: 'text-[var(--dl-number)] border-[var(--dl-number)]/25 bg-[var(--dl-number)]/10',
  red: 'text-[var(--dl-keyword)] border-[var(--dl-keyword)]/25 bg-[var(--dl-keyword)]/10',
  yellow: 'text-[var(--dl-warning)] border-[var(--dl-warning)]/25 bg-[var(--dl-warning)]/10',
  green: 'text-[var(--dl-string)] border-[var(--dl-string)]/25 bg-[var(--dl-string)]/10',
  purple: 'text-[var(--dl-function)] border-[var(--dl-function)]/25 bg-[var(--dl-function)]/10',
};

function getShortUiId(id: string) {
  const parts = id.split('.');
  return parts[parts.length - 1] || id;
}

export function UiMarker({
  id,
  label,
  tone = 'default',
  className = '',
  hideInProduction = false,
}: UiMarkerProps) {
  const shouldHide =
    hideInProduction &&
    !import.meta.env.DEV &&
    import.meta.env.VITE_SHOW_UI_MARKERS !== 'true';

  if (shouldHide) return null;

  const shortId = getShortUiId(id);

  return (
    <div
      className={[
        'duo-ui-marker inline-flex w-fit max-w-full items-center gap-2 rounded-full border px-3 py-1 mb-2',
        'font-["Inter"] text-[0.68rem] font-medium uppercase tracking-[0.14em] backdrop-blur-sm',
        'select-text',
        toneClasses[tone],
        className,
      ].join(' ')}
      data-ui-marker={id}
      data-ui-label={label}
      title={`${label} #${shortId} · ${id}`}
    >
      <span className="shrink-0 text-current">↳</span>

      <span className="min-w-0 truncate text-current">
        {label}
      </span>

      <span className="shrink-0 font-mono text-[var(--dl-warning)]">
        #{shortId}
      </span>
    </div>
  );
}
