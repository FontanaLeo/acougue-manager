import type { MotivoSaida, TipoMovimentacao } from '@/enums';

export interface ItemEstoque {
  id: number;
  nome: string;
  kg: number;
  preco_kg: number;
  fornecedor: string;
  estoque_minimo: number;
  custo_kg: number | null;
  custo_anterior_kg: number | null;
  margem_minima: number;
  lotes: { kg_atual: number; validade: string | null }[];
}

export type NovoProduto = Pick<ItemEstoque, 'nome' | 'preco_kg' | 'fornecedor' | 'estoque_minimo'>;

export type AlteracaoPreco = Pick<ItemEstoque, 'id' | 'preco_kg' | 'margem_minima'>;

interface MovimentacaoBase {
  id: number;
  quantidade: number;
}

interface EntradaEstoque extends MovimentacaoBase {
  tipo: TipoMovimentacao.ENTRADA;
  custo_kg: number;
  validade: string;
}

interface SaidaEstoque extends MovimentacaoBase {
  tipo: TipoMovimentacao.SAIDA;
  motivo: MotivoSaida;
}

export type MovimentacaoEstoque = EntradaEstoque | SaidaEstoque;
