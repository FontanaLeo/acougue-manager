import { queryKeys } from '@/lib/queryKeys';
import { registrarDesossa } from '@/services';
import { useMutacao } from './useMutacao';

export function useRegistrarDesossa() {
  return useMutacao(registrarDesossa, {
    invalida: [queryKeys.desossas.all, queryKeys.estoque.all, queryKeys.lotes.all],
    aviso: 'Desossa registrada. Os cortes entraram no estoque.',
  });
}
