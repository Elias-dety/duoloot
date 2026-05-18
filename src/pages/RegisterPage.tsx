import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm, AuthFormSubmission } from '@/features/auth/components/AuthForm';
import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '@/constants/routes';
import { isSupabaseConfigured } from '@/lib/supabase';

export const RegisterPage: React.FC = () => {
  const { signUp, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleRegister = async (data: AuthFormSubmission) => {
    setIsLoading(true);
    try {
      if (!data.name || !data.nickname) {
        return { success: false, error: 'Nome e nickname são obrigatórios.' };
      }

      const result = await signUp(data.email, data.password, {
        name: data.name,
        nickname: data.nickname,
      });

      if (result.success) {
        if (result.sessionCreated) {
          navigate(ROUTES.DASHBOARD, { replace: true });
        } else {
          setRegisteredEmail(data.email);
          setNeedsVerification(true);
        }
      }

      return result;
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Falha na conexão com o terminal.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center overflow-hidden bg-[#07090e] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 select-none bg-[radial-gradient(ellipse_at_center,var(--dl-tactical-green)_0%,transparent_70%)] opacity-[0.03]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.02]" />

      <div className="z-10 flex w-full justify-center">
        {needsVerification ? (
          <div className="relative w-full max-w-md space-y-6 overflow-hidden bg-black/60 p-8 text-center backdrop-blur-md [clip-path:polygon(0_0,100%_0,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%)]">
            <div className="absolute left-0 top-0 h-[2px] w-full bg-[var(--dl-tactical-green)]" />

            <div className="inline-block animate-pulse rounded-full border border-[var(--dl-tactical-green)]/30 bg-[var(--dl-tactical-green)]/10 p-4">
              <span className="text-3xl text-[var(--dl-tactical-green)]">📬</span>
            </div>

            <div className="space-y-2">
              <h2 className="font-[Chakra_Petch] text-xl font-bold uppercase tracking-widest text-[var(--dl-tactical-text)]">
                VERIFICAÇÃO ENVIADA
              </h2>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--dl-tactical-muted)]">
                CÓDIGO OPERACIONAL ENVIADO PARA:
              </p>
              <p className="inline-block select-all border border-[var(--dl-tactical-line)] bg-black/40 px-3 py-1.5 font-[Chakra_Petch] text-sm font-bold tracking-wide text-[var(--dl-tactical-green)]">
                {registeredEmail}
              </p>
            </div>

            <div className="space-y-3 border-t border-[var(--dl-tactical-line)] pt-4 text-xs leading-relaxed text-[var(--dl-tactical-muted)]">
              <p>Acesse sua caixa de entrada e clique no link de validação para liberar sua conta no Duo Loot.</p>
              <p className="text-[10px] font-semibold uppercase text-amber-500/80">
                * Caso não encontre, verifique sua pasta de spam ou lixo eletrônico.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="w-full bg-transparent py-2 text-xs font-bold uppercase tracking-widest text-[var(--dl-tactical-green)] transition-all [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)] hover:bg-[var(--dl-tactical-green)]/10 border border-[var(--dl-tactical-green)]"
            >
              VOLTAR PARA O LOGIN
            </button>
          </div>
        ) : (
          <AuthForm
            type="register"
            onSubmit={handleRegister}
            isLoading={isLoading || authLoading}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
