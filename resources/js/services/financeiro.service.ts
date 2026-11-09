import { http } from '@/lib/http';
import type { Categoria, NovaTransacao, Transacao } from '@/types';

export async function getCategorias(): Promise<Categoria[]> {
  return http.get<Categoria[]>('/api/categorias');
}

export async function getTransacoes(): Promise<Transacao[]> {
  return http.get<Transacao[]>('/api/transacoes');
}

export async function adicionarTransacao(transacao: NovaTransacao): Promise<void> {
  await http.post('/api/transacoes', transacao);
}
