import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adicionarTransacao } from '@/services';
import { queryKeys } from '@/lib/queryKeys';

export function useAdicionarTransacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adicionarTransacao,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.transacoes.all });
    },
  });
}
