import { useMutation } from '@tanstack/react-query';
import { sair } from '@/services';

export function useSair() {
  return useMutation({ mutationFn: sair });
}
