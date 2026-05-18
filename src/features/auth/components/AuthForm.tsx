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
        <div className="inline-flex items-center justify-center rounded-full border border-[var(--dl-border-red)] bg-[rgba(255,0,0,0.12)] px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white">
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

      {!isSupabaseConfigured && (
        <div className="mb-6 rounded-[1rem] border border-[var(--dl-border)] bg-white/[0.04] p-4">
          <p className="text-center text-sm font-medium text-[var(--dl-muted-light)]">
            Configuração do Supabase ausente.
          </p>
        </div>
      )}

      {formError && (
        <div className="mb-6 rounded-[1rem] border border-[var(--dl-border-red)] bg-[rgba(255,0,0,0.12)] p-4">
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
          className="inline-block font-semibold uppercase tracking-[0.14em] text-white hover:text-[var(--dl-red-soft)]"
        >
          {type === 'login' ? 'Criar conta' : 'Fazer login'}
        </Link>
      </div>
    </Card>
  );
};
