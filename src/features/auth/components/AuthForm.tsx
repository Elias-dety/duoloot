import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Card, Input, Label } from '@/components/atoms';
import { ROUTES } from '@/constants/routes';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (!isSupabaseConfigured) {
      setFormError('Configuração do Supabase ausente.');
      return;
    }

    if (!email || !password) {
      setFormError('Preencha os campos obrigatórios.');
      return;
    }

    if (type === 'register') {
      if (!name || !nickname) {
        setFormError('Nome e nickname são obrigatórios.');
        return;
      }
      if (password.length < 6) {
        setFormError('A senha precisa ter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('As senhas não coincidem.');
        return;
      }

      const nicknameRegex = /^[a-zA-Z0-9_]+$/;
      if (!nicknameRegex.test(nickname)) {
        setFormError('O nickname deve conter apenas letras, números e underscores.');
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
    <Card variant="elevated" className="w-full max-w-md rounded-[1.75rem] border-[var(--dl-border)] bg-[rgba(14,17,23,0.96)] p-6 md:p-8">
      <div className="mb-6 space-y-3 text-center">
        <div className="inline-flex items-center justify-center rounded-full border border-[var(--dl-keyword)] bg-[rgb(var(--dl-red-rgb)/0.12)] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white">
          {type === 'login' ? 'Red Vault Login' : 'Create your Duoloot access'}
        </div>
        <h2 className="font-['Rajdhani'] text-3xl font-bold uppercase tracking-[0.04em] text-white">
          {type === 'login' ? 'Entrar na conta' : 'Criar conta'}
        </h2>
        <p className="text-sm leading-7 text-[var(--dl-muted-light)]">
          {type === 'login'
            ? 'Acesse sua conta para entrar em lobbies, acompanhar o Vault e continuar seu progresso.'
            : 'Configure seu acesso para entrar no ecossistema Duoloot Red Vault.'}
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <button
          type="button"
          onClick={() => console.log('Login com Google clicado')}
          className="flex w-full items-center justify-center gap-2 rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.02] p-3 text-sm font-semibold text-white transition-all hover:bg-white/[0.04]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {type === 'login' ? 'Entrar com Google' : 'Criar conta com Google'}
        </button>

        <div className="relative">
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-[1rem] border border-[var(--dl-error)]/20 bg-[var(--dl-error)]/[0.02] p-3 text-sm font-semibold text-white opacity-60"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-[var(--dl-error)] text-[10px] font-black text-white">R</span>
              {type === 'login' ? 'Entrar com Riot' : 'Criar conta com Riot'}
            </span>
            <span className="ml-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-[var(--dl-error)]/20 text-[var(--dl-error)]">Em breve</span>
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="h-[1px] flex-1 bg-[var(--dl-border)]" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--dl-muted)]">
          ou continue com e-mail
        </span>
        <div className="h-[1px] flex-1 bg-[var(--dl-border)]" />
      </div>

      {!isSupabaseConfigured && (
        <div className="mb-6 rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.04] p-4">
          <p className="text-center text-sm font-medium text-[var(--dl-muted-light)]">
            Configuração do Supabase ausente.
          </p>
        </div>
      )}

      {formError && (
        <div className="mb-6 rounded-[1rem] border border-[var(--dl-keyword)] bg-[rgb(var(--dl-red-rgb)/0.12)] p-4">
          <p className="text-sm font-semibold text-white">{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="name" required className="text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                Nome
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Elias Neto"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isLoading || !isSupabaseConfigured}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nickname" required className="text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
                Nickname
              </Label>
              <Input
                id="nickname"
                type="text"
                placeholder="Ex: dety_duo"
                value={nickname}
                onChange={(event) => setNickname(event.target.value.replace(/\s/g, ''))}
                disabled={isLoading || !isSupabaseConfigured}
                required
              />
              <span className="block text-xs text-[var(--dl-muted)]">
                Usado em convites, lobby e conexões.
              </span>
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" required className="text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="player@duoloot.gg"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLoading || !isSupabaseConfigured}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" required className="text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoading || !isSupabaseConfigured}
            required
          />
        </div>

        {type === 'register' && (
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" required className="text-xs uppercase tracking-[0.14em] text-[var(--dl-muted-light)]">
              Confirmar senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              disabled={isLoading || !isSupabaseConfigured}
              required
            />
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || !isSupabaseConfigured}
          className="mt-6 w-full"
        >
          {isLoading ? 'Processando...' : type === 'login' ? 'Entrar' : 'Criar conta'}
        </Button>
      </form>

      <div className="mt-6 space-y-2 text-center text-sm">
        <p className="text-[var(--dl-muted-light)]">
          {type === 'login' ? 'Novo por aqui?' : 'Já possui acesso?'}
        </p>
        <Link
          to={type === 'login' ? ROUTES.REGISTER : ROUTES.LOGIN}
          className="inline-block font-semibold uppercase tracking-[0.14em] text-white hover:text-[var(--dl-error)]"
        >
          {type === 'login' ? 'Criar conta' : 'Fazer login'}
        </Link>
      </div>
    </Card>
  );
};
