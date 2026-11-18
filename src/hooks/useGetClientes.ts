import { useQuery } from '@tanstack/react-query';
import { getClientes } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useGetClientes() {
  return useQuery({
    queryKey: queryKeys.clientes.all,
    queryFn: getClientes,
  });
}
