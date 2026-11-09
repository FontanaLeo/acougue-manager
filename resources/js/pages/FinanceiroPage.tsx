import { useState } from 'react';
import { Button, Mensagem } from '@/components/atoms';
import { ErroConsulta } from '@/components/molecules';
import { FiltrosCategoria, ListaTransacoes, NovaTransacaoModal, ResumoFinanceiro } from '@/components/organisms';
import { useFinanceiroPage, useTituloPagina } from '@/hooks';

export default function FinanceiroPage() {
  useTituloPagina('Financeiro');
  const {
    categorias,
    resumo,
    transacoes,
    filtroCategoria,
    setFiltroCategoria,
    carregado,
    isError,
    error,
    refetch,
  } = useFinanceiroPage();
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestão Financeira Unificada</h1>
        <Button disabled={categorias.length === 0} onClick={() => setModalAberto(true)}>+ Novo lançamento</Button>
      </div>

      {isError && <ErroConsulta mensagem={error?.message ?? 'Erro ao carregar os dados.'} onTentarDeNovo={refetch} />}
      {!isError && !carregado && <Mensagem>Carregando lançamentos...</Mensagem>}
      {carregado && (
        <>
          <ResumoFinanceiro resumo={resumo} />
          <FiltrosCategoria categorias={categorias} filtro={filtroCategoria} onChange={setFiltroCategoria} />
          <ListaTransacoes
            transacoes={transacoes}
            mensagemVazia={filtroCategoria === null ? 'Nenhum lançamento cadastrado.' : 'Nenhum lançamento nesta categoria.'}
          />
        </>
      )}

      {modalAberto && <NovaTransacaoModal categorias={categorias} onClose={() => setModalAberto(false)} />}
    </>
  );
}
