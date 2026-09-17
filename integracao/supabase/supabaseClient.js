// supabaseClient.js
// Inicializa o cliente Supabase a partir de variáveis de ambiente.
//
// SEGURANÇA:
// - Use SEMPRE a chave "anon" aqui (é a única segura para o navegador).
// - NUNCA importe/exponha a "service_role key" no frontend: ela ignora
//   todas as políticas de RLS e dá acesso total ao banco.
// - As variáveis NEXT_PUBLIC_* são lidas pelo Vite durante o build.
// - A chave publishable/anon pode existir no navegador; a segurança dos
//   dados depende das políticas RLS. Nunca use a service_role aqui.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente do Supabase não configuradas (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
