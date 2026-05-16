import React from 'react';
import { AlertCircle, FileSearch, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, SkeletonBlock } from '@/components/atoms';

export interface PageStateProps {
  type: 'loading' | 'error' | 'empty' | 'locked';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  loadingBlocks?: number;
  className?: string;
}

export const PageState: React.FC<PageStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
  loadingBlocks = 3,
  className = '',
}) => {
  const navigate = useNavigate();
  const containerClassName = `w-full max-w-5xl mx-auto px-4 ${className}`.trim();

  if (type === 'loading') {
    return (
      <div className={`${containerClassName} py-8 space-y-6`}>
        {Array.from({ length: loadingBlocks }).map((_, i) => (
          <SkeletonBlock key={i} height={120} rounded="xl" />
        ))}
      </div>
    );
  }

  const stateConfig = {
    error: {
      icon: AlertCircle,
      card: 'danger' as const,
      iconClass: 'text-danger',
      defaultTitle: 'Ocorreu um erro',
      defaultDescription: 'Não foi possível carregar os dados no momento. Tente novamente mais tarde.',
      defaultAction: 'Tentar novamente',
    },
    locked: {
      icon: Lock,
      card: 'locked' as const,
      iconClass: 'text-premium',
      defaultTitle: 'Conteudo bloqueado',
      defaultDescription: 'Este recurso exige acesso premium para ser desbloqueado.',
      defaultAction: 'Ver planos',
    },
    empty: {
      icon: FileSearch,
      card: 'elevated' as const,
      iconClass: 'text-content-muted',
      defaultTitle: 'Nenhum resultado',
      defaultDescription: 'Não encontramos nenhum dado para exibir aqui no momento.',
      defaultAction: 'Voltar',
    },
  }[type];

  const Icon = stateConfig.icon;

  return (
    <div className={`${containerClassName} py-16`}>
      <Card variant={stateConfig.card} className="flex flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-elevated">
          <Icon className={`h-8 w-8 ${stateConfig.iconClass}`} />
        </div>
        <h2 className="mb-2 text-2xl font-black text-content-base">{title || stateConfig.defaultTitle}</h2>
        <p className="mb-6 max-w-md text-content-secondary">{description || stateConfig.defaultDescription}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {(onAction || type === 'error') && (
            <Button variant={type === 'locked' ? 'premium' : 'secondary'} onClick={onAction || (() => window.location.reload())}>
              {actionText || stateConfig.defaultAction}
            </Button>
          )}
          {type === 'error' && <Button variant="ghost" onClick={() => navigate(-1)}>Voltar</Button>}
        </div>
      </Card>
    </div>
  );
};
