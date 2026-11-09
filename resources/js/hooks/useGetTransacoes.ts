import { useQuery } from '@tanstack/react-query';
import { getTransacoes } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useGetTransacoes() {
  return useQuery({
    queryKey: queryKeys.transacoes.all,
    queryFn: getTransacoes,
  });
}
