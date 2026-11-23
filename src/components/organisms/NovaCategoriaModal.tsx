import { useState } from 'react';
import { Check } from 'lucide-react';
import { Input } from '@/components/atoms';
import { CampoFormulario, ModalFormulario } from '@/components/molecules';
import { useAdicionarCategoria } from '@/hooks';

const CORES = [
  { valor: '#86231c', nome: 'Vinho' },
  { valor: '#c2410c', nome: 'Laranja' },
  { valor: '#a16207', nome: 'Mostarda' },
  { valor: '#15803d', nome: 'Verde' },
  { valor: '#1d4ed8', nome: 'Azul' },
  { valor: '#6d28d9', nome: 'Roxo' },
  { valor: '#be185d', nome: 'Rosa' },
  { valor: '#475569', nome: 'Cinza' },
];

interface NovaCategoriaModalProps {
  onClose: () => void;
}

export function NovaCategoriaModal({ onClose }: NovaCategoriaModalProps) {
  const mutacao = useAdicionarCategoria();
  const [cor, setCor] = useState(CORES[0].valor);

  return (
    <ModalFormulario
      titulo="Nova categoria"
      rotuloEnviar="Criar"
      mutacao={mutacao}
      onEnviar={(valores) => mutacao.mutate({ nome: String(valores.get('nome')), cor }, { onSuccess: onClose })}
      onClose={onClose}
    >
      <CampoFormulario rotulo="Nome" ajuda="Por exemplo: Açougue, para o caixa da loja, e Família, para as contas de casa.">
        <Input name="nome" type="text" maxLength={40} required autoFocus autoComplete="off" />
      </CampoFormulario>
      <fieldset>
        <legend className="text-sm font-medium text-stone-700">Cor</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {CORES.map((opcao) => (
            <label key={opcao.valor} className="cursor-pointer">
              <input
                type="radio"
                name="cor"
                value={opcao.valor}
                checked={cor === opcao.valor}
                onChange={() => setCor(opcao.valor)}
                className="peer sr-only"
              />
              <span className="sr-only">{opcao.nome}</span>
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-full text-white ring-offset-2 peer-checked:ring-2 peer-checked:ring-stone-900 peer-focus-visible:ring-2 peer-focus-visible:ring-marca-600"
                style={{ backgroundColor: opcao.valor }}
              >
                {cor === opcao.valor && <Check className="h-4 w-4" />}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </ModalFormulario>
  );
}
