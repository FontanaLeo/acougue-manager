import type { ComponentProps, FormEvent, ReactNode } from 'react';
import { Alerta, Button } from '@/components/atoms';
import { Modal } from '@/components/molecules/Modal/Modal';

interface ModalFormularioProps {
  titulo: string;
  rotuloEnviar: string;
  mutacao: { isPending: boolean; error: Error | null };
  onEnviar: (valores: FormData) => void;
  onClose: () => void;
  botaoEnviar?: Pick<ComponentProps<typeof Button>, 'variant' | 'icone' | 'disabled'>;
  children: ReactNode;
}

// Janela com formulário: erro no topo, campos e o rodapé Cancelar + enviar.
export function ModalFormulario({ titulo, rotuloEnviar, mutacao, onEnviar, onClose, botaoEnviar, children }: ModalFormularioProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onEnviar(new FormData(event.currentTarget));
  };

  return (
    <Modal titulo={titulo} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {mutacao.error && <Alerta role="alert">{mutacao.error.message}</Alerta>}
        {children}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" carregando={mutacao.isPending} {...botaoEnviar}>{rotuloEnviar}</Button>
        </div>
      </form>
    </Modal>
  );
}
