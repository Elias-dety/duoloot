import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Label, Button, Card } from '@/components/atoms';
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
  isSupabaseConfigured
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isSupabaseConfigured) {
      setFormError('Acesso offline. O Supabase não está configurado neste terminal.');
      return;
    }

    if (!email || !password) {
      setFormError('Preencha os campos obrigatórios.');
      return;
    }

    if (type === 'register') {
      if (!name || !nickname) {
        setFormError('Nome e Nickname são obrigatórios.');
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
      
      // Validação de nickname (apenas letras, números e underscores, sem espaços)
      const nicknameRegex = /^[a-zA-Z0-9_]+$/;
      if (!nicknameRegex.test(nickname)) {
        setFormError('O nickname deve conter apenas letras, números e underscores (sem espaços).');
        return;
      }
    }

    const payload = type === 'login' 
      ? { email, password }
      : { email, password, name, nickname };

    const result = await onSubmit(payload);
    if (!result.success && result.error) {
      setFormError(result.error);
    }
  };

  return (
    <Card className="w-full max-w-md border-[var(--dl-tactical-line)] bg-black/60 p-8 backdrop-blur-md relative overflow-hidden [clip-path:polygon(0_0,100%_0,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%)]">
      {/* Indicador Tático Visual no topo */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--dl-tactical-green)] to-transparent opacity-80" />
      
      {/* Canto decorativo tático */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--dl-tactical-green)] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--dl-tactical-green)] opacity-40 pointer-events-none" />

      <div className="mb-6 space-y-2 text-center">
        <div className="inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-[var(--dl-tactical-green)] uppercase bg-[var(--dl-tactical-green)]/10 border border-[var(--dl-tactical-green)]/30 rounded-sm mb-2 [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)]">
          {type === 'login' ? 'SECURE GATE // ENTRADA' : 'OPERATOR REGISTRATION // REGISTRO'}
        </div>
        <h2 className="text-xl font-bold uppercase text-[var(--dl-tactical-text)] font-[Chakra_Petch] tracking-widest flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 bg-[var(--dl-tactical-green)] animate-pulse" />
          {type === 'login' ? 'EFETUAR LOGIN' : 'NOVO OPERADOR'}
        </h2>
        <p className="text-xs text-[var(--dl-tactical-muted)] tracking-wider">
          {type === 'login' 
            ? 'Insira suas credenciais de acesso tático.' 
            : 'Registre seu codinome no sistema operacional.'}
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="p-3 mb-6 border border-dashed rounded bg-amber-500/10 border-amber-500/30">
          <p className="text-xs text-amber-400 font-medium tracking-wide uppercase text-center font-[Chakra_Petch]">
            ⚠️ SUPABASE OFFLINE — O terminal está rodando em modo sandbox. Cadastro e Login não funcionarão.
          </p>
        </div>
      )}

      {formError && (
        <div className="p-3.5 mb-6 border border-[var(--dl-tactical-red)] bg-[var(--dl-tactical-red)]/10 rounded flex items-center gap-2 [clip-path:var(--dl-cut-button)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--dl-tactical-red)] animate-ping shrink-0" />
          <p className="text-xs font-semibold text-[var(--dl-tactical-red)] tracking-wide font-[Chakra_Petch] uppercase">
            ERRO: {formError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="name" required className="text-[var(--dl-tactical-text)] font-[Chakra_Petch] tracking-wider uppercase text-xs">
                Nome do Operador
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: Elias Neto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading || !isSupabaseConfigured}
                required
                className="lowercase tracking-normal text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nickname" required className="text-[var(--dl-tactical-text)] font-[Chakra_Petch] tracking-wider uppercase text-xs">
                Nickname / Codinome
              </Label>
              <Input
                id="nickname"
                type="text"
                placeholder="Ex: dety_operator (sem espaços)"
                value={nickname}
                onChange={(e) => setNickname(e.target.value.replace(/\s/g, ''))}
                disabled={isLoading || !isSupabaseConfigured}
                required
                className="lowercase tracking-normal text-sm"
              />
              <span className="text-[10px] text-[var(--dl-tactical-muted)] uppercase tracking-wider block">
                * Usado em convites de lobby e conexões.
              </span>
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email" required className="text-[var(--dl-tactical-text)] font-[Chakra_Petch] tracking-wider uppercase text-xs">
            Endereço de E-mail
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="operador@duoloot.gg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || !isSupabaseConfigured}
            required
            className="lowercase tracking-normal text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" required className="text-[var(--dl-tactical-text)] font-[Chakra_Petch] tracking-wider uppercase text-xs">
            Senha de Acesso
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading || !isSupabaseConfigured}
            required
            className="text-sm"
          />
        </div>

        {type === 'register' && (
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" required className="text-[var(--dl-tactical-text)] font-[Chakra_Petch] tracking-wider uppercase text-xs">
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading || !isSupabaseConfigured}
              required
              className="text-sm"
            />
          </div>
        )}

        <Button
          type="submit"
          variant="tactical-green"
          disabled={isLoading || !isSupabaseConfigured}
          className="w-full mt-6 py-2.5 bg-[var(--dl-tactical-green)] hover:bg-[var(--dl-tactical-green)]/90 text-black font-bold uppercase font-[Chakra_Petch] tracking-widest text-xs flex justify-center items-center gap-2 [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              PROCESSANDO...
            </>
          ) : (
            type === 'login' ? 'INICIAR SESSÃO' : 'FINALIZAR REGISTRO'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs space-y-2">
        <p className="text-[var(--dl-tactical-muted)] uppercase tracking-wider font-semibold">
          {type === 'login' ? 'Novo por aqui?' : 'Já possui autorização?'}
        </p>
        <Link
          to={type === 'login' ? ROUTES.REGISTER : ROUTES.LOGIN}
          className="inline-block text-[var(--dl-tactical-green)] hover:underline font-bold uppercase tracking-widest font-[Chakra_Petch]"
        >
          {type === 'login' ? 'SOLICITAR CÓDIGO DE ACESSO' : 'ENTRAR NO GATE DE OPERADOR'}
        </Link>
      </div>
    </Card>
  );
};
