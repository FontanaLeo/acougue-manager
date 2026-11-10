import { useState } from 'react';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/atoms';
import {
  BarraFiltros,
  CabecalhoPagina,
  CampoBusca,
  CardCliente,
  CardResumo,
  CLASSES_GRADE_RESUMO,
  ConteudoConsulta,
  GradeCartoes,
} from '@/components/molecules';
import { ClienteModal, DadosClienteModal, ExcluirClienteModal, LancamentoFiadoModal } from '@/components/organisms';
import type { TipoLancamentoFiado } from '@/enums';
import { useGetClientes, useTituloPagina } from '@/hooks';
import { estaDevendo, passouPrazoDeGuarda, saldoCliente, totalAReceber } from '@/lib/fiado';
import { formatarMoeda } from '@/lib/formatters';
import { ROTAS } from '@/lib/rotas';
import { contemTexto, plural } from '@/lib/texto';
import type { Cliente, OpcaoFiltro } from '@/types';

type Janela =
  | { tipo: 'novo' }
  | { tipo: 'editar' | 'dados' | 'excluir'; clienteId: number }
  | { tipo: 'lancamento'; clienteId: number; lancamento: TipoLancamentoFiado };

const FILTROS: OpcaoFiltro<Cliente>[] = [
  { rotulo: 'Todos', aceita: () => true },
  { rotulo: 'Devendo', aceita: estaDevendo },
  { rotulo: 'Quitados', aceita: (cliente) => !estaDevendo(cliente) },
];

// Quem deve mais aparece primeiro; depois, ordem alfabética.
function ordenar(a: Cliente, b: Cliente): number {
  return saldoCliente(b) - saldoCliente(a) || a.nome.localeCompare(b.nome, 'pt-BR');
}

export default function FiadoPage() {
  useTituloPagina('Fiado');
  const clientes = useGetClientes();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState(FILTROS[0]);
  const [janela, setJanela] = useState<Janela | null>(null);

  const clienteDaJanela = janela && janela.tipo !== 'novo' ? clientes.data?.find((cliente) => cliente.id === janela.clienteId) : undefined;
  const fechar = () => setJanela(null);

  return (
    <>
      <CabecalhoPagina
        titulo="Fiado"
        descricao="A caderneta do açougue: compras a prazo, pagamentos e lembretes."
        acao={<Button icone={UserPlus} onClick={() => setJanela({ tipo: 'novo' })}>Novo cliente</Button>}
      />

      <ConteudoConsulta consulta={clientes}>
        {(lista) => {
          const total = totalAReceber(lista);
          const paraRevisar = lista.filter(passouPrazoDeGuarda).length;

          return (
            <>
              <div className={`mb-4 ${CLASSES_GRADE_RESUMO}`}>
                <CardResumo titulo="Total a receber" valor={formatarMoeda(total)} tom={total > 0 ? 'negativo' : 'neutro'} destaque />
                <CardResumo titulo="Clientes devendo" valor={String(lista.filter(estaDevendo).length)} />
              </div>

              {paraRevisar > 0 && (
                <Link
                  to={ROTAS.privacidade}
                  className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 hover:bg-amber-100"
                >
                  <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
                  {plural(paraRevisar, 'cliente quitado passou', 'clientes quitados passaram')} do prazo de guarda. Revise em Privacidade.
                </Link>
              )}

              <BarraFiltros opcoes={FILTROS} itens={lista} ativa={filtro} onChange={setFiltro}>
                <CampoBusca rotulo="Buscar cliente" valor={busca} onChange={setBusca} />
              </BarraFiltros>
              <GradeCartoes
                itens={lista.filter((cliente) => filtro.aceita(cliente) && contemTexto(cliente.nome, busca)).sort(ordenar)}
                vazio={lista.length === 0 ? 'Nenhum cliente cadastrado.' : 'Nenhum cliente encontrado.'}
                alinharTopo
              >
                {(cliente) => (
                  <CardCliente
                    cliente={cliente}
                    onLancar={(alvo, lancamento) => setJanela({ tipo: 'lancamento', clienteId: alvo.id, lancamento })}
                    onEditar={(alvo) => setJanela({ tipo: 'editar', clienteId: alvo.id })}
                    onVerDados={(alvo) => setJanela({ tipo: 'dados', clienteId: alvo.id })}
                    onExcluir={(alvo) => setJanela({ tipo: 'excluir', clienteId: alvo.id })}
                  />
                )}
              </GradeCartoes>
            </>
          );
        }}
      </ConteudoConsulta>

      {janela?.tipo === 'novo' && <ClienteModal onClose={fechar} />}
      {janela?.tipo === 'editar' && clienteDaJanela && <ClienteModal cliente={clienteDaJanela} onClose={fechar} />}
      {janela?.tipo === 'dados' && clienteDaJanela && <DadosClienteModal cliente={clienteDaJanela} onClose={fechar} />}
      {janela?.tipo === 'excluir' && clienteDaJanela && <ExcluirClienteModal cliente={clienteDaJanela} onClose={fechar} />}
      {janela?.tipo === 'lancamento' && clienteDaJanela && (
        <LancamentoFiadoModal cliente={clienteDaJanela} tipo={janela.lancamento} onClose={fechar} />
      )}
    </>
  );
}
