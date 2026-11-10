import { queryKeys } from '@/lib/queryKeys';
import { anonimizarCliente } from '@/services';
import { useMutacao } from './useMutacao';

export function useAnonimizarCliente() {
  return useMutacao(anonimizarCliente, { invalida: [queryKeys.clientes.all], aviso: 'Dados do cliente excluídos.' });
}
