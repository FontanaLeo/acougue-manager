import { queryKeys } from '@/lib/queryKeys';
import { adicionarProduto } from '@/services';
import { useMutacao } from './useMutacao';

export function useAdicionarProduto() {
  // Espera a recarga para o produto novo já aparecer na janela da primeira entrada.
  return useMutacao(adicionarProduto, {
    invalida: [queryKeys.estoque.all],
    aviso: 'Produto cadastrado. Agora registre a primeira entrada.',
    esperarRecarga: true,
  });
}
