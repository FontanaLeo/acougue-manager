import { queryKeys } from '@/lib/queryKeys';
import { salvarEmpresa } from '@/services';
import { useMutacao } from './useMutacao';

export function useSalvarEmpresa() {
  return useMutacao(salvarEmpresa, { invalida: [queryKeys.empresa.all], aviso: 'Dados do açougue salvos.' });
}
