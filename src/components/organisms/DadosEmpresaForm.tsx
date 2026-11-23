import type { FormEvent } from 'react';
import { Alerta, Button, Input } from '@/components/atoms';
import { CampoFormulario } from '@/components/molecules';
import { useSalvarEmpresa } from '@/hooks';
import type { Empresa } from '@/types';

interface DadosEmpresaFormProps {
  empresa: Empresa | null;
}

export function DadosEmpresaForm({ empresa }: DadosEmpresaFormProps) {
  const mutacao = useSalvarEmpresa();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valores = new FormData(event.currentTarget);

    mutacao.mutate({ nome: String(valores.get('nome')), contato: String(valores.get('contato')) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mutacao.error && <Alerta role="alert">{mutacao.error.message}</Alerta>}
      <CampoFormulario rotulo="Nome do açougue">
        <Input name="nome" type="text" maxLength={120} required defaultValue={empresa?.nome} />
      </CampoFormulario>
      <CampoFormulario rotulo="Contato para assuntos de dados" ajuda="Telefone, WhatsApp ou e-mail que o cliente pode usar.">
        <Input name="contato" type="text" maxLength={120} required defaultValue={empresa?.contato} />
      </CampoFormulario>
      <div className="flex justify-end">
        <Button type="submit" carregando={mutacao.isPending}>Salvar</Button>
      </div>
    </form>
  );
}
