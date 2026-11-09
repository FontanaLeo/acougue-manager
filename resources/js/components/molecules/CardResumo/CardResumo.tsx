import { Card } from '@/components/atoms';
import { formatarMoeda } from '@/lib/formatters';
import type { ItemResumo } from '@/types';

interface CardResumoProps {
  item: ItemResumo;
}

export function CardResumo({ item }: CardResumoProps) {
  return (
    <Card borda={item.destaque ? 'destaque' : undefined}>
      <p className="text-gray-500 text-sm">{item.titulo}</p>
      <p className={`text-2xl font-bold ${item.valor >= 0 ? 'text-green-700' : 'text-red-700'}`}>
        {formatarMoeda(item.valor)}
      </p>
    </Card>
  );
}
