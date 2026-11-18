import { useQuery } from '@tanstack/react-query';
import { getLotes } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useGetLotes() {
  return useQuery({
    queryKey: queryKeys.lotes.all,
    queryFn: getLotes,
  });
}
