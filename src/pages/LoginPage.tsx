import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { AuthForm } from '@/features/auth/components/AuthForm';
import { isSupabaseConfigured } from '@/lib/supabase';
import { ROUTES } from '@/constants/routes';

export const LoginPage: React.FC = () => {
  const { signIn, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Obtém a rota para a qual o operador estava tentando navegar originalmente
  const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    try {
      const result = await signIn(data.email, data.password);
      if (result.success) {
        navigate(from, { replace: true });
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
        <AuthForm
          type="login"
          onSubmit={handleLogin}
          isLoading={isLoading || authLoading}
          isSupabaseConfigured={isSupabaseConfigured}
        />
      </div>
    </div>
  );
};

export default LoginPage;
