import type { FormEvent } from 'react';
import { Button, Input, Select } from '@/components/atoms';
import { CampoFormulario, Modal } from '@/components/molecules';
import { TipoTransacao } from '@/enums';
import { useAdicionarTransacao } from '@/hooks';
import type { Categoria } from '@/types';

interface NovaTransacaoModalProps {
  categorias: Categoria[];
  onClose: () => void;
}

export function NovaTransacaoModal({ categorias, onClose }: NovaTransacaoModalProps) {
  const { mutate, isPending, error } = useAdicionarTransacao();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valores = new FormData(event.currentTarget);

    mutate(
      {
        tipo: valores.get('tipo') as TipoTransacao,
        categoria_id: Number(valores.get('categoria_id')),
        descricao: String(valores.get('descricao')),
        valor: Number(valores.get('valor')),
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal titulo="Novo lançamento" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-700" role="alert">{error.message}</p>}
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
        <CampoFormulario rotulo="Descrição">
          <Input name="descricao" type="text" maxLength={120} required placeholder="Ex.: Venda no balcão" />
        </CampoFormulario>
        <CampoFormulario rotulo="Valor (R$)">
          <Input name="valor" type="number" min="0.01" step="0.01" required placeholder="0,00" />
        </CampoFormulario>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isPending}>Adicionar</Button>
        </div>
      </form>
    </Modal>
  );
}
