import React, { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, Label } from '@/components/atoms';
import { OnboardingStepCard } from './OnboardingStepCard';
import {
  ONBOARDING_AVAILABILITIES,
  ONBOARDING_MAIN_GAMES,
  ONBOARDING_MODES,
  ONBOARDING_PLAY_STYLES,
  ONBOARDING_RANKS,
  ONBOARDING_REGIONS,
  ONBOARDING_ROLES,
  ONBOARDING_SESSION_FOCUS,
  OnboardingData,
  OnboardingSchema,
} from '../onboarding.schema';

interface OnboardingFormProps {
  initialData?: Partial<OnboardingData> | null;
  onSubmit: (data: OnboardingData) => Promise<void>;
  onSkip: () => void;
  isLoading: boolean;
  onDataChange?: (data: Partial<OnboardingData>) => void;
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  initialData,
  onSubmit,
  onSkip,
  isLoading,
  onDataChange,
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm<OnboardingData>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      mainGame: initialData?.mainGame || 'valorant',
      riotId: initialData?.riotId || '',
      nickname: initialData?.nickname || '',
      currentRank: initialData?.currentRank || 'unranked',
      mainRole: initialData?.mainRole || 'flex',
      secondaryRole: initialData?.secondaryRole || '',
      playStyle: initialData?.playStyle || 'tatico',
      sessionFocus: initialData?.sessionFocus || 'jogar-casual',
      availability: initialData?.availability || 'noite',
      preferredModes: initialData?.preferredModes || ['casual'],
      microphone: initialData?.microphone !== undefined ? initialData.microphone : true,
      region: initialData?.region || 'br',
      bio: initialData?.bio || '',
    },
  });

  const watchedData = useWatch({ control });
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(watchedData);
    }
  }, [watchedData, onDataChange]);

  const handleNext = async (event: React.MouseEvent) => {
    event.preventDefault();
    let fieldsToValidate: Array<keyof OnboardingData> = [];

    if (step === 1) {
      fieldsToValidate = ['mainGame', 'nickname', 'riotId', 'region'];
    } else if (step === 2) {
      fieldsToValidate = ['currentRank', 'mainRole', 'secondaryRole', 'playStyle'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrev = (event: React.MouseEvent) => {
    event.preventDefault();
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {step === 1 && (
        <OnboardingStepCard
          title="Identificação operacional"
          description="Informe sua identidade gamer e rede principal."
          stepNumber={1}
          totalSteps={totalSteps}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="mainGame" required className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
                Jogo principal
              </Label>
              <select id="mainGame" {...register('mainGame')} className="w-full border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] px-3 py-2 text-sm uppercase text-[var(--dl-tactical-text)] focus:border-[var(--dl-tactical-green)] focus:outline-none">
                {ONBOARDING_MAIN_GAMES.map((game) => (
                  <option key={game.value} value={game.value}>{game.label}</option>
                ))}
              </select>
              {errors.mainGame && <p className="text-[10px] font-semibold uppercase text-[var(--dl-tactical-red)]">{errors.mainGame.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="region" className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
                Região
              </Label>
              <select id="region" {...register('region')} className="w-full border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] px-3 py-2 text-sm uppercase text-[var(--dl-tactical-text)] focus:border-[var(--dl-tactical-green)] focus:outline-none">
                {ONBOARDING_REGIONS.map((region) => (
                  <option key={region.value} value={region.value}>{region.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nickname" required className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
                Codinome / nickname
              </Label>
              <Input id="nickname" type="text" placeholder="Ex: dety_gamer" {...register('nickname')} className="text-sm" />
              {errors.nickname && <p className="text-[10px] font-semibold uppercase text-[var(--dl-tactical-red)]">{errors.nickname.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="riotId" className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
                Riot ID / conta gamer
              </Label>
              <Input id="riotId" type="text" placeholder="Ex: Player#BR1" {...register('riotId')} className="text-sm" />
              {errors.riotId && <p className="text-[10px] font-semibold uppercase text-[var(--dl-tactical-red)]">{errors.riotId.message}</p>}
            </div>
          </div>
        </OnboardingStepCard>
      )}

      {step === 2 && (
        <OnboardingStepCard
          title="Perfil de combate"
          description="Defina patente, função e estilo de jogo."
          stepNumber={2}
          totalSteps={totalSteps}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="currentRank" required className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
                Patente / rank atual
              </Label>
              <select id="currentRank" {...register('currentRank')} className="w-full border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] px-3 py-2 text-sm uppercase text-[var(--dl-tactical-text)] focus:border-[var(--dl-tactical-green)] focus:outline-none">
                {ONBOARDING_RANKS.map((rank) => (
                  <option key={rank.value} value={rank.value}>{rank.label}</option>
                ))}
              </select>
              {errors.currentRank && <p className="text-[10px] font-semibold uppercase text-[var(--dl-tactical-red)]">{errors.currentRank.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="playStyle" required className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
                Estilo de jogo
              </Label>
              <select id="playStyle" {...register('playStyle')} className="w-full border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] px-3 py-2 text-sm uppercase text-[var(--dl-tactical-text)] focus:border-[var(--dl-tactical-green)] focus:outline-none">
                {ONBOARDING_PLAY_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>{style.label}</option>
                ))}
              </select>
              {errors.playStyle && <p className="text-[10px] font-semibold uppercase text-[var(--dl-tactical-red)]">{errors.playStyle.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="mainRole" required className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
                Função principal
              </Label>
              <select id="mainRole" {...register('mainRole')} className="w-full border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] px-3 py-2 text-sm uppercase text-[var(--dl-tactical-text)] focus:border-[var(--dl-tactical-green)] focus:outline-none">
                {ONBOARDING_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
              {errors.mainRole && <p className="text-[10px] font-semibold uppercase text-[var(--dl-tactical-red)]">{errors.mainRole.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="secondaryRole" className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
                Função secundária
              </Label>
              <select id="secondaryRole" {...register('secondaryRole')} className="w-full border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] px-3 py-2 text-sm uppercase text-[var(--dl-tactical-text)] focus:border-[var(--dl-tactical-green)] focus:outline-none">
                <option value="">Nenhuma</option>
                {ONBOARDING_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
          </div>
        </OnboardingStepCard>
      )}

      {step === 3 && (
        <OnboardingStepCard
          title="Social, frequência e conexão"
          description="Configure disponibilidade, áudio e objetivo das sessões."
          stepNumber={3}
          totalSteps={totalSteps}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="availability" required className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
                Disponibilidade
              </Label>
              <select id="availability" {...register('availability')} className="w-full border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] px-3 py-2 text-sm uppercase text-[var(--dl-tactical-text)] focus:border-[var(--dl-tactical-green)] focus:outline-none">
                {ONBOARDING_AVAILABILITIES.map((availability) => (
                  <option key={availability.value} value={availability.value}>{availability.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sessionFocus" className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
                Foco das sessões
              </Label>
              <select id="sessionFocus" {...register('sessionFocus')} className="w-full border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] px-3 py-2 text-sm uppercase text-[var(--dl-tactical-text)] focus:border-[var(--dl-tactical-green)] focus:outline-none">
                {ONBOARDING_SESSION_FOCUS.map((focus) => (
                  <option key={focus.value} value={focus.value}>{focus.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label required className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
              Modos preferidos
            </Label>
            <Controller
              control={control}
              name="preferredModes"
              render={({ field }) => {
                const selected = field.value || [];
                const toggleMode = (modeValue: string) => {
                  const updated = selected.includes(modeValue)
                    ? selected.filter((mode) => mode !== modeValue)
                    : [...selected, modeValue];
                  field.onChange(updated);
                };

                return (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {ONBOARDING_MODES.map((mode) => {
                      const isSelected = selected.includes(mode.value);
                      return (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => toggleMode(mode.value)}
                          className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)] ${
                            isSelected
                              ? 'border-[var(--dl-tactical-green)] bg-[var(--dl-tactical-green)]/15 text-[var(--dl-tactical-green)] shadow-[0_0_12px_rgba(56,242,139,0.15)]'
                              : 'border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] text-[var(--dl-tactical-muted)] hover:border-[var(--dl-tactical-muted)]'
                          }`}
                        >
                          {mode.label}
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            />
            {errors.preferredModes && <p className="text-[10px] font-semibold uppercase text-[var(--dl-tactical-red)]">{errors.preferredModes.message}</p>}
          </div>

          <div className="flex items-center justify-between gap-4 border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)]/50 p-3">
            <div className="space-y-0.5">
              <Label htmlFor="microphone" className="text-xs font-bold uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
                Possui microfone?
              </Label>
              <span className="block text-[10px] uppercase tracking-wider text-[var(--dl-tactical-muted)]">
                Comunicação por áudio ativa para coordenação tática.
              </span>
            </div>
            <Controller
              control={control}
              name="microphone"
              render={({ field }) => (
                <button
                  type="button"
                  id="microphone"
                  onClick={() => field.onChange(!field.value)}
                  className={`relative h-7 w-14 rounded-full p-1 transition-all duration-300 ${
                    field.value ? 'border border-[var(--dl-tactical-green)] bg-[var(--dl-tactical-green)]/20' : 'border border-[var(--dl-tactical-line)] bg-black/60'
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full transition-all duration-300 ${
                      field.value ? 'translate-x-7 bg-[var(--dl-tactical-green)] shadow-[0_0_8px_var(--dl-tactical-green)]' : 'translate-x-0 bg-[var(--dl-tactical-muted)]'
                    }`}
                  />
                </button>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-[11px] uppercase tracking-wider text-[var(--dl-tactical-text)] font-[Chakra_Petch]">
              Biografia curta
            </Label>
            <textarea
              id="bio"
              placeholder="Descreva seu estilo de jogo, agentes favoritos ou metas operacionais..."
              maxLength={180}
              {...register('bio')}
              rows={3}
              className="w-full resize-none border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)] px-3 py-2 text-xs text-[var(--dl-tactical-text)] placeholder-[var(--dl-tactical-muted)]/50 focus:border-[var(--dl-tactical-green)] focus:outline-none"
            />
            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[var(--dl-tactical-muted)]">
              <span>Aparece no painel social.</span>
              <span>{(watchedData.bio || '').length}/180</span>
            </div>
          </div>
        </OnboardingStepCard>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {step > 1 && (
            <Button type="button" onClick={handlePrev} variant="outline" className="px-4 py-2 text-[11px]">
              Voltar
            </Button>
          )}
          <Button type="button" onClick={onSkip} variant="ghost" className="px-3 py-2 text-[10px]">
            Pular por enquanto
          </Button>
        </div>

        {step < totalSteps ? (
          <Button type="button" onClick={handleNext} variant="tactical-green" className="px-6 py-2.5 text-[11px]">
            Próximo passo
          </Button>
        ) : (
          <Button type="submit" disabled={isLoading} variant="tactical-green" className="px-8 py-2.5 text-[11px] shadow-[0_0_20px_rgba(56,242,139,0.3)]">
            {isLoading ? 'SINCRONIZANDO PERFIL...' : 'Salvar perfil gamer'}
          </Button>
        )}
      </div>
    </form>
  );
};
