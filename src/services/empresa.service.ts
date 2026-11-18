import { semErro } from '@/lib/erros';
import { supabase } from '@/lib/supabase';
import type { Empresa } from '@/types';

export function getEmpresa(): Promise<Empresa | null> {
  return semErro(supabase.from('empresa').select('nome, contato').maybeSingle<Empresa>());
}

export async function salvarEmpresa(empresa: Empresa): Promise<void> {
  await semErro(supabase.rpc('salvar_empresa', { p_nome: empresa.nome, p_contato: empresa.contato }));
}
