import { useState } from 'react';
import { PackagePlus, Plus, Slice } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, classesBotao } from '@/components/atoms';
import { CabecalhoPagina, CardDesossa, CartoesCarregando, ConteudoConsulta, EstadoVazio, GradeCartoes } from '@/components/molecules';
import { NovaDesossaModal } from '@/components/organisms';
import { useGetDesossas, useGetEstoque, useTituloPagina } from '@/hooks';
import { ROTAS } from '@/lib/rotas';

export default function DesossaPage() {
  useTituloPagina('Desossa');
  const desossas = useGetDesossas();
  const { data: produtos } = useGetEstoque();
  const [modalAberto, setModalAberto] = useState(false);
  const semProdutos = produtos !== undefined && produtos.length === 0;

  const vazio = semProdutos ? (
    <EstadoVazio
      icone={Slice}
      titulo="Cadastre os cortes antes da desossa."
      texto="A desossa distribui a peça comprada entre os cortes cadastrados no Estoque, como picanha, alcatra e acém."
      acao={
        <Link to={ROTAS.estoque} className={classesBotao('primary')}>
          <PackagePlus className="h-4 w-4" aria-hidden />
          Cadastrar produtos no Estoque
        </Link>
      }
    />
  ) : (
    <EstadoVazio
      icone={Slice}
      titulo="Nenhuma desossa registrada."
      texto="Registre a compra de uma peça e os cortes que saíram dela para ver o rendimento e o custo real de cada corte."
    />
  );

  return (
    <>
      <CabecalhoPagina
        titulo="Rendimento da desossa"
        descricao="O valor pago é dividido entre os cortes conforme o preço de venda de cada um."
        acao={produtos && produtos.length > 0 && <Button icone={Plus} onClick={() => setModalAberto(true)}>Nova desossa</Button>}
      />

      <ConteudoConsulta consulta={desossas} carregando={<CartoesCarregando quantidade={3} />}>
        {(lista) => (
          <GradeCartoes itens={lista} vazio={vazio}>
            {(desossa) => <CardDesossa desossa={desossa} />}
          </GradeCartoes>
        )}
      </ConteudoConsulta>

      {modalAberto && produtos && <NovaDesossaModal produtos={produtos} onClose={() => setModalAberto(false)} />}
    </>
  );
}
