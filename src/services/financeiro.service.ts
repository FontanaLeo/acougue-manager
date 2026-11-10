import { semErro } from '@/lib/erros';
import { supabase } from '@/lib/supabase';
import type { Categoria, NovaCategoria, NovaTransacao, Transacao } from '@/types';

export function getCategorias(): Promise<Categoria[]> {
  return semErro(supabase.from('categorias').select('*').order('id').returns<Categoria[]>());
}

export async function adicionarCategoria(categoria: NovaCategoria): Promise<void> {
  await semErro(supabase.rpc('adicionar_categoria', { p_nome: categoria.nome, p_cor: categoria.cor }));
}

export function getTransacoes(): Promise<Transacao[]> {
  return semErro(
    supabase
      .from('transacoes')
      .select('id, categoria_id, tipo, descricao, valor, data, categoria:categorias(*)')
      .order('data', { ascending: false })
      .order('id', { ascending: false })
      .returns<Transacao[]>(),
  );
}

export async function adicionarTransacao(transacao: NovaTransacao): Promise<void> {
  await semErro(
    supabase.rpc('adicionar_transacao', {
      p_categoria_id: transacao.categoria_id,
      p_tipo: transacao.tipo,
      p_descricao: transacao.descricao,
      p_valor: transacao.valor,
    }),
  );
}
