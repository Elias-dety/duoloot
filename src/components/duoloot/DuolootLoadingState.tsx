import React from 'react';

interface DuolootLoadingStateProps {
  message?: string;
  className?: string;
}

export const DuolootLoadingState: React.FC<DuolootLoadingStateProps> = ({ 
  message = 'Carregando dados...', 
  className = '' 
}) => {
  return (
    <div className={`flex min-h-[300px] w-full flex-col items-center justify-center space-y-6 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute h-16 w-16 animate-[spin_3s_linear_infinite] rounded-full border border-dashed border-[var(--dl-border-red)] opacity-50" />
        {/* Inner fast spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--dl-red)] border-t-transparent" />
      </div>
      <p className="font-['Rajdhani'] text-sm font-bold uppercase tracking-[0.15em] text-[var(--dl-muted-light)] animate-pulse">
        {message}
      </p>
    </div>
  );
};
