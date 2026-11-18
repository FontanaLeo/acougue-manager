import { useQuery } from '@tanstack/react-query';
import { getEstoque } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useGetEstoque() {
  return useQuery({
    queryKey: queryKeys.estoque.all,
    queryFn: getEstoque,
  });
}
