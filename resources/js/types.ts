export interface ItemEstoque {
  id: number;
  nome: string;
  kg: number;
  preco_kg: number;
  fornecedor: string;
  estoque_minimo: number;
}

export interface MovimentarResponse {
  success: boolean;
  itens: ItemEstoque[];
  message?: string;
}
