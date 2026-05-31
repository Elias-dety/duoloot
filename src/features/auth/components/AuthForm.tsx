import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Card, Input, Label } from '@/components/atoms';
import { ROUTES } from '@/constants/routes';
import { useLanguage } from '@/i18n';

export type AuthFormSubmission = {
  email: string;
  password: string;
  name?: string;
  nickname?: string;
};

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: AuthFormSubmission) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  isSupabaseConfigured: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isLoading,
  isSupabaseConfigured,
}) => {
  const { messages: copy } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const isLogin = type === 'login';
  const accent = isLogin ? 'var(--dl-number)' : 'var(--dl-function)';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!isSupabaseConfigured) {
      setFormError(copy.auth.missingSupabase);
      return;
    }

    if (!email || !password) {
      setFormError(copy.auth.requiredFields);
      return;
    }

    if (type === 'register') {
      if (!name || !nickname) {
        setFormError(copy.auth.nameNicknameRequired);
        return;
      }
      if (password.length < 6) {
        setFormError(copy.auth.passwordLength);
        return;
      }
      if (password !== confirmPassword) {
        setFormError(copy.auth.passwordMismatch);
        return;
      }

      const nicknameRegex = /^[a-zA-Z0-9_]+$/;
      if (!nicknameRegex.test(nickname)) {
        setFormError(copy.auth.nicknameInvalid);
        return;
      }
    }

    const payload = type === 'login' ? { email, password } : { email, password, name, nickname };
    const result = await onSubmit(payload);

    if (!result.success && result.error) {
      setFormError(result.error);
    }
  };

  return (
    <Card variant="elevated" className="dl-glass relative w-full max-w-md overflow-hidden rounded-[1.85rem] p-0">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-80" style={{ background: `radial-gradient(ellipse 80% 80% at 50% 0%, ${isLogin ? 'rgba(13,240,255,0.12)' : 'rgba(176,132,255,0.13)'}, transparent 70%)` }} />
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-8 text-[5.8rem] font-black leading-none tracking-[-0.42rem] opacity-[0.08] [writing-mode:vertical-rl]" style={{ color: accent }}>
        {isLogin ? 'LOGIN' : 'SIGNUP'}
      </div>

      <div className="relative z-[1] border-b border-white/[0.08] px-6 py-7 text-center md:px-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.68rem] font-black uppercase tracking-[0.18em]" style={{ borderColor: `${accent}4d`, background: `${accent}1a`, color: accent }}>
          <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
          {isLogin ? copy.auth.loginBadge : copy.auth.registerBadge}
        </div>

        <h2 className="dl-premium-title text-[clamp(2rem,4vw,2.65rem)] font-black">
          {isLogin ? copy.auth.loginTitle : copy.auth.registerTitle}
        </h2>

        <p className="mx-auto mt-4 max-w-sm font-['Inter'] text-sm leading-7 text-[var(--dl-muted-light)]">
          {isLogin ? copy.auth.loginDescription : copy.auth.registerDescription}
        </p>
      </div>

      <div className="relative z-[1] px-6 py-6 md:px-8 md:py-7">
        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-[1rem] border border-[var(--dl-warning)]/30 bg-[var(--dl-warning)]/10 p-4">
            <p className="text-center text-sm font-medium text-[var(--dl-muted-light)]">
              {copy.auth.missingSupabase}
            </p>
          </div>
        )}

        {formError && (
          <div className="mb-6 rounded-[1rem] border border-[var(--dl-keyword)]/40 bg-[rgb(var(--dl-red-rgb)/0.12)] p-4 shadow-[0_0_18px_rgba(255,70,85,.12)]">
            <p className="text-sm font-semibold text-white">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="name" required className="text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                  {copy.auth.name}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: Elias Neto"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isLoading || !isSupabaseConfigured}
                  className="rounded-xl border-white/[0.08] bg-black/20 focus:border-[var(--dl-function)]/45"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nickname" required className="text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                  {copy.auth.nickname}
                </Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="Ex: dety_duo"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value.replace(/\s/g, ''))}
                  disabled={isLoading || !isSupabaseConfigured}
                  className="rounded-xl border-white/[0.08] bg-black/20 focus:border-[var(--dl-function)]/45"
                  required
                />
                <span className="block text-xs text-[var(--dl-muted)]">
                  {copy.auth.nicknameHelp}
                </span>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" required className="text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
              {copy.auth.email}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="player@duoloot.gg"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading || !isSupabaseConfigured}
              className="rounded-xl border-white/[0.08] bg-black/20 focus:border-[var(--dl-number)]/45"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" required className="text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
              {copy.auth.password}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading || !isSupabaseConfigured}
              className="rounded-xl border-white/[0.08] bg-black/20 focus:border-[var(--dl-keyword)]/45"
              required
            />
          </div>

          {type === 'register' && (
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" required className="text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                {copy.auth.confirmPassword}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={isLoading || !isSupabaseConfigured}
                className="rounded-xl border-white/[0.08] bg-black/20 focus:border-[var(--dl-keyword)]/45"
                required
              />
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || !isSupabaseConfigured}
            className="mt-6 w-full rounded-xl shadow-[0_8px_28px_rgba(255,70,85,0.25)]"
          >
            {isLoading ? copy.common.processing : type === 'login' ? copy.auth.submitLogin : copy.auth.submitRegister}
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm">
          <p className="text-[var(--dl-muted-light)]">
            {type === 'login' ? copy.auth.newHere : copy.auth.alreadyHasAccess}
          </p>
          <Link
            to={type === 'login' ? ROUTES.REGISTER : ROUTES.LOGIN}
            className="inline-block font-black uppercase tracking-[0.14em] text-white hover:text-[var(--dl-error)]"
          >
            {type === 'login' ? copy.auth.createAccount : copy.auth.doLogin}
          </Link>
        </div>
      </div>
    </Card>
  );
};
