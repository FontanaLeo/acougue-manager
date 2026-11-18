import { Input } from '@/components/atoms';
import { CampoFormulario, ModalFormulario } from '@/components/molecules';
import { useSalvarCliente } from '@/hooks';
import { formatarTelefone } from '@/lib/formatters';
import type { Cliente } from '@/types';

interface ClienteModalProps {
  // Sem cliente, a janela cadastra um novo.
  cliente?: Cliente;
  onClose: () => void;
}

export function ClienteModal({ cliente, onClose }: ClienteModalProps) {
  const mutacao = useSalvarCliente();

  const enviar = (valores: FormData) =>
    mutacao.mutate(
      { id: cliente?.id, nome: String(valores.get('nome')), telefone: String(valores.get('telefone')) },
      { onSuccess: onClose },
    );

  return (
    <ModalFormulario
      titulo={cliente ? 'Editar cliente' : 'Novo cliente'}
      rotuloEnviar={cliente ? 'Salvar' : 'Adicionar'}
      mutacao={mutacao}
      onEnviar={enviar}
      onClose={onClose}
    >
      <CampoFormulario rotulo="Nome">
        <Input name="nome" type="text" maxLength={80} required autoFocus autoComplete="off" defaultValue={cliente?.nome} />
      </CampoFormulario>
      <CampoFormulario rotulo="WhatsApp com DDD (opcional)" ajuda="Usado só para lembretes de valores em aberto.">
        <Input
          name="telefone"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="(44) 99999-9999"
          defaultValue={cliente?.telefone ? formatarTelefone(cliente.telefone) : ''}
        />
      </CampoFormulario>
      {!cliente && <p className="text-xs text-stone-500">Antes de cadastrar, mostre ao cliente o aviso de privacidade do balcão.</p>}
    </ModalFormulario>
  );
}
