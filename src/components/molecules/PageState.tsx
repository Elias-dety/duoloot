import React from 'react';
import { SkeletonBlock, Button } from '@/components/atoms';
import { AlertCircle, FileSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface PageStateProps {
  type: 'loading' | 'error' | 'empty';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  // Options specific to loading
  loadingBlocks?: number;
}

export const PageState: React.FC<PageStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
  loadingBlocks = 3,
}) => {
  const navigate = useNavigate();

  if (type === 'loading') {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-6">
        {Array.from({ length: loadingBlocks }).map((_, i) => (
          <SkeletonBlock key={i} height={120} rounded="lg" />
        ))}
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-danger" />
        </div>
        <h2 className="text-2xl font-bold text-content-base mb-2">
          {title || 'Ocorreu um Erro'}
        </h2>
        <p className="text-content-muted mb-6 max-w-md">
          {description || 'Não foi possível carregar os dados no momento. Tente novamente mais tarde.'}
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onAction || (() => window.location.reload())}>
            {actionText || 'Tentar novamente'}
          </Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>Voltar</Button>
        </div>
      </div>
    );
  }

  // type === 'empty'
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-surface-base border border-surface-highlight flex items-center justify-center mb-4">
        <FileSearch className="w-8 h-8 text-content-muted" />
      </div>
      <h2 className="text-2xl font-bold text-content-base mb-2">
        {title || 'Nenhum resultado'}
      </h2>
      <p className="text-content-muted mb-6 max-w-md">
        {description || 'Não encontramos nenhum dado para exibir aqui no momento.'}
      </p>
      {onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionText || 'Voltar'}
        </Button>
      )}
    </div>
  );
};
