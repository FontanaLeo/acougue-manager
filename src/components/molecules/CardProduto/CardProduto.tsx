import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { Badge, Button, Card } from '@/components/atoms';
import { BadgeValidade } from '@/components/molecules/BadgeValidade/BadgeValidade';
import { CabecalhoCard } from '@/components/molecules/CabecalhoCard/CabecalhoCard';
import { TipoMovimentacao } from '@/enums';
import { estoqueBaixo } from '@/lib/estoque';
import { formatarKg, formatarMoeda } from '@/lib/formatters';
import { proximaValidade } from '@/lib/validade';
import type { ItemEstoque } from '@/types';

interface CardProdutoProps {
  item: ItemEstoque;
  onMovimentar: (item: ItemEstoque, tipo: TipoMovimentacao) => void;
}

export function CardProduto({ item, onMovimentar }: CardProdutoProps) {
  const baixo = estoqueBaixo(item);
  const validade = proximaValidade(item.lotes);
  // A barra cheia representa o dobro do estoque mínimo.
  const nivel = item.estoque_minimo > 0 ? Math.min(100, (item.kg / (item.estoque_minimo * 2)) * 100) : 100;

  return (
    <Card>
      <CabecalhoCard titulo={item.nome}>
        <div className="flex flex-wrap justify-end gap-1">
          {validade && <BadgeValidade validade={validade} somenteAlerta />}
          {baixo && <Badge tom="perigo">Estoque baixo</Badge>}
        </div>
      </CabecalhoCard>

      <p className="mt-2 text-3xl font-bold tabular-nums text-stone-900">
        {formatarKg(item.kg)} <span className="text-sm font-normal text-stone-500">kg</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100" aria-hidden>
        <div className={`h-full rounded-full ${baixo ? 'bg-red-600' : 'bg-emerald-600'}`} style={{ width: `${nivel}%` }} />
      </div>
      <p className="mt-1.5 text-xs text-stone-500">Mínimo: {formatarKg(item.estoque_minimo)} kg</p>

      <p className="mt-2 text-sm font-medium tabular-nums text-stone-700">{formatarMoeda(item.preco_kg)} / kg</p>
      <p className="text-xs text-stone-500">Fornecedor: {item.fornecedor}</p>

      <div className="mt-auto flex gap-2 pt-3">
        <Button
          variant="secondary"
          tamanho="sm"
          icone={ArrowDownToLine}
          aria-label={`Registrar entrada de ${item.nome}`}
          onClick={() => onMovimentar(item, TipoMovimentacao.ENTRADA)}
        >
          Entrada
        </Button>
        <Button
          variant="secondary"
          tamanho="sm"
          icone={ArrowUpFromLine}
          aria-label={`Registrar saída de ${item.nome}`}
          onClick={() => onMovimentar(item, TipoMovimentacao.SAIDA)}
        >
          Saída
        </Button>
      </div>
    </Card>
  );
}
