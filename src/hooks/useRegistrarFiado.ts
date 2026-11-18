import { TipoLancamentoFiado } from '@/enums';
import { queryKeys } from '@/lib/queryKeys';
import { registrarFiado } from '@/services';
import { useMutacao } from './useMutacao';

export function useRegistrarFiado() {
  return useMutacao(registrarFiado, {
    invalida: [queryKeys.clientes.all],
    aviso: (lancamento) => (lancamento.tipo === TipoLancamentoFiado.PAGAMENTO ? 'Pagamento registrado.' : 'Compra registrada.'),
  });
}
