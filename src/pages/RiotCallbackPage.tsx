import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { LoadingState, EmptyState } from '@/components/molecules';

export default function RiotCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setErrorMessage(`A Riot retornou um erro: ${error}`);
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMessage('Nenhum código de autorização encontrado.');
      return;
    }

    async function processCallback() {
      try {
        const { data, error: invokeError } = await supabase.functions.invoke('riot-rso-callback', {
          body: { code },
        });

        if (invokeError) {
          throw invokeError;
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setStatus('success');
        
        // Redirecionar para o dashboard após alguns segundos
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 2000);
      } catch (err: unknown) {
        console.error('RSO Callback Error:', err);
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Erro ao processar o login com a Riot.');
      }
    }

    processCallback();
  }, [searchParams, navigate]);

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <EmptyState
          icon="error"
          title="Falha na Conexão"
          description={errorMessage}
          actionLabel="Voltar ao Início"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="dl-card flex flex-col items-center p-8 max-w-md w-full border-[var(--dl-keyword)]/50 bg-[var(--dl-keyword)]/10">
          <div className="mb-4 text-[var(--dl-keyword)] text-4xl">✓</div>
          <h1 className="dl-title mb-4 text-2xl">Conta Conectada!</h1>
          <p className="dl-muted text-sm">
            Sua conta Riot foi vinculada com sucesso. Redirecionando para o dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingState message="Vinculando sua conta Riot..." />
    </div>
  );
}
