import { useState } from 'react';
import { Input, InputKg, InputMoeda, Select } from '@/components/atoms';
import { CampoFormulario, ModalFormulario } from '@/components/molecules';
import { MotivoSaida, ROTULO_MOTIVO_SAIDA, TipoMovimentacao } from '@/enums';
import { useMovimentarEstoque } from '@/hooks';
import { hojeISO } from '@/lib/validade';
import type { ItemEstoque } from '@/types';

export interface MovimentacaoInicial {
  produtoId?: number;
  tipo?: TipoMovimentacao;
  motivo?: MotivoSaida;
  quantidade?: number;
}

interface MovimentarEstoqueModalProps {
  itens: ItemEstoque[];
  inicial?: MovimentacaoInicial;
  onClose: () => void;
}

export function MovimentarEstoqueModal({ itens, inicial, onClose }: MovimentarEstoqueModalProps) {
  const mutacao = useMovimentarEstoque();
  const [tipo, setTipo] = useState(inicial?.tipo ?? TipoMovimentacao.ENTRADA);
  const produtoEscolhido = inicial?.produtoId !== undefined;

  const enviar = (valores: FormData) => {
    const base = { id: Number(valores.get('id')), quantidade: Number(valores.get('quantidade')) };

    mutacao.mutate(
      tipo === TipoMovimentacao.ENTRADA
        ? { ...base, tipo, custo_kg: Number(valores.get('custo_kg')), validade: String(valores.get('validade')) }
        : { ...base, tipo, motivo: valores.get('motivo') as MotivoSaida },
      { onSuccess: onClose },
    );
  };

  return (
    <ModalFormulario titulo="Movimentar estoque" rotuloEnviar="Confirmar" mutacao={mutacao} onEnviar={enviar} onClose={onClose}>
      <CampoFormulario rotulo="Produto">
        <Select name="id" required autoFocus={!produtoEscolhido} defaultValue={inicial?.produtoId}>
          {itens.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
        </Select>
      </CampoFormulario>
      <CampoFormulario rotulo="Tipo">
        <Select name="tipo" required value={tipo} onChange={(event) => setTipo(event.target.value as TipoMovimentacao)}>
          <option value={TipoMovimentacao.ENTRADA}>Entrada</option>
          <option value={TipoMovimentacao.SAIDA}>Saída</option>
        </Select>
      </CampoFormulario>
      <CampoFormulario rotulo="Quantidade (kg)" ajuda={tipo === TipoMovimentacao.SAIDA ? 'Sai primeiro o lote que vence antes.' : undefined}>
        <InputKg name="quantidade" required autoFocus={produtoEscolhido} defaultValue={inicial?.quantidade} />
      </CampoFormulario>
      {tipo === TipoMovimentacao.ENTRADA ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoFormulario rotulo="Custo por kg (R$)">
            <InputMoeda name="custo_kg" required />
          </CampoFormulario>
          <CampoFormulario rotulo="Validade">
            <Input name="validade" type="date" min={hojeISO()} required />
          </CampoFormulario>
        </div>
      ) : (
        <CampoFormulario rotulo="Motivo">
          <Select name="motivo" required defaultValue={inicial?.motivo ?? MotivoSaida.VENDA}>
            {Object.values(MotivoSaida).map((motivo) => <option key={motivo} value={motivo}>{ROTULO_MOTIVO_SAIDA[motivo]}</option>)}
          </Select>
        </CampoFormulario>
      )}
    </ModalFormulario>
  );
}
