import { useContext } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';

/**
 * Hook customizado para consumir o contexto de autenticação global com facilidade.
 * Garante que o contexto esteja configurado e fornece tipagem estrita para a sessão.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser utilizado obrigatoriamente dentro de um AuthProvider.');
  }
  
  return context;
};
