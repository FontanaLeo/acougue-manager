import { HandCoins, MessageCircle, Plus } from 'lucide-react';
import { Badge, Button, Card, classesBotao } from '@/components/atoms';
import { CabecalhoCard } from '@/components/molecules/CabecalhoCard/CabecalhoCard';
import { TipoLancamentoFiado } from '@/enums';
import { estaDevendo, linkLembreteWhatsApp, saldoCliente } from '@/lib/fiado';
import { formatarData, formatarMoeda, formatarMoedaComSinal, formatarTelefone } from '@/lib/formatters';
import type { Cliente } from '@/types';

interface CardClienteProps {
  cliente: Cliente;
  onLancar: (cliente: Cliente, tipo: TipoLancamentoFiado) => void;
  onEditar: (cliente: Cliente) => void;
  onVerDados: (cliente: Cliente) => void;
  onExcluir: (cliente: Cliente) => void;
}

export function CardCliente({ cliente, onLancar, onEditar, onVerDados, onExcluir }: CardClienteProps) {
  const deve = estaDevendo(cliente);
  const historico = [...cliente.lancamentos].sort((a, b) => b.id - a.id);

  return (
    <Card>
      <CabecalhoCard titulo={cliente.nome} subtitulo={cliente.telefone ? formatarTelefone(cliente.telefone) : undefined}>
        <Badge tom={deve ? 'alerta' : 'sucesso'}>{deve ? 'Deve' : 'Sem dívida'}</Badge>
      </CabecalhoCard>

      <p className={`mt-2 text-2xl font-bold tabular-nums ${deve ? 'text-red-700' : 'text-emerald-700'}`}>{formatarMoeda(saldoCliente(cliente))}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          tamanho="sm"
          icone={Plus}
          aria-label={`Registrar compra de ${cliente.nome}`}
          onClick={() => onLancar(cliente, TipoLancamentoFiado.COMPRA)}
        >
          Compra
        </Button>
        <Button
          variant="secondary"
          tamanho="sm"
          icone={HandCoins}
          disabled={!deve}
          aria-label={`Registrar pagamento de ${cliente.nome}`}
          onClick={() => onLancar(cliente, TipoLancamentoFiado.PAGAMENTO)}
        >
          Pagamento
        </Button>
        {deve && cliente.telefone && (
          <a href={linkLembreteWhatsApp(cliente)} target="_blank" rel="noopener noreferrer" className={classesBotao('whatsapp', 'sm')}>
            <MessageCircle className="h-4 w-4" aria-hidden />
            Lembrar no WhatsApp
          </a>
        )}
      </div>
      {deve && !cliente.telefone && <p className="mt-2 text-xs text-stone-500">Cadastre o telefone para enviar lembretes.</p>}

      <div className="-mx-2 mt-2 flex flex-wrap gap-0.5 border-t border-stone-100 pt-2">
        <Button variant="ghost" tamanho="xs" aria-label={`Editar ${cliente.nome}`} onClick={() => onEditar(cliente)}>Editar</Button>
        <Button variant="ghost" tamanho="xs" aria-label={`Ver dados de ${cliente.nome}`} onClick={() => onVerDados(cliente)}>Ver dados</Button>
        <Button variant="ghost-danger" tamanho="xs" aria-label={`Excluir dados de ${cliente.nome}`} onClick={() => onExcluir(cliente)}>Excluir dados</Button>
      </div>

      {historico.length > 0 && (
        <details className="mt-2 text-sm">
          <summary className="cursor-pointer text-stone-500">Ver histórico</summary>
          <ul className="mt-2 space-y-1">
            {historico.map((lancamento) => {
              const compra = lancamento.tipo === TipoLancamentoFiado.COMPRA;

              return (
                <li key={lancamento.id} className="flex justify-between gap-2">
                  <span className="min-w-0 break-words">{formatarData(lancamento.data)} · {lancamento.descricao}</span>
                  <span className={`whitespace-nowrap tabular-nums ${compra ? 'text-red-700' : 'text-emerald-700'}`}>
                    {formatarMoedaComSinal(lancamento.valor, compra)}
                  </span>
                </li>
              );
            })}
          </ul>
        </details>
      )}
    </Card>
  );
}
