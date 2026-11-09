import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sair } from '@/services';

export function useSair() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sair,
    onSuccess: () => queryClient.clear(),
  });
}
