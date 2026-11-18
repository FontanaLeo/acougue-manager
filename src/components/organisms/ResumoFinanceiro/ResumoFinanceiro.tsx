import { CardResumo } from '@/components/molecules';
import { TipoTransacao } from '@/enums';
import { formatarMoeda } from '@/lib/formatters';
import type { Categoria, Transacao } from '@/types';

function saldo(transacoes: Transacao[]): number {
  return transacoes.reduce((total, transacao) => total + (transacao.tipo === TipoTransacao.RECEITA ? transacao.valor : -transacao.valor), 0);
}

interface ResumoFinanceiroProps {
  categorias: Categoria[];
  transacoes: Transacao[];
}

export function ResumoFinanceiro({ categorias, transacoes }: ResumoFinanceiroProps) {
  const cartoes = [
    ...categorias.map((categoria) => ({
      titulo: `Total ${categoria.nome}`,
      valor: saldo(transacoes.filter((transacao) => transacao.categoria_id === categoria.id)),
      destaque: false,
    })),
    { titulo: 'Saldo Líquido Geral', valor: saldo(transacoes), destaque: true },
  ];

  return (
    <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-[repeat(auto-fit,minmax(12rem,1fr))]">
      {cartoes.map((cartao) => (
        <CardResumo
          key={cartao.titulo}
          titulo={cartao.titulo}
          valor={formatarMoeda(cartao.valor)}
          tom={cartao.valor >= 0 ? 'positivo' : 'negativo'}
          destaque={cartao.destaque}
        />
      ))}
    </div>
  );
}
