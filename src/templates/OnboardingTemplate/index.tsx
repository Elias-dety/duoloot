import React, { useState } from 'react';

import { OnboardingForm } from '@/features/onboarding/components/OnboardingForm';
import type { OnboardingData } from '@/features/onboarding/onboarding.schema';
import { Card, Frame, SectionTitle } from '@/components/atoms';

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
    <Frame className="flex flex-col">
      <div className="dl-top-strip">
        <span>Duoloot profile setup</span>
        <span>Red Vault onboarding</span>
      </div>

      <div className="mx-auto flex-1 w-full max-w-[1240px] px-4 py-6 md:px-8 md:py-10">
        <div className="mb-8 md:mb-10">
          <SectionTitle
            eyebrow="Onboarding"
            title="Configure seu perfil gamer"
            subtitle="Esses dados alimentam lobby, recomendações e compatibilidade dentro do Duoloot."
          />
        </div>

        {error ? (
          <Card variant="danger" className="mb-6 p-4">
            <p className="text-sm font-semibold text-white">{error}</p>
          </Card>
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
            <Card variant="elevated" className="space-y-6 p-6 overflow-hidden relative">
              {/* Glow decorativo */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[var(--dl-error)]/10 blur-[40px]" />

              <div className="flex items-center justify-between border-b border-[var(--dl-border)] pb-5 relative z-10">
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--dl-muted-light)] mb-1">
                    Preview do Perfil
                  </span>
                  <h3 className="font-['Rajdhani'] text-2xl font-bold uppercase tracking-wide text-white">
                    {previewData.nickname || 'PLAYER_X'}
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-[var(--dl-keyword)] bg-[rgb(var(--dl-red-rgb)/0.12)] shadow-[0_0_15px_rgba(var(--dl-keyword-rgb),0.15)] font-['Rajdhani'] text-base font-bold uppercase text-white">
                  {previewData.region?.toUpperCase() || 'BR'}
                </div>
              </div>

              <div className="space-y-3 text-sm relative z-10">
                {[
                  { label: 'Jogo', value: previewData.mainGame === 'league-of-legends' ? 'LOL' : previewData.mainGame === 'teamfight-tactics' ? 'TFT' : previewData.mainGame || 'VALORANT', colorClass: 'text-[var(--dl-function)] border-[var(--dl-function)]/30 bg-[var(--dl-function)]/5' },
                  { label: 'Rank', value: previewData.currentRank || 'UNRANKED', colorClass: 'text-[var(--dl-keyword)] border-[var(--dl-keyword)]/30 bg-[var(--dl-keyword)]/5' },
                  { label: 'Função', value: previewData.mainRole || 'FLEX', colorClass: 'text-[var(--dl-string)] border-[var(--dl-string)]/30 bg-[var(--dl-string)]/5' },
                  { label: 'Estilo', value: previewData.playStyle || 'TÁTICO', colorClass: 'text-white border-[var(--dl-border)] bg-white/[0.03]' },
                  { label: 'Período', value: previewData.availability || 'VARIÁVEL', colorClass: 'text-[var(--dl-muted-light)] border-[var(--dl-border)] bg-white/[0.03]' },
                  { label: 'Microfone', value: previewData.microphone ? 'ATIVO' : 'INATIVO', colorClass: previewData.microphone ? 'text-[var(--dl-warning)] border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/5' : 'text-[var(--dl-error)] border-[var(--dl-error)]/30 bg-[var(--dl-error)]/5' },
                ].map(({ label, value, colorClass }) => (
                  <div key={label} className="flex items-center justify-between rounded-[0.75rem] border border-[var(--dl-border)] bg-white/[0.02] px-4 py-3">
                    <span className="text-[var(--dl-muted-light)] font-medium">{label}</span>
                    <span className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider border ${colorClass}`}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Frame>
  );
};

