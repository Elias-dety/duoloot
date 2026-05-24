import React from 'react';
import { AlertCircle, FileX2 } from 'lucide-react';
import { Card, Button } from '@/components/atoms';;

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: 'empty' | 'error';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum dado encontrado',
  description = 'Não há nada para exibir aqui no momento.',
  actionLabel,
  onAction,
  icon = 'empty',
  className = ''
}) => {
  const isError = icon === 'error';
  
  return (
    <Card 
      variant={isError ? 'danger' : 'muted'} 
      className={`flex min-h-[300px] w-full flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full border ${isError ? 'border-[rgb(var(--dl-error-rgb)/0.5)] bg-[rgb(var(--dl-error-rgb)/0.2)]' : 'border-[var(--dl-border)] bg-[var(--dl-surface)]'}`}>
        {isError ? (
          <AlertCircle className="h-8 w-8 text-[var(--dl-keyword)]" />
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
        <Button 
          variant={isError ? 'secondary' : 'primary'} 
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};
