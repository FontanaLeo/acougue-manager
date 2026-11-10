import { useGetCategorias } from './useGetCategorias';
import { useGetTransacoes } from './useGetTransacoes';

// Junta as duas consultas do Financeiro: só há dados quando as duas chegam.
export function useFinanceiroPage() {
  const categorias = useGetCategorias();
  const transacoes = useGetTransacoes();

  return {
    data: categorias.data && transacoes.data ? { categorias: categorias.data, transacoes: transacoes.data } : undefined,
    error: categorias.error ?? transacoes.error,
    refetch: () => {
      void categorias.refetch();
      void transacoes.refetch();
    },
  };
}
