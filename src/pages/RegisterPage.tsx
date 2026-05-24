import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { AuthForm, AuthFormSubmission } from '@/features/auth/components/AuthForm';
import { useAuth } from '@/features/auth/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Button, Card } from '@/components/atoms';;

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
        error: error instanceof Error ? error.message : 'Falha ao criar sua conta.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgb(var(--dl-red-rgb)/0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />

      <div className="relative z-10 flex w-full justify-center">
        {needsVerification ? (
          <Card variant="elevated" className="w-full max-w-md space-y-6 rounded-[1.75rem] p-6 text-center md:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--dl-keyword)] bg-[rgb(var(--dl-red-rgb)/0.12)] text-2xl">
              ✉
            </div>

            <div className="space-y-2">
              <h2 className="font-['Rajdhani'] text-3xl font-bold uppercase text-white">Verificação enviada</h2>
              <p className="text-sm leading-7 text-[var(--dl-muted-light)]">
                Enviamos um link de confirmação para o e-mail abaixo.
              </p>
              <p className="rounded-[1rem] border border-[var(--dl-border)] bg-black/20 px-3 py-2 text-sm font-semibold text-white">
                {registeredEmail}
              </p>
            </div>

            <p className="text-sm leading-7 text-[var(--dl-muted-light)]">
              Verifique sua caixa de entrada e o spam para concluir seu acesso.
            </p>

            <Button fullWidth variant="secondary" onClick={() => navigate(ROUTES.LOGIN)}>
              Voltar para login
            </Button>
          </Card>
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
