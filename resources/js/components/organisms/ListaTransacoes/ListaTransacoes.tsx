import { Mensagem } from '@/components/atoms';
import { CardTransacao } from '@/components/molecules';
import type { Transacao } from '@/types';

interface ListaTransacoesProps {
  transacoes: Transacao[];
  mensagemVazia: string;
}

export function ListaTransacoes({ transacoes, mensagemVazia }: ListaTransacoesProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {transacoes.length === 0 && <Mensagem>{mensagemVazia}</Mensagem>}
      {transacoes.map((transacao) => <CardTransacao key={transacao.id} transacao={transacao} />)}
    </div>
  );
}
