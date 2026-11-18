import { queryKeys } from '@/lib/queryKeys';
import { atualizarPreco } from '@/services';
import { useMutacao } from './useMutacao';

export function useAtualizarPreco() {
  return useMutacao(atualizarPreco, { invalida: [queryKeys.estoque.all], aviso: 'Preço atualizado.' });
}
