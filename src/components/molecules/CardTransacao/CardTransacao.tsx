import { Badge, Card } from '@/components/atoms';
import { CabecalhoCard } from '@/components/molecules/CabecalhoCard/CabecalhoCard';
import { TipoTransacao } from '@/enums';
import { formatarData, formatarMoedaComSinal } from '@/lib/formatters';
import type { Transacao } from '@/types';

interface CardTransacaoProps {
  transacao: Transacao;
}

export function CardTransacao({ transacao }: CardTransacaoProps) {
  const receita = transacao.tipo === TipoTransacao.RECEITA;

  return (
    <Card>
      <CabecalhoCard titulo={transacao.descricao}>
        <Badge cor={transacao.categoria.cor}>{transacao.categoria.nome}</Badge>
      </CabecalhoCard>
      <p className={`mt-2 text-2xl font-bold tabular-nums ${receita ? 'text-emerald-700' : 'text-red-700'}`}>
        {formatarMoedaComSinal(transacao.valor, receita)}
      </p>
      <p className="mt-1 text-xs text-stone-500">{formatarData(transacao.data)}</p>
    </Card>
  );
}
