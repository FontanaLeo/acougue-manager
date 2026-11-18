import { Input, InputMoeda } from '@/components/atoms';
import { CampoFormulario, ModalFormulario } from '@/components/molecules';
import { TipoLancamentoFiado } from '@/enums';
import { useRegistrarFiado } from '@/hooks';
import { saldoCliente } from '@/lib/fiado';
import type { Cliente } from '@/types';

interface LancamentoFiadoModalProps {
  cliente: Cliente;
  tipo: TipoLancamentoFiado;
  onClose: () => void;
}

export function LancamentoFiadoModal({ cliente, tipo, onClose }: LancamentoFiadoModalProps) {
  const mutacao = useRegistrarFiado();
  const pagamento = tipo === TipoLancamentoFiado.PAGAMENTO;
  const saldo = saldoCliente(cliente);

  const enviar = (valores: FormData) =>
    mutacao.mutate(
      { cliente_id: cliente.id, tipo, descricao: String(valores.get('descricao')), valor: Number(valores.get('valor')) },
      { onSuccess: onClose },
    );

  return (
    <ModalFormulario
      titulo={`${pagamento ? 'Pagamento' : 'Compra fiado'}: ${cliente.nome}`}
      rotuloEnviar="Confirmar"
      mutacao={mutacao}
      onEnviar={enviar}
      onClose={onClose}
    >
      <CampoFormulario rotulo="Descrição" ajuda={pagamento ? undefined : 'Anote só o que foi comprado. Não escreva CPF, doenças ou outros dados pessoais.'}>
        <Input
          name="descricao"
          type="text"
          maxLength={120}
          required
          autoFocus
          autoComplete="off"
          defaultValue={pagamento ? 'Pagamento' : undefined}
          placeholder={pagamento ? undefined : 'Ex.: 2 kg de alcatra'}
        />
      </CampoFormulario>
      <CampoFormulario rotulo="Valor (R$)" ajuda={pagamento ? 'Já vem com o valor total devido.' : undefined}>
        <InputMoeda name="valor" max={pagamento ? saldo : undefined} required defaultValue={pagamento ? saldo : undefined} />
      </CampoFormulario>
    </ModalFormulario>
  );
}
