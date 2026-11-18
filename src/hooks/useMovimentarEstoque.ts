import { TipoMovimentacao } from '@/enums';
import { queryKeys } from '@/lib/queryKeys';
import { movimentarEstoque } from '@/services';
import { useMutacao } from './useMutacao';

export function useMovimentarEstoque() {
  return useMutacao(movimentarEstoque, {
    invalida: [queryKeys.estoque.all, queryKeys.lotes.all, queryKeys.perdas.all],
    aviso: (movimentacao) => (movimentacao.tipo === TipoMovimentacao.ENTRADA ? 'Entrada registrada.' : 'Saída registrada.'),
  });
}
