import type { TipoMovimentacao } from '@/enums';

export interface ItemEstoque {
  id: number;
  nome: string;
  kg: number;
  preco_kg: number;
  fornecedor: string;
  estoque_minimo: number;
}

export interface MovimentacaoEstoque {
  id: number;
  tipo: TipoMovimentacao;
  quantidade: number;
}
