import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { AuthForm } from '@/features/auth/components/AuthForm';
import { isSupabaseConfigured } from '@/lib/supabase';
import { ROUTES } from '@/constants/routes';

export const RegisterPage: React.FC = () => {
  const { signUp, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const navigate = useNavigate();

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleRegister = async (data: any) => {
    setIsLoading(true);
    try {
      const result = await signUp(data.email, data.password, {
        name: data.name,
        nickname: data.nickname
      });

      if (result.success) {
        if (result.sessionCreated) {
          navigate(ROUTES.DASHBOARD, { replace: true });
        } else {
          setRegisteredEmail(data.email);
          setNeedsVerification(true);
        }
      }
      return result;
    } catch (err: any) {
      return { success: false, error: err.message || 'Falha na conexão com o terminal.' };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#07090e]">
      {/* Detalhes táticos decorativos no fundo */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none bg-[radial-gradient(ellipse_at_center,var(--dl-tactical-green)_0%,transparent_70%)]" />
      
      {/* Elementos de Grid Tático */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="w-full flex justify-center z-10">
        {needsVerification ? (
          <div className="w-full max-w-md border-[var(--dl-tactical-line)] bg-black/60 p-8 backdrop-blur-md relative overflow-hidden [clip-path:polygon(0_0,100%_0,100%_calc(100%-15px),calc(100%-15px)_100%,0_100%)] text-center space-y-6">
            {/* Indicador Tático */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--dl-tactical-green)]" />
            
            <div className="inline-block p-4 bg-[var(--dl-tactical-green)]/10 border border-[var(--dl-tactical-green)]/30 rounded-full animate-pulse">
              <span className="text-3xl text-[var(--dl-tactical-green)]">📬</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold uppercase text-[var(--dl-tactical-text)] font-[Chakra_Petch] tracking-widest">
                VERIFICAÇÃO ENVIADA
              </h2>
              <p className="text-xs text-[var(--dl-tactical-muted)] tracking-wider uppercase font-semibold">
                CÓDIGO OPERACIONAL ENVIADO PARA:
              </p>
              <p className="text-sm font-bold text-[var(--dl-tactical-green)] tracking-wide select-all bg-black/40 px-3 py-1.5 border border-[var(--dl-tactical-line)] inline-block rounded font-[Chakra_Petch]">
                {registeredEmail}
              </p>
            </div>

            <div className="border-t border-[var(--dl-tactical-line)] pt-4 text-xs text-[var(--dl-tactical-muted)] leading-relaxed space-y-3">
              <p>
                Acesse sua caixa de entrada e clique no link de validação para descriptografar e liberar sua conta no Duo Loot.
              </p>
              <p className="text-[10px] text-amber-500/80 uppercase font-semibold">
                * Caso não encontre, verifique sua pasta de spam ou lixo eletrônico.
              </p>
            </div>

            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="w-full py-2 bg-transparent border border-[var(--dl-tactical-green)] text-[var(--dl-tactical-green)] hover:bg-[var(--dl-tactical-green)]/10 font-bold uppercase font-[Chakra_Petch] tracking-widest text-xs [clip-path:polygon(0_0,100%_0,95%_100%,5%_100%)] transition-all"
            >
              VOLTAR PARA O LOGIN
            </button>
          </div>
        ) : (
          <AuthForm
            type="register"
            onSubmit={handleRegister}
            isLoading={isLoading || authLoading}
            isSupabaseConfigured={isSupabaseConfigured}
          />
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
