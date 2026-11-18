import { Badge, Button, Card } from '@/components/atoms';
import { BadgeValidade } from '@/components/molecules/BadgeValidade/BadgeValidade';
import { CabecalhoCard } from '@/components/molecules/CabecalhoCard/CabecalhoCard';
import { formatarData, formatarKg, formatarMoeda } from '@/lib/formatters';
import { estaVencido } from '@/lib/validade';
import type { Lote } from '@/types';

interface CardLoteProps {
  lote: Lote;
  onDarBaixa: (lote: Lote) => void;
}

export function CardLote({ lote, onDarBaixa }: CardLoteProps) {
  return (
    <Card>
      <CabecalhoCard titulo={lote.produto.nome} nivel="h3">
        {lote.validade ? <BadgeValidade validade={lote.validade} /> : <Badge>Sem validade</Badge>}
      </CabecalhoCard>
      <p className="mt-2 text-2xl font-bold tabular-nums text-stone-900">
        {formatarKg(lote.kg_atual)} <span className="text-sm font-normal text-stone-500">kg</span>
      </p>
      {lote.validade && <p className="mt-1 text-sm text-stone-600">Validade: {formatarData(lote.validade)}</p>}
      {lote.custo_kg !== null && <p className="mt-0.5 text-xs text-stone-500">Custo: {formatarMoeda(lote.custo_kg)} / kg</p>}
      {estaVencido(lote.validade) && (
        <div className="mt-auto pt-3">
          <Button variant="secondary" tamanho="sm" aria-label={`Dar baixa no lote vencido de ${lote.produto.nome}`} onClick={() => onDarBaixa(lote)}>
            Dar baixa
          </Button>
        </div>
      )}
    </Card>
  );
}
