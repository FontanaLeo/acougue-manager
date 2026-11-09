import { useQuery } from '@tanstack/react-query';
import { getCategorias } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useGetCategorias() {
  return useQuery({
    queryKey: queryKeys.categorias.all,
    queryFn: getCategorias,
  });
}
