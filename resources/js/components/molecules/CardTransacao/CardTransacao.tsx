import { Badge, Card } from '@/components/atoms';
import { TipoTransacao } from '@/enums';
import { formatarData, formatarMoeda } from '@/lib/formatters';
import type { Transacao } from '@/types';

interface CardTransacaoProps {
  transacao: Transacao;
}

export function CardTransacao({ transacao }: CardTransacaoProps) {
  const receita = transacao.tipo === TipoTransacao.RECEITA;

  return (
    <Card borda={receita ? 'positiva' : 'negativa'}>
      <div className="flex justify-between items-start gap-2">
        <h2 className="font-semibold text-lg">{transacao.descricao}</h2>
        <Badge cor={transacao.categoria.cor}>{transacao.categoria.nome}</Badge>
      </div>
      <p className={`text-2xl font-bold mt-2 ${receita ? 'text-green-700' : 'text-red-700'}`}>
        {receita ? '+' : '-'} {formatarMoeda(transacao.valor)}
      </p>
      <p className="text-gray-400 text-xs mt-1">{formatarData(transacao.data)}</p>
    </Card>
  );
}
