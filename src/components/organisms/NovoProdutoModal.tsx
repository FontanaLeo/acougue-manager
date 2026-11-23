import { Input, InputMoeda } from '@/components/atoms';
import { CampoFormulario, ModalFormulario } from '@/components/molecules';
import { useAdicionarProduto } from '@/hooks';

interface NovoProdutoModalProps {
  onClose: () => void;
  onCriado: (produtoId: number) => void;
}

export function NovoProdutoModal({ onClose, onCriado }: NovoProdutoModalProps) {
  const mutacao = useAdicionarProduto();

  const enviar = (valores: FormData) =>
    mutacao.mutate(
      {
        nome: String(valores.get('nome')),
        preco_kg: Number(valores.get('preco_kg')),
        fornecedor: String(valores.get('fornecedor')),
        estoque_minimo: Number(valores.get('estoque_minimo')),
      },
      { onSuccess: onCriado },
    );

  return (
    <ModalFormulario titulo="Novo produto" rotuloEnviar="Cadastrar" mutacao={mutacao} onEnviar={enviar} onClose={onClose}>
      <CampoFormulario rotulo="Nome">
        <Input name="nome" type="text" maxLength={60} required autoFocus autoComplete="off" placeholder="Ex.: Picanha" />
      </CampoFormulario>
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoFormulario rotulo="Preço de venda por kg (R$)">
          <InputMoeda name="preco_kg" required />
        </CampoFormulario>
        <CampoFormulario rotulo="Estoque mínimo (kg)" ajuda="Abaixo disso, aparece o aviso de estoque baixo.">
          <Input name="estoque_minimo" type="number" inputMode="decimal" min="0" step="0.1" required defaultValue={0} />
        </CampoFormulario>
      </div>
      <CampoFormulario rotulo="Fornecedor">
        <Input name="fornecedor" type="text" maxLength={80} required autoComplete="off" placeholder="Ex.: Frigorífico Boi Forte" />
      </CampoFormulario>
      <p className="text-xs text-stone-500">O produto começa com 0 kg. O estoque entra pelas entradas, que guardam o custo e a validade de cada lote.</p>
    </ModalFormulario>
  );
}
