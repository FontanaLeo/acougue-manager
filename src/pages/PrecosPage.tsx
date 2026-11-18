import { useState } from 'react';
import { BarraFiltros, CabecalhoPagina, CardPreco, ConteudoConsulta, GradeCartoes } from '@/components/molecules';
import { AlterarPrecoModal } from '@/components/organisms';
import { useGetEstoque, useTituloPagina } from '@/hooks';
import { precoDefasado } from '@/lib/margem';
import type { ItemEstoque, OpcaoFiltro } from '@/types';

const FILTROS: OpcaoFiltro<ItemEstoque>[] = [
  { rotulo: 'Todos', aceita: () => true },
  { rotulo: 'Defasados', aceita: precoDefasado },
  { rotulo: 'Sem custo', aceita: (item) => item.custo_kg === null },
];

export default function PrecosPage() {
  useTituloPagina('Preços');
  const estoque = useGetEstoque();
  const [filtro, setFiltro] = useState(FILTROS[0]);
  const [itemEmEdicao, setItemEmEdicao] = useState<ItemEstoque | null>(null);

  return (
    <>
      <CabecalhoPagina titulo="Preço e margem" descricao="A margem usa o custo da última entrada de cada corte." />

      <ConteudoConsulta consulta={estoque}>
        {(itens) => (
          <>
            <BarraFiltros opcoes={FILTROS} itens={itens} ativa={filtro} onChange={setFiltro} />
            <GradeCartoes itens={itens.filter(filtro.aceita)} vazio={itens.length === 0 ? 'Nenhum produto cadastrado.' : 'Nenhum produto neste filtro.'}>
              {(item) => <CardPreco item={item} onAlterar={setItemEmEdicao} />}
            </GradeCartoes>
          </>
        )}
      </ConteudoConsulta>

      {itemEmEdicao && <AlterarPrecoModal item={itemEmEdicao} onClose={() => setItemEmEdicao(null)} />}
    </>
  );
}
