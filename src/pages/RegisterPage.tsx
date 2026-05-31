import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import { AuthForm, AuthFormSubmission } from '@/features/auth/components/AuthForm';
import { useAuth } from '@/features/auth/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Button, Card } from '@/components/atoms';
import { useLanguage } from '@/i18n';

const RegisterPage: React.FC = () => {
  const { signUp, isAuthenticated, isLoading: authLoading } = useAuth();
  const { messages: copy } = useLanguage();
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
        return { success: false, error: copy.auth.nameNicknameRequired };
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
        error: error instanceof Error ? error.message : copy.auth.registerFailure,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-11rem)] w-full max-w-[1600px] items-center gap-10 lg:grid-cols-[0.95fr_1fr]">
        <aside className="hidden lg:block">
          <section className="dl-premium-hero p-8 xl:p-10" data-watermark="SIGNUP">
            <div className="relative z-[2]">
              <div className="dl-premium-badge mb-8 border-[var(--dl-function)]/30 bg-[var(--dl-function)]/10 px-3 py-1.5 text-[var(--dl-function)]">
                Criação de conta
              </div>

              <h1 className="dl-premium-title mb-6 text-[clamp(2.6rem,5vw,5.2rem)] font-black">
                Monte seu perfil antes de entrar no jogo.
              </h1>

              <p className="dl-premium-muted mb-8 max-w-md font-['Inter'] text-base font-light">
                O cadastro cria a conta base. Depois disso, o onboarding coleta seu perfil gamer para alimentar lobbies, recomendações e futuras integrações.
              </p>

              <div className="grid gap-3">
                {[
                  { label: 'Cadastro real', value: 'Supabase Auth', color: 'var(--dl-string)' },
                  { label: 'Identidade gamer', value: 'Nome + nickname', color: 'var(--dl-function)' },
                  { label: 'Depois', value: 'Onboarding obrigatório', color: 'var(--dl-warning)' },
                ].map((item) => (
                  <div key={item.label} className="dl-stat-tile flex min-h-0 items-center justify-between px-4 py-3">
                    <span className="dl-stat-label">{item.label}</span>
                    <span className="text-right font-mono text-[0.72rem]" style={{ color: item.color }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </aside>

        <div className="flex w-full justify-center lg:justify-end">
          {needsVerification ? (
            <Card variant="elevated" className="dl-glass relative w-full max-w-md space-y-6 overflow-hidden rounded-[1.85rem] p-6 text-center md:p-8">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(255,70,85,0.12),transparent_70%)]" />
              <div className="relative z-[1]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--dl-keyword)]/35 bg-[rgb(var(--dl-red-rgb)/0.12)] text-2xl shadow-[0_0_24px_rgba(255,70,85,.14)]">
                  ✉
                </div>

                <div className="mt-6 space-y-2">
                  <h2 className="dl-premium-title text-3xl font-black">{copy.auth.verificationSent}</h2>
                  <p className="text-sm leading-7 text-[var(--dl-muted-light)]">
                    {copy.auth.verificationDescription}
                  </p>
                  <p className="rounded-[1rem] border border-white/[0.08] bg-black/20 px-3 py-2 text-sm font-semibold text-white">
                    {registeredEmail}
                  </p>
                </div>

                <p className="mt-5 text-sm leading-7 text-[var(--dl-muted-light)]">
                  {copy.auth.verificationInstructions}
                </p>

                <Button fullWidth variant="secondary" className="mt-6" onClick={() => navigate(ROUTES.LOGIN)}>
                  {copy.auth.backToLogin}
                </Button>
              </div>
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
    </div>
  );
};

export default RegisterPage;
