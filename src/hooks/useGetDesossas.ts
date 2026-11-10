import { useQuery } from '@tanstack/react-query';
import { getDesossas } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useGetDesossas() {
  return useQuery({
    queryKey: queryKeys.desossas.all,
    queryFn: getDesossas,
  });
}
