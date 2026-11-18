import { useState } from 'react';
import { BarraFiltros, CabecalhoPagina, CardLote, CartoesCarregando, ConteudoConsulta, GradeCartoes } from '@/components/molecules';
import { MovimentarEstoqueModal, ResumoPerdas, type MovimentacaoInicial } from '@/components/organisms';
import { MotivoSaida, TipoMovimentacao } from '@/enums';
import { useGetEstoque, useGetLotes, useGetPerdasDoMes, useTituloPagina } from '@/hooks';
import { DIAS_ALERTA, estaVencido, venceEmBreve } from '@/lib/validade';
import type { Lote, OpcaoFiltro } from '@/types';

const FILTROS: OpcaoFiltro<Lote>[] = [
  { rotulo: 'Todos', aceita: () => true },
  { rotulo: 'Vencidos', aceita: (lote) => estaVencido(lote.validade) },
  { rotulo: `Até ${DIAS_ALERTA} dias`, aceita: (lote) => venceEmBreve(lote.validade) },
  { rotulo: 'Sem validade', aceita: (lote) => lote.validade === null },
];

export default function LotesPage() {
  useTituloPagina('Lotes e perdas');
  const lotes = useGetLotes();
  const perdas = useGetPerdasDoMes();
  const { data: itens } = useGetEstoque();
  const [filtro, setFiltro] = useState(FILTROS[0]);
  const [baixa, setBaixa] = useState<MovimentacaoInicial | null>(null);

  const darBaixa = (lote: Lote) =>
    setBaixa({ produtoId: lote.produto_id, tipo: TipoMovimentacao.SAIDA, motivo: MotivoSaida.VENCIMENTO, quantidade: lote.kg_atual });

  return (
    <>
      <CabecalhoPagina titulo="Lotes e perdas" descricao="A saída sempre baixa primeiro o lote que vence antes." />

      <section className="mb-6" aria-label="Perdas do mês">
        <ConteudoConsulta consulta={perdas} carregando={<CartoesCarregando quantidade={4} resumo />}>
          {(lista) => <ResumoPerdas perdas={lista} />}
        </ConteudoConsulta>
      </section>

      <h2 className="mb-3 text-lg font-bold text-stone-900">Em estoque, do que vence primeiro ao último</h2>
      <ConteudoConsulta consulta={lotes}>
        {(lista) => (
          <>
            <BarraFiltros opcoes={FILTROS} itens={lista} ativa={filtro} onChange={setFiltro} />
            <GradeCartoes itens={lista.filter(filtro.aceita)} vazio={lista.length === 0 ? 'Nenhum lote em estoque.' : 'Nenhum lote neste filtro.'}>
              {(lote) => <CardLote lote={lote} onDarBaixa={darBaixa} />}
            </GradeCartoes>
          </>
        )}
      </ConteudoConsulta>

      {baixa && itens && <MovimentarEstoqueModal itens={itens} inicial={baixa} onClose={() => setBaixa(null)} />}
    </>
  );
}
