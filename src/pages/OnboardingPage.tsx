import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OnboardingData } from '@/features/onboarding/onboarding.schema';
import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '@/constants/routes';
import { getMyGameProfile, updateMyGameProfile } from '@/services/onboarding.service';
import { OnboardingTemplate } from '@/templates/OnboardingTemplate';
import { isSupabaseConfigured } from '@/lib/supabase';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const [initialData, setInitialData] = useState<Partial<OnboardingData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const data = await getMyGameProfile();
        if (isMounted) {
          const defaultNickname = data?.nickname || profile?.nickname || '';
          setInitialData({
            ...data,
            nickname: defaultNickname,
          });
        }
      } catch (error: unknown) {
        console.error('Erro ao ler perfil gamer:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [profile]);

  const handleSubmit = async (data: OnboardingData) => {
    setSaving(true);
    setError(null);
    try {
      await updateMyGameProfile(data);
      await refreshProfile();
      navigate(ROUTES.DASHBOARD);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Falha ao sincronizar o perfil gamer com o servidor.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--dl-black)]">
        <div className="relative mb-6 h-24 w-24">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-dashed border-[var(--dl-keyword)]/30 [animation-duration:8s]" />
          <div className="absolute inset-2 animate-spin rounded-full border border-dotted border-white/20 [animation-direction:reverse] [animation-duration:4s]" />
          <div className="absolute inset-4 flex items-center justify-center rounded-full border border-[var(--dl-keyword)]/40">
            <span className="h-2 w-2 animate-ping rounded-full bg-[var(--dl-keyword)]" />
          </div>
        </div>
        <div className="space-y-1.5 text-center">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--dl-error)]">
            Red Vault profile sync
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Lendo dados do perfil...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isSupabaseConfigured && (
        <div className="fixed top-0 z-50 w-full bg-[var(--dl-error)] px-4 py-2 text-center text-xs font-bold uppercase text-white shadow-md">
          Aviso: Supabase não está configurado. O salvamento do perfil será simulado e os dados não serão persistidos no servidor.
        </div>
      )}
      <OnboardingTemplate
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={saving}
        error={error}
      />
    </>
  );
};

export default OnboardingPage;
