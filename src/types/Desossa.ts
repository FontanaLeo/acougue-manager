export interface ItemDesossa {
  id: number;
  kg: number;
  custo_kg: number;
  produto: { nome: string };
}

export interface Desossa {
  id: number;
  descricao: string;
  peso_kg: number;
  valor_total: number;
  data: string;
  itens: ItemDesossa[];
}

export interface NovaDesossa {
  descricao: string;
  peso_kg: number;
  valor_total: number;
  validade: string;
  itens: { produto_id: number; kg: number }[];
}
