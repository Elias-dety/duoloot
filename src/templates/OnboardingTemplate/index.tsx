import React, { useState } from 'react';
import { OnboardingForm } from '@/features/onboarding/components/OnboardingForm';
import type { OnboardingData } from '@/features/onboarding/onboarding.schema';

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
    nickname: initialData?.nickname || 'OPERATOR_X',
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
    <div className="dl-page-shell dl-scanlines flex flex-col font-[Chakra_Petch]">
      {/* Faixa técnica superior */}
      <div className="dl-top-strip">
        <span>SECURITY LEVEL: ENCRYPTED // TERMINAL SECURE</span>
        <span>ONBOARDING PROTOCOL v1.0.8</span>
      </div>

      <div className="flex-1 w-full max-w-[1240px] mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header HUD */}
        <div className="mb-10 text-center md:text-left relative">
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-[var(--dl-tactical-green)] hidden md:block" />
          <span className="text-[10px] font-bold text-[var(--dl-tactical-green)] tracking-[0.25em] uppercase font-mono block mb-1">
            OPERATOR SETUP // GAMER PROFILE SENSOR
          </span>
          <h1 className="text-3xl font-extrabold uppercase text-[var(--dl-tactical-text)] tracking-wider font-[Rajdhani] mb-2">
            Configure seu perfil de combate
          </h1>
          <p className="text-sm text-[var(--dl-tactical-muted)] max-w-2xl tracking-wide">
            Esses dados alimentam o radar de lobby, recomendações e compatibilidade de duplas no ecossistema do Duo Loot.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 border border-[var(--dl-tactical-red)] bg-[var(--dl-tactical-red)]/10 rounded flex items-center gap-3 [clip-path:var(--dl-cut-button)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--dl-tactical-red)] animate-ping shrink-0" />
            <p className="text-xs font-bold text-[var(--dl-tactical-red)] tracking-wider uppercase font-mono">
              SISTEMA: {error}
            </p>
          </div>
        )}

        {/* Layout Grid Responsivo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formulário Principal (Esquerda - 8 colunas) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <OnboardingForm
              initialData={initialData}
              onSubmit={onSubmit}
              onSkip={onSkip}
              isLoading={isLoading}
              onDataChange={(data) => setPreviewData((prev) => ({ ...prev, ...data }))}
            />
          </div>

          {/* Painel de Preview do Operador (Direita - 5 colunas) */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8">
            <div className="dl-panel dl-access-card dl-card-green relative overflow-hidden bg-[var(--dl-tactical-panel)] p-6 min-h-[380px] flex flex-col justify-between">
              {/* Moldura Tática HUD */}
              <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20 border-t-2 border-r-2 border-[var(--dl-tactical-green)]" />
              <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none opacity-20 border-b-2 border-l-2 border-[var(--dl-tactical-green)]" />

              <div>
                {/* Header do Card */}
                <div className="flex items-center justify-between border-b border-[var(--dl-tactical-line)] pb-4 mb-6">
                  <div>
                    <span className="text-[9px] font-mono text-[var(--dl-tactical-muted)] tracking-wider uppercase block">
                      OPERATOR CARD // IDENT: {previewData.region?.toUpperCase() || 'BR'}
                    </span>
                    <h3 className="text-xl font-black text-[var(--dl-tactical-text)] uppercase font-[Rajdhani] tracking-widest">
                      {previewData.nickname || 'OPERATOR_X'}
                    </h3>
                  </div>
                  <div className="w-10 h-10 bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] rounded flex items-center justify-center font-bold text-[var(--dl-tactical-green)] font-mono text-sm [clip-path:var(--dl-cut-button)]">
                    {previewData.region?.toUpperCase() || 'BR'}
                  </div>
                </div>

                {/* Grid de Detalhes Técnicos */}
                <div className="space-y-4 text-xs font-[Chakra_Petch]">
                  {/* Jogo Principal */}
                  <div className="flex justify-between items-center py-1 border-b border-[var(--dl-tactical-line)]/50">
                    <span className="text-[var(--dl-tactical-muted)] uppercase font-semibold tracking-wider">
                      Jogo Ativo
                    </span>
                    <span className="text-[var(--dl-tactical-text)] uppercase font-bold tracking-widest font-mono">
                      {previewData.mainGame === 'league-of-legends' ? 'LoL' : previewData.mainGame === 'teamfight-tactics' ? 'TFT' : previewData.mainGame || 'VALORANT'}
                    </span>
                  </div>

                  {/* Patente / Rank */}
                  <div className="flex justify-between items-center py-1 border-b border-[var(--dl-tactical-line)]/50">
                    <span className="text-[var(--dl-tactical-muted)] uppercase font-semibold tracking-wider">
                      Patente / Rank
                    </span>
                    <span className="text-[var(--dl-tactical-yellow)] font-bold uppercase tracking-widest">
                      {previewData.currentRank || 'UNRANKED'}
                    </span>
                  </div>

                  {/* Função */}
                  <div className="flex justify-between items-center py-1 border-b border-[var(--dl-tactical-line)]/50">
                    <span className="text-[var(--dl-tactical-muted)] uppercase font-semibold tracking-wider">
                      Função Principal
                    </span>
                    <span className="text-[var(--dl-tactical-text)] font-bold uppercase tracking-widest">
                      {previewData.mainRole || 'FLEX'}
                    </span>
                  </div>

                  {/* Estilo de Jogo */}
                  <div className="flex justify-between items-center py-1 border-b border-[var(--dl-tactical-line)]/50">
                    <span className="text-[var(--dl-tactical-muted)] uppercase font-semibold tracking-wider">
                      Estilo Operacional
                    </span>
                    <span className="text-[var(--dl-tactical-green)] font-bold uppercase tracking-widest">
                      {previewData.playStyle || 'TÁTICO'}
                    </span>
                  </div>

                  {/* Disponibilidade */}
                  <div className="flex justify-between items-center py-1 border-b border-[var(--dl-tactical-line)]/50">
                    <span className="text-[var(--dl-tactical-muted)] uppercase font-semibold tracking-wider">
                      Período Ativo
                    </span>
                    <span className="text-[var(--dl-tactical-text)] font-bold uppercase tracking-widest">
                      {previewData.availability || 'VARIÁVEL'}
                    </span>
                  </div>

                  {/* Áudio / Microfone */}
                  <div className="flex justify-between items-center py-1 border-b border-[var(--dl-tactical-line)]/50">
                    <span className="text-[var(--dl-tactical-muted)] uppercase font-semibold tracking-wider">
                      Microfone
                    </span>
                    <span className={`font-bold uppercase tracking-widest ${previewData.microphone ? 'text-[var(--dl-tactical-green)]' : 'text-[var(--dl-tactical-red)]'}`}>
                      {previewData.microphone ? 'HABILITADO' : 'INATIVO'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status do Operador no Rodapé */}
              <div className="mt-8 pt-4 border-t border-[var(--dl-tactical-line)] flex items-center justify-between">
                <span className="text-[9px] font-mono text-[var(--dl-tactical-muted)] tracking-wider uppercase">
                  OPERATOR STATUS
                </span>
                <span className="text-[10px] font-extrabold text-[var(--dl-tactical-green)] tracking-wider uppercase flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--dl-tactical-green)] animate-ping" />
                  EM CONFIGURAÇÃO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OnboardingTemplate;
