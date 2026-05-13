import React from 'react';
import { SkeletonBlock } from '@/components/atoms';

export interface PageCardGridSkeletonProps {
  cards?: number;
  cardHeight?: number;
  className?: string;
}

export const PageCardGridSkeleton: React.FC<PageCardGridSkeletonProps> = ({
  cards = 6,
  cardHeight = 240,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`.trim()}>
      {Array.from({ length: cards }).map((_, index) => (
        <SkeletonBlock key={index} height={cardHeight} rounded="lg" />
      ))}
    </div>
  );
};
