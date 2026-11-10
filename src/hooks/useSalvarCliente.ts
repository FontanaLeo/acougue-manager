import { queryKeys } from '@/lib/queryKeys';
import { salvarCliente } from '@/services';
import { useMutacao } from './useMutacao';

export function useSalvarCliente() {
  return useMutacao(salvarCliente, {
    invalida: [queryKeys.clientes.all],
    aviso: (cliente) => (cliente.id === undefined ? 'Cliente adicionado.' : 'Dados do cliente atualizados.'),
  });
}
