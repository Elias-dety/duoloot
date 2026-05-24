import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/molecules';

export default function RiotCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, this is where we'd exchange the code for a token.
    // For now, we mock the success and return to dashboard.
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <EmptyState
        icon="empty"
        title="Integração Riot em preparação"
        description="Esta página lidará com o callback seguro da Riot Games em produção. Redirecionando para o dashboard..."
        actionLabel="Pular Redirecionamento"
        onAction={() => navigate('/dashboard')}
      />
    </div>
  );
}
