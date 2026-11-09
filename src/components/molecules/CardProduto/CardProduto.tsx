import { Badge, Card } from '@/components/atoms';
import { formatarKg, formatarMoeda } from '@/lib/formatters';
import type { ItemEstoque } from '@/types';

const COR_ALERTA = '#b91c1c';

interface CardProdutoProps {
  item: ItemEstoque;
}

export function CardProduto({ item }: CardProdutoProps) {
  const estoqueBaixo = item.kg < item.estoque_minimo;

  return (
    <Card borda={estoqueBaixo ? 'negativa' : 'positiva'}>
      <div className="flex justify-between items-start gap-2">
        <h2 className="font-semibold text-lg">{item.nome}</h2>
        {estoqueBaixo && <Badge cor={COR_ALERTA}>Estoque baixo</Badge>}
      </div>
      <p className="text-3xl font-bold mt-2">
        {formatarKg(item.kg)} <span className="text-sm font-normal">kg</span>
      </p>
      <p className="text-gray-500 text-sm mt-1">{formatarMoeda(item.preco_kg)} / kg</p>
      <p className="text-gray-400 text-xs mt-1">Fornecedor: {item.fornecedor}</p>
    </Card>
  );
}
