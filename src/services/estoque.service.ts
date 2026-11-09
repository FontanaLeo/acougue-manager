import { supabase } from '@/lib/supabase';
import type { ItemEstoque, MovimentacaoEstoque } from '@/types';

export async function getEstoque(): Promise<ItemEstoque[]> {
  const { data, error } = await supabase.from('produtos').select('*').order('id').returns<ItemEstoque[]>();

  if (error) throw new Error(error.message);

  return data;
}

export async function movimentarEstoque(movimentacao: MovimentacaoEstoque): Promise<void> {
  const { error } = await supabase.rpc('movimentar_estoque', {
    p_produto_id: movimentacao.id,
    p_tipo: movimentacao.tipo,
    p_quantidade: movimentacao.quantidade,
  });

  if (error) throw new Error(error.message);
}
