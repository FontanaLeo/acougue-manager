import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/atoms';
import { Modal, ModalFormulario } from '@/components/molecules';
import { useAnonimizarCliente } from '@/hooks';
import { estaDevendo, saldoCliente } from '@/lib/fiado';
import { formatarMoeda } from '@/lib/formatters';
import type { Cliente } from '@/types';

interface ExcluirClienteModalProps {
  cliente: Cliente;
  onClose: () => void;
}

export function ExcluirClienteModal({ cliente, onClose }: ExcluirClienteModalProps) {
  const mutacao = useAnonimizarCliente();
  const [entendi, setEntendi] = useState(false);
  const titulo = `Excluir dados de ${cliente.nome}`;

  if (estaDevendo(cliente)) {
    return (
      <Modal titulo={titulo} onClose={onClose}>
        <div className="space-y-4">
          <p className="text-stone-700">
            Este cliente ainda deve <strong className="tabular-nums">{formatarMoeda(saldoCliente(cliente))}</strong>. Os dados ficam guardados
            enquanto houver dívida. Registre o pagamento antes de excluir.
          </p>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose}>Entendi</Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <ModalFormulario
      titulo={titulo}
      rotuloEnviar="Excluir dados"
      mutacao={mutacao}
      onEnviar={() => mutacao.mutate(cliente.id, { onSuccess: onClose })}
      onClose={onClose}
      botaoEnviar={{ variant: 'danger', icone: Trash2, disabled: !entendi }}
    >
      <p className="text-stone-700">
        O nome, o telefone e as descrições das compras serão apagados para sempre. Os valores continuam nas contas do açougue, sem identificar
        ninguém.
      </p>
      <label className="flex items-start gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          name="entendi"
          checked={entendi}
          onChange={(event) => setEntendi(event.target.checked)}
          className="mt-0.5 h-4 w-4 accent-marca-700"
        />
        Entendi que não dá para desfazer.
      </label>
    </ModalFormulario>
  );
}
