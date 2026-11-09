import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Credenciais } from '@/types';

export async function entrar({ email, senha }: Credenciais): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error?.code === 'invalid_credentials') throw new Error('E-mail ou senha incorretos.');
  if (error) throw new Error('Não foi possível entrar. Tente novamente.');
}

export async function sair(): Promise<void> {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error('Não foi possível sair. Tente novamente.');
}

export function observarSessao(aoMudar: (sessao: Session | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => aoMudar(sessao));

  return () => data.subscription.unsubscribe();
}
