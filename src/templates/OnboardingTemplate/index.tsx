import React, { useState } from 'react';

import { OnboardingForm } from '@/features/onboarding/components/OnboardingForm';
import type { OnboardingData } from '@/features/onboarding/onboarding.schema';
import { DuolootCard, DuolootFrame, DuolootSectionTitle } from '@/components/duoloot';

interface OnboardingTemplateProps {
  initialData?: Partial<OnboardingData> | null;
  onSubmit: (data: OnboardingData) => Promise<void>;
  onSkip: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const OnboardingTemplate: React.FC<OnboardingTemplateProps> = ({
  initialData,
  onSubmit,
  onSkip,
  isLoading,
  error,
}) => {
  const [previewData, setPreviewData] = useState<Partial<OnboardingData>>({
    nickname: initialData?.nickname || 'PLAYER_X',
    mainGame: initialData?.mainGame || 'valorant',
    currentRank: initialData?.currentRank || 'unranked',
    mainRole: initialData?.mainRole || 'flex',
    playStyle: initialData?.playStyle || 'tatico',
    availability: initialData?.availability || 'noite',
    preferredModes: initialData?.preferredModes || ['casual'],
    microphone: initialData?.microphone !== undefined ? initialData.microphone : true,
    region: initialData?.region || 'br',
  });

  return (
    <DuolootFrame className="flex flex-col">
      <div className="dl-top-strip">
        <span>Duoloot profile setup</span>
        <span>Red Vault onboarding</span>
      </div>

      <div className="mx-auto flex-1 w-full max-w-[1240px] px-4 py-6 md:px-8 md:py-10">
        <div className="mb-8 md:mb-10">
          <DuolootSectionTitle
            eyebrow="Onboarding"
            title="Configure seu perfil gamer"
            subtitle="Esses dados alimentam lobby, recomendações e compatibilidade dentro do Duoloot."
          />
        </div>

        {error ? (
          <DuolootCard variant="danger" className="mb-6 p-4">
            <p className="text-sm font-semibold text-white">{error}</p>
          </DuolootCard>
        ) : null}

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            <OnboardingForm
              initialData={initialData}
              onSubmit={onSubmit}
              onSkip={onSkip}
              isLoading={isLoading}
              onDataChange={(data) => setPreviewData((prev) => ({ ...prev, ...data }))}
            />
          </div>

          <div className="lg:sticky lg:top-8 lg:col-span-5 xl:col-span-4">
            <DuolootCard variant="elevated" className="space-y-5 p-6">
              <div className="flex items-center justify-between border-b border-[var(--dl-border)] pb-4">
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                    Preview
                  </span>
                  <h3 className="font-['Rajdhani'] text-xl font-bold uppercase text-white">
                    {previewData.nickname || 'PLAYER_X'}
                  </h3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-[var(--dl-border-red)] bg-[rgba(255,0,0,0.12)] font-['Rajdhani'] text-sm font-bold uppercase text-white">
                  {previewData.region?.toUpperCase() || 'BR'}
                </div>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  ['Jogo', previewData.mainGame === 'league-of-legends' ? 'LOL' : previewData.mainGame === 'teamfight-tactics' ? 'TFT' : previewData.mainGame || 'VALORANT'],
                  ['Rank', previewData.currentRank || 'UNRANKED'],
                  ['Função', previewData.mainRole || 'FLEX'],
                  ['Estilo', previewData.playStyle || 'TÁTICO'],
                  ['Período', previewData.availability || 'VARIÁVEL'],
                  ['Microfone', previewData.microphone ? 'Ativo' : 'Inativo'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.03] px-4 py-3">
                    <span className="text-[var(--dl-muted-light)]">{label}</span>
                    <span className="font-semibold uppercase text-white">{value}</span>
                  </div>
                ))}
              </div>
            </DuolootCard>
          </div>
        </div>
      </div>
    </DuolootFrame>
  );
};

export default OnboardingTemplate;
