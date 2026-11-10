import { queryKeys } from '@/lib/queryKeys';
import { adicionarCategoria } from '@/services';
import { useMutacao } from './useMutacao';

export function useAdicionarCategoria() {
  // Espera a recarga para o botão de novo lançamento já aparecer liberado.
  return useMutacao(adicionarCategoria, { invalida: [queryKeys.categorias.all], aviso: 'Categoria criada.', esperarRecarga: true });
}
