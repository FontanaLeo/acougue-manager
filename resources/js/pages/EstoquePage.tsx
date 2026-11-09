import { useState } from 'react';
import { Button, Mensagem } from '@/components/atoms';
import { ErroConsulta } from '@/components/molecules';
import { ListaEstoque, MovimentarEstoqueModal } from '@/components/organisms';
import { useGetEstoque, useTituloPagina } from '@/hooks';

export default function EstoquePage() {
  useTituloPagina('Estoque');
  const { data: itens, isPending, isError, error, refetch } = useGetEstoque();
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Controle de Estoque</h1>
        <Button disabled={!itens?.length} onClick={() => setModalAberto(true)}>+ Movimentar Estoque</Button>
      </div>

      {isPending && <Mensagem>Carregando estoque...</Mensagem>}
      {isError && !itens && <ErroConsulta mensagem={error.message} onTentarDeNovo={() => void refetch()} />}
      {itens && <ListaEstoque itens={itens} />}

      {modalAberto && itens && <MovimentarEstoqueModal itens={itens} onClose={() => setModalAberto(false)} />}
    </>
  );
}
