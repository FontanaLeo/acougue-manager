import { supabase } from '@/lib/supabase';
import type { Categoria, NovaTransacao, Transacao } from '@/types';

export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase.from('categorias').select('*').order('id').returns<Categoria[]>();

  if (error) throw new Error(error.message);

  return data;
}

export async function getTransacoes(): Promise<Transacao[]> {
  const { data, error } = await supabase
    .from('transacoes')
    .select('id, categoria_id, tipo, descricao, valor, data, categoria:categorias(*)')
    .order('data', { ascending: false })
    .order('id', { ascending: false })
    .returns<Transacao[]>();

  if (error) throw new Error(error.message);

  return data;
}

export async function adicionarTransacao(transacao: NovaTransacao): Promise<void> {
  const { error } = await supabase.rpc('adicionar_transacao', {
    p_categoria_id: transacao.categoria_id,
    p_tipo: transacao.tipo,
    p_descricao: transacao.descricao,
    p_valor: transacao.valor,
  });

  if (error) throw new Error(error.message);
}
