import { Mensagem } from '@/components/atoms';
import { CardProduto } from '@/components/molecules';
import type { ItemEstoque } from '@/types';

interface ListaEstoqueProps {
  itens: ItemEstoque[];
}

export function ListaEstoque({ itens }: ListaEstoqueProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {itens.length === 0 && <Mensagem>Nenhum produto cadastrado.</Mensagem>}
      {itens.map((item) => <CardProduto key={item.id} item={item} />)}
    </div>
  );
}
