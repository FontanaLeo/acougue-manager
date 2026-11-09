import type { FormEvent } from 'react';
import { Button, Input, Select } from '@/components/atoms';
import { CampoFormulario, Modal } from '@/components/molecules';
import { TipoMovimentacao } from '@/enums';
import { useMovimentarEstoque } from '@/hooks';
import type { ItemEstoque } from '@/types';

interface MovimentarEstoqueModalProps {
  itens: ItemEstoque[];
  onClose: () => void;
}

export function MovimentarEstoqueModal({ itens, onClose }: MovimentarEstoqueModalProps) {
  const { mutate, isPending, error } = useMovimentarEstoque();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valores = new FormData(event.currentTarget);

    mutate(
      {
        id: Number(valores.get('id')),
        tipo: valores.get('tipo') as TipoMovimentacao,
        quantidade: Number(valores.get('quantidade')),
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal titulo="Movimentar Estoque" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-700" role="alert">{error.message}</p>}
        <CampoFormulario rotulo="Produto">
          <Select name="id" required autoFocus>
            {itens.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
          </Select>
        </CampoFormulario>
        <CampoFormulario rotulo="Tipo">
          <Select name="tipo" required>
            <option value={TipoMovimentacao.ENTRADA}>Entrada</option>
            <option value={TipoMovimentacao.SAIDA}>Saída</option>
          </Select>
        </CampoFormulario>
        <CampoFormulario rotulo="Quantidade (kg)">
          <Input name="quantidade" type="number" min="0.1" step="0.1" required />
        </CampoFormulario>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={isPending}>Confirmar</Button>
        </div>
      </form>
    </Modal>
  );
}
