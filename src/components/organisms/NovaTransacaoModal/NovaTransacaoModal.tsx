import { Input, InputMoeda, Select } from '@/components/atoms';
import { CampoFormulario, ModalFormulario } from '@/components/molecules';
import { TipoTransacao } from '@/enums';
import { useAdicionarTransacao } from '@/hooks';
import type { Categoria } from '@/types';

interface NovaTransacaoModalProps {
  categorias: Categoria[];
  onClose: () => void;
}

export function NovaTransacaoModal({ categorias, onClose }: NovaTransacaoModalProps) {
  const mutacao = useAdicionarTransacao();

  const enviar = (valores: FormData) =>
    mutacao.mutate(
      {
        tipo: valores.get('tipo') as TipoTransacao,
        categoria_id: Number(valores.get('categoria_id')),
        descricao: String(valores.get('descricao')),
        valor: Number(valores.get('valor')),
      },
      { onSuccess: onClose },
    );

  return (
    <ModalFormulario titulo="Novo lançamento" rotuloEnviar="Adicionar" mutacao={mutacao} onEnviar={enviar} onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoFormulario rotulo="Tipo">
          <Select name="tipo" required autoFocus>
            <option value={TipoTransacao.DESPESA}>Gasto / despesa</option>
            <option value={TipoTransacao.RECEITA}>Venda / entrada de dinheiro</option>
          </Select>
        </CampoFormulario>
        <CampoFormulario rotulo="Categoria">
          <Select name="categoria_id" required>
            {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}
          </Select>
        </CampoFormulario>
      </div>
      <CampoFormulario rotulo="Descrição">
        <Input name="descricao" type="text" maxLength={120} required autoComplete="off" placeholder="Ex.: Venda no balcão" />
      </CampoFormulario>
      <CampoFormulario rotulo="Valor (R$)">
        <InputMoeda name="valor" required placeholder="0,00" />
      </CampoFormulario>
    </ModalFormulario>
  );
}
