import { useQuery } from '@tanstack/react-query';
import { getEmpresa } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useGetEmpresa() {
  return useQuery({
    queryKey: queryKeys.empresa.all,
    queryFn: getEmpresa,
  });
}
