import { queryKeys } from '@/lib/queryKeys';
import { adicionarTransacao } from '@/services';
import { useMutacao } from './useMutacao';

export function useAdicionarTransacao() {
  return useMutacao(adicionarTransacao, { invalida: [queryKeys.transacoes.all], aviso: 'Lançamento adicionado.' });
}
