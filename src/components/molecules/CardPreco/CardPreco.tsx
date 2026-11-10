import { Pencil } from 'lucide-react';
import { Badge, Button, Card } from '@/components/atoms';
import { CabecalhoCard } from '@/components/molecules/CabecalhoCard/CabecalhoCard';
import { Dado } from '@/components/molecules/Dado/Dado';
import { formatarMoeda, formatarPercentual } from '@/lib/formatters';
import { analisarMargem } from '@/lib/margem';
import type { ItemEstoque } from '@/types';

interface CardPrecoProps {
  item: ItemEstoque;
  onAlterar: (item: ItemEstoque) => void;
}

export function CardPreco({ item, onAlterar }: CardPrecoProps) {
  const analise = analisarMargem(item);

  return (
    <Card>
      <CabecalhoCard titulo={item.nome}>{analise?.defasado && <Badge tom="perigo">Preço defasado</Badge>}</CabecalhoCard>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <Dado rotulo="Venda / kg">{formatarMoeda(item.preco_kg)}</Dado>
        <Dado rotulo="Custo / kg">{analise ? formatarMoeda(analise.custoKg) : 'Sem custo'}</Dado>
        {analise && (
          <>
            <Dado rotulo="Margem" className={`text-xl font-bold tabular-nums ${analise.defasado ? 'text-red-700' : 'text-emerald-700'}`}>
              {formatarPercentual(analise.margem)}
            </Dado>
            <Dado rotulo="Lucro / kg" className="text-xl font-bold tabular-nums text-stone-900">{formatarMoeda(analise.lucroKg)}</Dado>
          </>
        )}
      </dl>

      {!analise && <p className="mt-3 text-sm text-stone-500">Registre uma entrada com o custo para ver a margem.</p>}
      {analise && analise.aumentoCusto > 0 && (
        <p className="mt-3 text-sm font-medium text-amber-800">O fornecedor aumentou {formatarMoeda(analise.aumentoCusto)} / kg.</p>
      )}
      {analise?.defasado && (
        <p className="mt-1 text-sm text-stone-600">
          Para a margem mínima de {formatarPercentual(item.margem_minima)}, venda por <strong className="tabular-nums">{formatarMoeda(analise.precoSugerido)}</strong>.
        </p>
      )}

      <div className="mt-auto flex justify-end pt-3">
        <Button variant="secondary" tamanho="sm" icone={Pencil} aria-label={`Alterar preço de ${item.nome}`} onClick={() => onAlterar(item)}>
          Alterar preço
        </Button>
      </div>
    </Card>
  );
}
