import { useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useAvisar } from './useAvisar';

interface OpcoesMutacao<V> {
  // Listas que mudam com a ação e precisam ser recarregadas.
  invalida: QueryKey[];
  aviso: string | ((variaveis: V) => string);
  // Espera a recarga antes de concluir, para a tela seguinte já encontrar o item novo.
  esperarRecarga?: boolean;
}

// Toda ação que grava passa por aqui: recarrega as listas e mostra o aviso de sucesso,
// mesmo que a janela seja fechada antes da resposta.
export function useMutacao<V, R = void>(
  mutationFn: (variaveis: V) => Promise<R>,
  { invalida, aviso, esperarRecarga = false }: OpcoesMutacao<V>,
) {
  const queryClient = useQueryClient();
  const avisar = useAvisar();

  return useMutation({
    mutationFn,
    onSuccess: async (_resultado, variaveis) => {
      const recarga = Promise.all(invalida.map((queryKey) => queryClient.invalidateQueries({ queryKey })));

      if (esperarRecarga) await recarga;
      avisar(typeof aviso === 'string' ? aviso : aviso(variaveis));
    },
  });
}
