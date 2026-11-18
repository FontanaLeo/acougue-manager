import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button, Input, InputKg, InputMoeda, Select } from '@/components/atoms';
import { CampoFormulario, ModalFormulario } from '@/components/molecules';
import { useRegistrarDesossa } from '@/hooks';
import { analisarDesossa } from '@/lib/desossa';
import { formatarKg, formatarPercentual } from '@/lib/formatters';
import { hojeISO } from '@/lib/validade';
import type { ItemEstoque } from '@/types';

interface NovaDesossaModalProps {
  produtos: ItemEstoque[];
  onClose: () => void;
}

export function NovaDesossaModal({ produtos, onClose }: NovaDesossaModalProps) {
  const mutacao = useRegistrarDesossa();
  // Só o que alimenta a prévia fica em estado; o envio lê o formulário.
  const [peso, setPeso] = useState(0);
  const [cortes, setCortes] = useState([{ chave: 0, kg: 0 }]);
  const aproveitado = cortes.reduce((total, corte) => total + corte.kg, 0);
  const previa = analisarDesossa(peso, aproveitado);

  const mudarPeso = (chave: number, kg: number) =>
    setCortes(cortes.map((corte) => (corte.chave === chave ? { ...corte, kg } : corte)));

  const enviar = (valores: FormData) => {
    const pesos = valores.getAll('kg');

    mutacao.mutate(
      {
        descricao: String(valores.get('descricao')),
        peso_kg: Number(valores.get('peso_kg')),
        valor_total: Number(valores.get('valor_total')),
        validade: String(valores.get('validade')),
        itens: valores.getAll('produto_id').map((produtoId, indice) => ({ produto_id: Number(produtoId), kg: Number(pesos[indice]) })),
      },
      { onSuccess: onClose },
    );
  };

  return (
    <ModalFormulario
      titulo="Nova desossa"
      rotuloEnviar="Registrar"
      mutacao={mutacao}
      onEnviar={enviar}
      onClose={onClose}
      botaoEnviar={{ disabled: previa.excedeu }}
    >
      <CampoFormulario rotulo="Descrição">
        <Input name="descricao" type="text" maxLength={120} required autoFocus placeholder="Ex.: Boi inteiro" />
      </CampoFormulario>
      <div className="grid grid-cols-2 gap-3">
        <CampoFormulario rotulo="Peso comprado (kg)">
          <InputKg name="peso_kg" required onChange={(event) => setPeso(Number(event.target.value) || 0)} />
        </CampoFormulario>
        <CampoFormulario rotulo="Valor pago (R$)">
          <InputMoeda name="valor_total" required />
        </CampoFormulario>
      </div>
      <CampoFormulario rotulo="Validade dos cortes">
        <Input name="validade" type="date" min={hojeISO()} required />
      </CampoFormulario>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-stone-700">Cortes que saíram</legend>
        {cortes.map((corte) => (
          <div key={corte.chave} className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <Select name="produto_id" required aria-label="Corte">
                {produtos.map((produto) => <option key={produto.id} value={produto.id}>{produto.nome}</option>)}
              </Select>
            </div>
            <div className="w-24">
              <InputKg
                name="kg"
                required
                placeholder="kg"
                aria-label="Peso do corte em kg"
                onChange={(event) => mudarPeso(corte.chave, Number(event.target.value) || 0)}
              />
            </div>
            <Button
              variant="ghost"
              tamanho="icone"
              icone={X}
              aria-label="Remover corte"
              disabled={cortes.length === 1}
              onClick={() => setCortes(cortes.filter((atual) => atual.chave !== corte.chave))}
            />
          </div>
        ))}
        <Button
          variant="secondary"
          tamanho="sm"
          icone={Plus}
          onClick={() => setCortes([...cortes, { chave: Math.max(...cortes.map((corte) => corte.chave)) + 1, kg: 0 }])}
        >
          Adicionar corte
        </Button>
      </fieldset>

      {peso > 0 && aproveitado > 0 && (
        <div
          aria-live="polite"
          className={`grid grid-cols-3 gap-2 rounded-lg p-3 text-center text-sm ${previa.excedeu ? 'bg-red-50 text-red-800' : 'bg-stone-50 text-stone-700'}`}
        >
          <div><p className="text-xs">Aproveitado</p><p className="font-semibold tabular-nums">{formatarKg(aproveitado)} kg</p></div>
          <div><p className="text-xs">Rendimento</p><p className="font-semibold tabular-nums">{formatarPercentual(previa.rendimento)}</p></div>
          <div><p className="text-xs">Osso e perda</p><p className="font-semibold tabular-nums">{formatarKg(previa.sobraKg)} kg</p></div>
          {previa.excedeu && <p className="col-span-3 font-medium">Os cortes pesam mais que a peça.</p>}
        </div>
      )}
    </ModalFormulario>
  );
}
