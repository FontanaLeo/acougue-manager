import { useMutation } from '@tanstack/react-query';
import { entrar } from '@/services';

export function useEntrar() {
  return useMutation({ mutationFn: entrar });
}
