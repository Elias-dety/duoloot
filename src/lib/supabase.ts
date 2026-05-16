import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente para conexão com o Supabase Backend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Flag booleana que indica se o projeto está corretamente integrado ao Supabase
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Instância global do cliente Supabase.
 * Se as variáveis de ambiente não estiverem configuradas, utiliza placeholders para evitar 
 * erros fatais de inicialização do SDK, permitindo que a UI trate a ausência de backend graciosamente.
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * Função utilitária para garantir que o backend está disponível antes de operações críticas.
 * Lança um erro descritivo caso a configuração falte.
 */
export const assertSupabaseConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Configuração do Supabase ausente. Verifique o arquivo .env');
  }
};

