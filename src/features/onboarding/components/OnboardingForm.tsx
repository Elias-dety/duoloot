import React, { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  OnboardingSchema,
  OnboardingData,
  ONBOARDING_MAIN_GAMES,
  ONBOARDING_RANKS,
  ONBOARDING_ROLES,
  ONBOARDING_PLAY_STYLES,
  ONBOARDING_SESSION_FOCUS,
  ONBOARDING_AVAILABILITIES,
  ONBOARDING_MODES,
  ONBOARDING_REGIONS,
} from '../onboarding.schema';
import { OnboardingStepCard } from './OnboardingStepCard';
import { Input, Label, Button } from '@/components/atoms';

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

  // Escuta os campos para enviar as atualizações ao preview do operador
  const watchedData = useWatch({ control });
  React.useEffect(() => {
    if (onDataChange) {
      onDataChange(watchedData);
    }
  }, [watchedData, onDataChange]);

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault();
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

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onFormSubmit = (data: OnboardingData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* PASSOS DO STEPPER */}
      {step === 1 && (
        <OnboardingStepCard
          title="Identificação Operacional"
          description="Informe sua identidade cibernética gamer e rede de servidores."
          stepNumber={1}
          totalSteps={totalSteps}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Jogo Principal */}
            <div className="space-y-1.5">
              <Label htmlFor="mainGame" required className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
                Jogo Principal de Operação
              </Label>
              <select
                id="mainGame"
                {...register('mainGame')}
                className="w-full bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-[var(--dl-tactical-text)] px-3 py-2 rounded font-[Chakra_Petch] text-sm focus:border-[var(--dl-tactical-green)] focus:outline-none uppercase"
              >
                {ONBOARDING_MAIN_GAMES.map((game) => (
                  <option key={game.value} value={game.value}>
                    {game.label}
                  </option>
                ))}
              </select>
              {errors.mainGame && (
                <p className="text-[10px] text-[var(--dl-tactical-red)] uppercase font-[Chakra_Petch] font-semibold">
                  {errors.mainGame.message}
                </p>
              )}
            </div>

            {/* Região */}
            <div className="space-y-1.5">
              <Label htmlFor="region" className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
                Região de Servidores
              </Label>
              <select
                id="region"
                {...register('region')}
                className="w-full bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-[var(--dl-tactical-text)] px-3 py-2 rounded font-[Chakra_Petch] text-sm focus:border-[var(--dl-tactical-green)] focus:outline-none uppercase"
              >
                {ONBOARDING_REGIONS.map((reg) => (
                  <option key={reg.value} value={reg.value}>
                    {reg.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nickname */}
            <div className="space-y-1.5">
              <Label htmlFor="nickname" required className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
                Codinome / Nickname
              </Label>
              <Input
                id="nickname"
                type="text"
                placeholder="Ex: dety_gamer"
                {...register('nickname')}
                className="lowercase text-sm font-[Chakra_Petch]"
              />
              {errors.nickname && (
                <p className="text-[10px] text-[var(--dl-tactical-red)] uppercase font-[Chakra_Petch] font-semibold">
                  {errors.nickname.message}
                </p>
              )}
            </div>

            {/* Riot ID */}
            <div className="space-y-1.5">
              <Label htmlFor="riotId" className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
                Riot ID / Conta Gamer (Opcional)
              </Label>
              <Input
                id="riotId"
                type="text"
                placeholder="Ex: Player#BR1"
                {...register('riotId')}
                className="text-sm font-[Chakra_Petch]"
              />
              {errors.riotId && (
                <p className="text-[10px] text-[var(--dl-tactical-red)] uppercase font-[Chakra_Petch] font-semibold">
                  {errors.riotId.message}
                </p>
              )}
            </div>
          </div>
        </OnboardingStepCard>
      )}

      {step === 2 && (
        <OnboardingStepCard
          title="Habilidades e Perfil de Combate"
          description="Especifique suas qualificações táticas e patente militar de jogo."
          stepNumber={2}
          totalSteps={totalSteps}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patente / Rank */}
            <div className="space-y-1.5">
              <Label htmlFor="currentRank" required className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
                Patente / Rank Atual
              </Label>
              <select
                id="currentRank"
                {...register('currentRank')}
                className="w-full bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-[var(--dl-tactical-text)] px-3 py-2 rounded font-[Chakra_Petch] text-sm focus:border-[var(--dl-tactical-green)] focus:outline-none uppercase"
              >
                {ONBOARDING_RANKS.map((rank) => (
                  <option key={rank.value} value={rank.value}>
                    {rank.label}
                  </option>
                ))}
              </select>
              {errors.currentRank && (
                <p className="text-[10px] text-[var(--dl-tactical-red)] uppercase font-[Chakra_Petch] font-semibold">
                  {errors.currentRank.message}
                </p>
              )}
            </div>

            {/* Estilo de Jogo */}
            <div className="space-y-1.5">
              <Label htmlFor="playStyle" required className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
                Estilo de Jogo
              </Label>
              <select
                id="playStyle"
                {...register('playStyle')}
                className="w-full bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-[var(--dl-tactical-text)] px-3 py-2 rounded font-[Chakra_Petch] text-sm focus:border-[var(--dl-tactical-green)] focus:outline-none uppercase"
              >
                {ONBOARDING_PLAY_STYLES.map((style) => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
              {errors.playStyle && (
                <p className="text-[10px] text-[var(--dl-tactical-red)] uppercase font-[Chakra_Petch] font-semibold">
                  {errors.playStyle.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Função Principal */}
            <div className="space-y-1.5">
              <Label htmlFor="mainRole" required className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
                Função Principal (Main Role)
              </Label>
              <select
                id="mainRole"
                {...register('mainRole')}
                className="w-full bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-[var(--dl-tactical-text)] px-3 py-2 rounded font-[Chakra_Petch] text-sm focus:border-[var(--dl-tactical-green)] focus:outline-none uppercase"
              >
                {ONBOARDING_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.mainRole && (
                <p className="text-[10px] text-[var(--dl-tactical-red)] uppercase font-[Chakra_Petch] font-semibold">
                  {errors.mainRole.message}
                </p>
              )}
            </div>

            {/* Função Secundária */}
            <div className="space-y-1.5">
              <Label htmlFor="secondaryRole" className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
                Função Secundária (Opcional)
              </Label>
              <select
                id="secondaryRole"
                {...register('secondaryRole')}
                className="w-full bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-[var(--dl-tactical-text)] px-3 py-2 rounded font-[Chakra_Petch] text-sm focus:border-[var(--dl-tactical-green)] focus:outline-none uppercase"
              >
                <option value="">Nenhuma / Sem preferência</option>
                {ONBOARDING_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </OnboardingStepCard>
      )}

      {step === 3 && (
        <OnboardingStepCard
          title="Social, Frequência & Conexão"
          description="Configure sua disponibilidade operacional, canais de áudio e metas."
          stepNumber={3}
          totalSteps={totalSteps}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Disponibilidade */}
            <div className="space-y-1.5">
              <Label htmlFor="availability" required className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
                Disponibilidade para Jogar
              </Label>
              <select
                id="availability"
                {...register('availability')}
                className="w-full bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-[var(--dl-tactical-text)] px-3 py-2 rounded font-[Chakra_Petch] text-sm focus:border-[var(--dl-tactical-green)] focus:outline-none uppercase"
              >
                {ONBOARDING_AVAILABILITIES.map((avail) => (
                  <option key={avail.value} value={avail.value}>
                    {avail.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Foco da Sessão */}
            <div className="space-y-1.5">
              <Label htmlFor="sessionFocus" className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
                Foco Principal das Sessões
              </Label>
              <select
                id="sessionFocus"
                {...register('sessionFocus')}
                className="w-full bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-[var(--dl-tactical-text)] px-3 py-2 rounded font-[Chakra_Petch] text-sm focus:border-[var(--dl-tactical-green)] focus:outline-none uppercase"
              >
                {ONBOARDING_SESSION_FOCUS.map((focus) => (
                  <option key={focus.value} value={focus.value}>
                    {focus.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Modos Preferidos (Chips Clicáveis) */}
          <div className="space-y-2">
            <Label required className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
              Modos de Jogo Preferidos (Selecione pelo menos 1)
            </Label>
            <Controller
              control={control}
              name="preferredModes"
              render={({ field }) => {
                const selected = field.value || [];
                const toggleMode = (modeVal: string) => {
                  const isSelected = selected.includes(modeVal);
                  const updated = isSelected
                    ? selected.filter((m) => m !== modeVal)
                    : [...selected, modeVal];
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
                          className={`px-3 py-1.5 border font-semibold text-xs tracking-wider uppercase font-[Chakra_Petch] transition-all rounded-sm [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)] ${
                            isSelected
                              ? 'bg-[var(--dl-tactical-green)]/15 border-[var(--dl-tactical-green)] text-[var(--dl-tactical-green)] shadow-[0_0_12px_rgba(56,242,139,0.15)]'
                              : 'bg-[var(--dl-tactical-metal)] border-[var(--dl-tactical-line)] text-[var(--dl-tactical-muted)] hover:border-[var(--dl-tactical-muted)]'
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
            {errors.preferredModes && (
              <p className="text-[10px] text-[var(--dl-tactical-red)] uppercase font-[Chakra_Petch] font-semibold">
                {errors.preferredModes.message}
              </p>
            )}
          </div>

          {/* Microfone Toggle */}
          <div className="flex items-center justify-between p-3 border border-[var(--dl-tactical-line)] bg-[var(--dl-tactical-metal)]/50 rounded">
            <div className="space-y-0.5">
              <Label htmlFor="microphone" className="text-xs font-bold text-[var(--dl-tactical-text)] uppercase tracking-wider font-[Chakra_Petch]">
                Possui Microfone de Combate?
              </Label>
              <span className="text-[10px] text-[var(--dl-tactical-muted)] uppercase tracking-wider block">
                Comunicação por áudio ativa para coordenação e táticas.
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
                  className={`w-14 h-7 rounded-full p-1 transition-all duration-300 relative ${
                    field.value ? 'bg-[var(--dl-tactical-green)]/20 border border-[var(--dl-tactical-green)]' : 'bg-black/60 border border-[var(--dl-tactical-line)]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      field.value ? 'bg-[var(--dl-tactical-green)] translate-x-7 shadow-[0_0_8px_var(--dl-tactical-green)]' : 'bg-[var(--dl-tactical-muted)] translate-x-0'
                    }`}
                  />
                </button>
              )}
            />
          </div>

          {/* Biografia Curta */}
          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-[var(--dl-tactical-text)] uppercase text-[11px] tracking-wider font-[Chakra_Petch]">
              Anotações Adicionais / Biografia (Máx. 180 carac.)
            </Label>
            <textarea
              id="bio"
              placeholder="Descreva seu estilo de jogo, agentes favoritos ou metas operacionais..."
              maxLength={180}
              {...register('bio')}
              rows={2}
              className="w-full bg-[var(--dl-tactical-metal)] border border-[var(--dl-tactical-line)] text-[var(--dl-tactical-text)] px-3 py-2 rounded font-[Chakra_Petch] text-xs focus:border-[var(--dl-tactical-green)] focus:outline-none placeholder-[var(--dl-tactical-muted)]/50 resize-none"
            />
            <div className="flex justify-between items-center text-[10px] text-[var(--dl-tactical-muted)] uppercase tracking-wider">
              <span>* Aparece no painel de recomendações sociais.</span>
              <span>{(watchedData.bio || '').length}/180</span>
            </div>
          </div>
        </OnboardingStepCard>
      )}

      {/* BOTÕES DE NAVEGAÇÃO E ENVIO */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <Button
              type="button"
              onClick={handlePrev}
              variant="outline"
              className="px-4 py-2 border-[var(--dl-tactical-line)] bg-transparent hover:bg-white/5 text-[var(--dl-tactical-muted)] hover:text-white font-bold uppercase font-[Chakra_Petch] tracking-widest text-[11px] [clip-path:polygon(0_0,100%_0,90%_100%,10%_100%)] transition-all"
            >
              VOLTAR
            </Button>
          )}

          <Button
            type="button"
            onClick={onSkip}
            variant="ghost"
            className="text-[var(--dl-tactical-muted)] hover:text-[var(--dl-tactical-red)] font-semibold uppercase font-[Chakra_Petch] tracking-widest text-[10px] px-3 py-2 border border-transparent hover:border-[var(--dl-tactical-red)]/10 rounded transition-all"
          >
            PULAR POR ENQUANTO
          </Button>
        </div>

        {step < totalSteps ? (
          <Button
            type="button"
            onClick={handleNext}
            variant="tactical-green"
            className="px-6 py-2.5 bg-[var(--dl-tactical-green)] hover:bg-[var(--dl-tactical-green)]/90 text-black font-bold uppercase font-[Chakra_Petch] tracking-widest text-[11px] flex items-center gap-2 [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)] transition-all"
          >
            PRÓXIMO PASSO
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isLoading}
            variant="tactical-green"
            className="px-8 py-2.5 bg-[var(--dl-tactical-green)] hover:bg-[var(--dl-tactical-green)]/90 text-black font-bold uppercase font-[Chakra_Petch] tracking-widest text-[11px] flex items-center gap-2 [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(56,242,139,0.3)]"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                SINCRONIZANDO PERFIL...
              </>
            ) : (
              'SALVAR PERFIL GAMER'
            )}
          </Button>
        )}
      </div>
    </form>
  );
};
