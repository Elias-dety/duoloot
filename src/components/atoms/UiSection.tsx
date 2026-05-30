import React from 'react';
import { UiMarker, type UiMarkerTone } from './UiMarker';

export interface UiSectionProps extends React.HTMLAttributes<HTMLElement> {
  marker: {
    id: string;
    label: string;
    tone?: UiMarkerTone;
  };
  as?: 'section' | 'div' | 'article' | 'aside' | 'header' | 'footer';
  markerClassName?: string;
  contentClassName?: string;
  hideMarkerInProduction?: boolean;
}

export function UiSection({
  marker,
  as = 'section',
  markerClassName = '',
  contentClassName = '',
  hideMarkerInProduction = false,
  className = '',
  children,
  ...props
}: UiSectionProps) {
  const Component = as;

  return (
    <Component
      className={className}
      data-ui-id={marker.id}
      data-ui-label={marker.label}
      {...props}
    >
      <UiMarker
        id={marker.id}
        label={marker.label}
        tone={marker.tone}
        className={markerClassName}
        hideInProduction={hideMarkerInProduction}
      />

      <div className={contentClassName}>
        {children}
      </div>
    </Component>
  );
}
