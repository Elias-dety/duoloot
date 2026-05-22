import React from 'react';
import { DuolootCard } from './DuolootCard';
import { DuolootButton } from './DuolootButton';
import { AlertCircle, FileX2 } from 'lucide-react';

interface DuolootEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: 'empty' | 'error';
  className?: string;
}

export const DuolootEmptyState: React.FC<DuolootEmptyStateProps> = ({
  title = 'Nenhum dado encontrado',
  description = 'Não há nada para exibir aqui no momento.',
  actionLabel,
  onAction,
  icon = 'empty',
  className = ''
}) => {
  const isError = icon === 'error';
  
  return (
    <DuolootCard 
      variant={isError ? 'danger' : 'muted'} 
      className={`flex min-h-[300px] w-full flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full border ${isError ? 'border-[rgba(143,8,8,0.5)] bg-[rgba(143,8,8,0.2)]' : 'border-[var(--dl-border)] bg-[var(--dl-surface)]'}`}>
        {isError ? (
          <AlertCircle className="h-8 w-8 text-[var(--dl-red)]" />
        ) : (
          <FileX2 className="h-8 w-8 text-[var(--dl-muted)]" />
        )}
      </div>
      
      <h3 className={`mb-2 font-['Rajdhani'] text-xl font-bold uppercase tracking-wider ${isError ? 'text-white' : 'text-white'}`}>
        {title}
      </h3>
      
      <p className="mb-6 max-w-md text-sm text-[var(--dl-muted-light)]">
        {description}
      </p>

      {actionLabel && onAction && (
        <DuolootButton 
          variant={isError ? 'secondary' : 'primary'} 
          onClick={onAction}
        >
          {actionLabel}
        </DuolootButton>
      )}
    </DuolootCard>
  );
};
