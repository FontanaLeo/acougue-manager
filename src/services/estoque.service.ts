import { MotivoSaida, TipoMovimentacao } from '@/enums';
import { semErro } from '@/lib/erros';
import { supabase } from '@/lib/supabase';
import { inicioDoMesISO } from '@/lib/validade';
import type { AlteracaoPreco, ItemEstoque, Lote, MovimentacaoEstoque, NovoProduto, Perda } from '@/types';

export function getEstoque(): Promise<ItemEstoque[]> {
  return semErro(
    supabase
      .from('produtos')
      .select('*, lotes(kg_atual, validade)')
      // Só os lotes com saldo: a tela usa apenas a validade do que ainda está em estoque.
      .gt('lotes.kg_atual', 0)
      .order('id')
      .returns<ItemEstoque[]>(),
  );
}

// Devolve o id para a tela já abrir a primeira entrada do produto.
export async function adicionarProduto(produto: NovoProduto): Promise<number> {
  const id = await semErro(
    supabase.rpc('adicionar_produto', {
      p_nome: produto.nome,
      p_preco_kg: produto.preco_kg,
      p_fornecedor: produto.fornecedor,
      p_estoque_minimo: produto.estoque_minimo,
    }),
  );

  return Number(id);
}

export async function movimentarEstoque(movimentacao: MovimentacaoEstoque): Promise<void> {
  await semErro(
    movimentacao.tipo === TipoMovimentacao.ENTRADA
      ? supabase.rpc('registrar_entrada', {
          p_produto_id: movimentacao.id,
          p_quantidade: movimentacao.quantidade,
          p_custo_kg: movimentacao.custo_kg,
          p_validade: movimentacao.validade,
        })
      : supabase.rpc('registrar_saida', {
          p_produto_id: movimentacao.id,
          p_quantidade: movimentacao.quantidade,
          p_motivo: movimentacao.motivo,
        }),
  );
}

export async function atualizarPreco(alteracao: AlteracaoPreco): Promise<void> {
  await semErro(
    supabase.rpc('atualizar_preco', {
      p_produto_id: alteracao.id,
      p_preco_kg: alteracao.preco_kg,
      p_margem_minima: alteracao.margem_minima,
    }),
  );
}

export function getLotes(): Promise<Lote[]> {
  return semErro(
    supabase
      .from('lotes')
      .select('id, produto_id, kg_atual, custo_kg, validade, produto:produtos(nome)')
      .gt('kg_atual', 0)
      .order('validade', { ascending: true, nullsFirst: true })
      .order('id')
      .returns<Lote[]>(),
  );
}

export function getPerdasDoMes(): Promise<Perda[]> {
  return semErro(
    supabase
      .from('saidas')
      .select('motivo, kg, custo_total')
      .neq('motivo', MotivoSaida.VENDA)
      .gte('data', inicioDoMesISO())
      .returns<Perda[]>(),
  );
}
