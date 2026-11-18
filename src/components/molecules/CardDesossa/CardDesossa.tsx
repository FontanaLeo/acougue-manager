import { Card } from '@/components/atoms';
import { CabecalhoCard } from '@/components/molecules/CabecalhoCard/CabecalhoCard';
import { Dado } from '@/components/molecules/Dado/Dado';
import { analisarDesossa } from '@/lib/desossa';
import { formatarData, formatarKg, formatarMoeda, formatarPercentual } from '@/lib/formatters';
import type { Desossa } from '@/types';

interface CardDesossaProps {
  desossa: Desossa;
}

export function CardDesossa({ desossa }: CardDesossaProps) {
  const aproveitado = desossa.itens.reduce((total, item) => total + item.kg, 0);
  const { rendimento, sobraKg } = analisarDesossa(desossa.peso_kg, aproveitado);

  return (
    <Card>
      <CabecalhoCard titulo={desossa.descricao}>
        <span className="whitespace-nowrap text-xs text-stone-500">{formatarData(desossa.data)}</span>
      </CabecalhoCard>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-sm text-stone-500">Rendimento</span>
        <span className="text-2xl font-bold tabular-nums text-emerald-700">{formatarPercentual(rendimento)}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-stone-100" aria-hidden>
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(100, rendimento)}%` }} />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <Dado rotulo="Custo por kg aproveitado">{formatarMoeda(desossa.valor_total / aproveitado)}</Dado>
        <Dado rotulo="Osso, sebo e perda">{formatarKg(sobraKg)} kg</Dado>
        <Dado rotulo="Peça comprada" largo>{formatarKg(desossa.peso_kg)} kg por {formatarMoeda(desossa.valor_total)}</Dado>
      </dl>

      <ul className="mt-3 space-y-1 border-t border-stone-100 pt-2 text-sm">
        {desossa.itens.map((item) => (
          <li key={item.id} className="flex justify-between gap-2">
            <span>{item.produto.nome} · {formatarKg(item.kg)} kg</span>
            <span className="whitespace-nowrap font-semibold tabular-nums">{formatarMoeda(item.custo_kg)} / kg</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
