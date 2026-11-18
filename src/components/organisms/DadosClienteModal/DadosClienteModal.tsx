import { Download, Printer } from 'lucide-react';
import { Button } from '@/components/atoms';
import { AreaImpressao, Modal, RelatorioCliente } from '@/components/molecules';
import { useGetEmpresa } from '@/hooks';
import { baixarCsvDoCliente } from '@/lib/relatorioCliente';
import type { Cliente } from '@/types';

interface DadosClienteModalProps {
  cliente: Cliente;
  onClose: () => void;
}

// Atende o pedido de acesso do cliente: tela, impressão ou planilha.
export function DadosClienteModal({ cliente, onClose }: DadosClienteModalProps) {
  const { data: empresa = null } = useGetEmpresa();
  const relatorio = <RelatorioCliente cliente={cliente} empresa={empresa} />;

  return (
    <Modal titulo="Dados do cliente" largo onClose={onClose}>
      {relatorio}
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <Button variant="secondary" icone={Download} onClick={() => baixarCsvDoCliente(cliente)}>Baixar planilha</Button>
        <Button icone={Printer} onClick={() => window.print()}>Imprimir</Button>
      </div>
      <AreaImpressao>{relatorio}</AreaImpressao>
    </Modal>
  );
}
