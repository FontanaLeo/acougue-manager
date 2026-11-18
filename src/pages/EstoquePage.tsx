import { useState } from 'react';
import { Package, PackagePlus, Plus } from 'lucide-react';
import { Button } from '@/components/atoms';
import { BarraFiltros, CabecalhoPagina, CampoBusca, CardProduto, ConteudoConsulta, EstadoVazio, GradeCartoes } from '@/components/molecules';
import { MovimentarEstoqueModal, NovoProdutoModal, type MovimentacaoInicial } from '@/components/organisms';
import { TipoMovimentacao } from '@/enums';
import { useGetEstoque, useTituloPagina } from '@/hooks';
import { estoqueBaixo, venceLogo } from '@/lib/estoque';
import { contemTexto } from '@/lib/texto';
import type { ItemEstoque, OpcaoFiltro } from '@/types';

const FILTROS: OpcaoFiltro<ItemEstoque>[] = [
  { rotulo: 'Todos', aceita: () => true },
  { rotulo: 'Estoque baixo', aceita: estoqueBaixo },
  { rotulo: 'Vencendo', aceita: venceLogo },
];

type Janela = { tipo: 'produto' } | { tipo: 'movimentar'; inicial: MovimentacaoInicial };

export default function EstoquePage() {
  useTituloPagina('Estoque');
  const estoque = useGetEstoque();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState(FILTROS[0]);
  const [janela, setJanela] = useState<Janela | null>(null);

  const itens = estoque.data;
  const temProdutos = Boolean(itens?.length);
  const novoProduto = () => setJanela({ tipo: 'produto' });
  const fechar = () => setJanela(null);

  return (
    <>
      <CabecalhoPagina
        titulo="Estoque"
        descricao="Cada entrada vira um lote com custo e validade."
        acao={
          itens && (
            <div className="flex flex-wrap gap-2">
              <Button variant={temProdutos ? 'secondary' : 'primary'} icone={PackagePlus} onClick={novoProduto}>Novo produto</Button>
              {temProdutos && <Button icone={Plus} onClick={() => setJanela({ tipo: 'movimentar', inicial: {} })}>Movimentar estoque</Button>}
            </div>
          )
        }
      />

      <ConteudoConsulta consulta={estoque}>
        {(lista) =>
          lista.length === 0 ? (
            <EstadoVazio
              icone={Package}
              titulo="Nenhum produto cadastrado."
              texto="Cadastre os cortes que o açougue vende. Depois, registre as entradas com o custo e a validade de cada lote."
              acao={<Button icone={PackagePlus} onClick={novoProduto}>Cadastrar o primeiro produto</Button>}
            />
          ) : (
            <>
              <BarraFiltros opcoes={FILTROS} itens={lista} ativa={filtro} onChange={setFiltro}>
                <CampoBusca rotulo="Buscar produto" valor={busca} onChange={setBusca} />
              </BarraFiltros>
              <GradeCartoes itens={lista.filter((item) => filtro.aceita(item) && contemTexto(item.nome, busca))} vazio="Nenhum produto encontrado.">
                {(item) => (
                  <CardProduto item={item} onMovimentar={(produto, tipo) => setJanela({ tipo: 'movimentar', inicial: { produtoId: produto.id, tipo } })} />
                )}
              </GradeCartoes>
            </>
          )
        }
      </ConteudoConsulta>

      {janela?.tipo === 'produto' && (
        <NovoProdutoModal
          onClose={fechar}
          onCriado={(produtoId) => setJanela({ tipo: 'movimentar', inicial: { produtoId, tipo: TipoMovimentacao.ENTRADA } })}
        />
      )}
      {janela?.tipo === 'movimentar' && itens && <MovimentarEstoqueModal itens={itens} inicial={janela.inicial} onClose={fechar} />}
    </>
  );
}
