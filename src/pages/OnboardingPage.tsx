import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { OnboardingTemplate } from '@/templates/OnboardingTemplate';
import { updateMyGameProfile, getMyGameProfile } from '@/services/onboarding.service';
import { ROUTES } from '@/constants/routes';
import type { OnboardingData } from '@/features/onboarding/onboarding.schema';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const [initialData, setInitialData] = useState<Partial<OnboardingData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega os dados existentes do game_profile se houver
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const data = await getMyGameProfile();
        if (isMounted) {
          // Se já existe um nickname no perfil mas não no game_profile, coloca no fallback
          const defaultNickname = data?.nickname || profile?.nickname || '';
          setInitialData({
            ...data,
            nickname: defaultNickname,
          });
        }
      } catch (err: any) {
        console.error('Erro ao ler perfil gamer:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

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
      // Envia o usuário logado para o painel principal
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err?.message || 'Falha ao sincronizar o perfil gamer com o servidor.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    // Permite pular e ir direto ao painel
    navigate(ROUTES.DASHBOARD);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--dl-tactical-bg)] flex flex-col justify-center items-center font-[Chakra_Petch]">
        <div className="relative w-24 h-24 mb-6">
          {/* Radar HUD animado de carregamento */}
          <div className="absolute inset-0 border-2 border-dashed border-[var(--dl-tactical-green)]/30 rounded-full animate-spin [animation-duration:8s]" />
          <div className="absolute inset-2 border border-dotted border-[var(--dl-tactical-yellow)]/20 rounded-full animate-spin [animation-duration:4s] [animation-direction:reverse]" />
          <div className="absolute inset-4 border border-[var(--dl-tactical-green)]/40 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[var(--dl-tactical-green)] animate-ping" />
          </div>
        </div>
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--dl-tactical-green)] uppercase font-mono block">
            RADAR INITIALIZATION // SCANNING PROFILE
          </span>
          <h2 className="text-sm font-bold uppercase text-[var(--dl-tactical-text)] tracking-wider">
            Lendo dados táticos do operador...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <OnboardingTemplate
      initialData={initialData}
      onSubmit={handleSubmit}
      onSkip={handleSkip}
      isLoading={saving}
      error={error}
    />
  );
};

export default OnboardingPage;
