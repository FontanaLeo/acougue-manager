import { http } from '@/lib/http';
import type { ItemEstoque, MovimentacaoEstoque } from '@/types';

export async function getEstoque(): Promise<ItemEstoque[]> {
  return http.get<ItemEstoque[]>('/api/estoque');
}

export async function movimentarEstoque(movimentacao: MovimentacaoEstoque): Promise<void> {
  await http.post('/api/estoque/movimentar', movimentacao);
}
