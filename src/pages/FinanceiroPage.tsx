import { useState } from 'react';
import { Plus, Tags, Wallet } from 'lucide-react';
import { Button } from '@/components/atoms';
import { CabecalhoPagina, CardTransacao, ConteudoConsulta, EstadoVazio, GradeCartoes } from '@/components/molecules';
import { FiltrosCategoria, NovaCategoriaModal, NovaTransacaoModal, ResumoFinanceiro } from '@/components/organisms';
import { useFinanceiroPage, useTituloPagina } from '@/hooks';

export default function FinanceiroPage() {
  useTituloPagina('Financeiro');
  const financeiro = useFinanceiroPage();
  // null significa "Todos".
  const [filtroCategoria, setFiltroCategoria] = useState<number | null>(null);
  const [janela, setJanela] = useState<'lancamento' | 'categoria' | null>(null);

  const categorias = financeiro.data?.categorias ?? [];
  const temCategorias = categorias.length > 0;
  const novaCategoria = () => setJanela('categoria');

  return (
    <>
      <CabecalhoPagina
        titulo="Financeiro"
        descricao="Saldos por categoria e o saldo líquido geral."
        acao={
          financeiro.data && (
            <div className="flex flex-wrap gap-2">
              <Button variant={temCategorias ? 'secondary' : 'primary'} icone={Tags} onClick={novaCategoria}>Nova categoria</Button>
              {temCategorias && <Button icone={Plus} onClick={() => setJanela('lancamento')}>Novo lançamento</Button>}
            </div>
          )
        }
      />

      <ConteudoConsulta consulta={financeiro}>
        {({ transacoes }) =>
          !temCategorias ? (
            <EstadoVazio
              icone={Wallet}
              titulo="Nenhuma categoria criada."
              texto="As categorias separam o dinheiro, por exemplo Açougue para o caixa da loja e Família para as contas de casa. Crie pelo menos uma para lançar."
              acao={<Button icone={Tags} onClick={novaCategoria}>Criar a primeira categoria</Button>}
            />
          ) : (
            <>
              <ResumoFinanceiro categorias={categorias} transacoes={transacoes} />
              <FiltrosCategoria categorias={categorias} filtro={filtroCategoria} onChange={setFiltroCategoria} />
              <GradeCartoes
                itens={filtroCategoria === null ? transacoes : transacoes.filter((transacao) => transacao.categoria_id === filtroCategoria)}
                vazio={filtroCategoria === null ? 'Nenhum lançamento cadastrado.' : 'Nenhum lançamento nesta categoria.'}
              >
                {(transacao) => <CardTransacao transacao={transacao} />}
              </GradeCartoes>
            </>
          )
        }
      </ConteudoConsulta>

      {janela === 'categoria' && <NovaCategoriaModal onClose={() => setJanela(null)} />}
      {janela === 'lancamento' && <NovaTransacaoModal categorias={categorias} onClose={() => setJanela(null)} />}
    </>
  );
}
