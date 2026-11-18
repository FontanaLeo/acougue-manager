import { useQuery } from '@tanstack/react-query';
import { getPerdasDoMes } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useGetPerdasDoMes() {
  return useQuery({
    queryKey: queryKeys.perdas.all,
    queryFn: getPerdasDoMes,
  });
}
