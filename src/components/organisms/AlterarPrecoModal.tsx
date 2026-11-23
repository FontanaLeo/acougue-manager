import { useState } from 'react';
import { Alerta, Input, InputMoeda } from '@/components/atoms';
import { CampoFormulario, ModalFormulario } from '@/components/molecules';
import { useAtualizarPreco } from '@/hooks';
import { formatarMoeda, formatarPercentual } from '@/lib/formatters';
import { analisarMargem } from '@/lib/margem';
import type { ItemEstoque } from '@/types';

interface AlterarPrecoModalProps {
  item: ItemEstoque;
  onClose: () => void;
}

export function AlterarPrecoModal({ item, onClose }: AlterarPrecoModalProps) {
  const mutacao = useAtualizarPreco();
  const atual = analisarMargem(item);
  const [preco, setPreco] = useState(String(atual?.defasado ? atual.precoSugerido : item.preco_kg));
  const [margemMinima, setMargemMinima] = useState(String(item.margem_minima));
  const previa = Number(preco) > 0
    ? analisarMargem({ ...item, preco_kg: Number(preco), margem_minima: Number(margemMinima) || 0 })
    : null;

  return (
    <ModalFormulario
      titulo={`Alterar preço: ${item.nome}`}
      rotuloEnviar="Salvar"
      mutacao={mutacao}
      onClose={onClose}
      onEnviar={() => mutacao.mutate({ id: item.id, preco_kg: Number(preco), margem_minima: Number(margemMinima) }, { onSuccess: onClose })}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoFormulario rotulo="Preço de venda por kg (R$)">
          <InputMoeda name="preco_kg" required autoFocus value={preco} onChange={(event) => setPreco(event.target.value)} />
        </CampoFormulario>
        <CampoFormulario rotulo="Margem mínima (%)">
          <Input
            name="margem_minima"
            type="number"
            inputMode="decimal"
            min="0"
            max="99"
            step="0.1"
            required
            value={margemMinima}
            onChange={(event) => setMargemMinima(event.target.value)}
          />
        </CampoFormulario>
      </div>
      {previa && (
        <Alerta aria-live="polite" tom={previa.defasado ? 'perigo' : 'sucesso'}>
          Com este preço: margem de {formatarPercentual(previa.margem)} e lucro de {formatarMoeda(previa.lucroKg)} por kg.
          {previa.defasado && ` Abaixo da mínima: o sugerido é ${formatarMoeda(previa.precoSugerido)}.`}
        </Alerta>
      )}
    </ModalFormulario>
  );
}
