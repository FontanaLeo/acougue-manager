import { useMutation, useQueryClient } from '@tanstack/react-query';
import { movimentarEstoque } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useMovimentarEstoque() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: movimentarEstoque,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.estoque.all });
    },
  });
}
