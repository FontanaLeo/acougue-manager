import { TipoLancamentoFiado } from '@/enums';
import { ANOS_DE_GUARDA, saldoCliente } from '@/lib/fiado';
import { formatarData, formatarMoeda, formatarMoedaComSinal, formatarTelefone } from '@/lib/formatters';
import { hojeISO } from '@/lib/validade';
import type { Cliente, Empresa } from '@/types';

interface RelatorioClienteProps {
  cliente: Cliente;
  empresa: Empresa | null;
}

export function RelatorioCliente({ cliente, empresa }: RelatorioClienteProps) {
  const lancamentos = [...cliente.lancamentos].sort((a, b) => a.id - b.id);
  const linhas = [
    { titulo: 'Responsável pelos dados', texto: empresa ? `${empresa.nome} (${empresa.contato})` : 'Preencha os dados do açougue em Privacidade.' },
    { titulo: 'Nome', texto: cliente.nome },
    { titulo: 'Telefone', texto: cliente.telefone ? formatarTelefone(cliente.telefone) : 'Não informado' },
    { titulo: 'De onde vieram', texto: 'Informados pelo próprio cliente no açougue.' },
    { titulo: 'Para que são usados', texto: 'Controle de compras a prazo, pagamentos e lembretes de valores em aberto.' },
    { titulo: 'Com quem são compartilhados', texto: 'Supabase (armazenamento) e WhatsApp (somente quando um lembrete é enviado).' },
    { titulo: 'Por quanto tempo', texto: `Enquanto houver dívida e por até ${ANOS_DE_GUARDA} anos depois da última movimentação.` },
    { titulo: 'Saldo atual', texto: formatarMoeda(saldoCliente(cliente)) },
  ];

  return (
    <div className="space-y-4 text-sm text-stone-800">
      <div>
        <p className="text-lg font-bold text-stone-900">Dados pessoais de {cliente.nome}</p>
        <p className="text-stone-500">Emitido em {formatarData(hojeISO())}</p>
      </div>

      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[11rem_1fr] print:grid-cols-[11rem_1fr]">
        {linhas.map((linha) => (
          <div key={linha.titulo} className="contents">
            <dt className="font-medium text-stone-500">{linha.titulo}</dt>
            <dd className="break-words">{linha.texto}</dd>
          </div>
        ))}
      </dl>

      <div>
        <p className="mb-1 font-semibold text-stone-900">Movimentações</p>
        {lancamentos.length === 0 ? (
          <p className="text-stone-500">Nenhuma movimentação registrada.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="text-stone-500">
              <tr><th className="py-1 font-medium">Data</th><th className="py-1 font-medium">Descrição</th><th className="py-1 text-right font-medium">Valor</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {lancamentos.map((lancamento) => (
                <tr key={lancamento.id}>
                  <td className="whitespace-nowrap py-1 pr-3 tabular-nums">{formatarData(lancamento.data)}</td>
                  <td className="break-words py-1 pr-3">{lancamento.descricao}</td>
                  <td className="whitespace-nowrap py-1 text-right tabular-nums">
                    {formatarMoedaComSinal(lancamento.valor, lancamento.tipo === TipoLancamentoFiado.COMPRA)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
