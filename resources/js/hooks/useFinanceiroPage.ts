import { useMemo, useState } from 'react';
import { TipoTransacao } from '@/enums';
import type { Categoria, ItemResumo, Transacao } from '@/types';
import { useGetCategorias } from './useGetCategorias';
import { useGetTransacoes } from './useGetTransacoes';

const SEM_CATEGORIAS: Categoria[] = [];
const SEM_TRANSACOES: Transacao[] = [];

function calcularSaldo(transacoes: Transacao[]): number {
  return transacoes.reduce(
    (saldo, transacao) => saldo + (transacao.tipo === TipoTransacao.RECEITA ? transacao.valor : -transacao.valor),
    0,
  );
}

export function useFinanceiroPage() {
  const categoriasQuery = useGetCategorias();
  const transacoesQuery = useGetTransacoes();
  // null significa "Todos".
  const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null);

  const categorias = categoriasQuery.data ?? SEM_CATEGORIAS;
  const transacoes = transacoesQuery.data ?? SEM_TRANSACOES;
  const carregado = Boolean(categoriasQuery.data && transacoesQuery.data);

  const resumo = useMemo<ItemResumo[]>(
    () => [
      ...categorias.map((categoria) => ({
        titulo: `Total ${categoria.nome}`,
        valor: calcularSaldo(transacoes.filter((transacao) => transacao.categoria_id === categoria.id)),
        destaque: false,
      })),
      { titulo: 'Saldo Líquido Geral', valor: calcularSaldo(transacoes), destaque: true },
    ],
    [categorias, transacoes],
  );

  const transacoesVisiveis = useMemo(
    () => (filtroCategoria === null
      ? transacoes
      : transacoes.filter((transacao) => transacao.categoria_id === filtroCategoria)),
    [transacoes, filtroCategoria],
  );

  const refetch = () => {
    void categoriasQuery.refetch();
    void transacoesQuery.refetch();
  };

  return {
    categorias,
    resumo,
    transacoes: transacoesVisiveis,
    filtroCategoria,
    setFiltroCategoria,
    carregado,
    isError: !carregado && (categoriasQuery.isError || transacoesQuery.isError),
    error: categoriasQuery.error ?? transacoesQuery.error,
    refetch,
  };
}
