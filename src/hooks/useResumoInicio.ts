import { useMemo } from 'react';
import { estoqueBaixo } from '@/lib/estoque';
import { totalAReceber } from '@/lib/fiado';
import { formatarMoeda } from '@/lib/formatters';
import { precoDefasado } from '@/lib/margem';
import { ROTAS, type Rota } from '@/lib/rotas';
import { plural } from '@/lib/texto';
import { DIAS_ALERTA, estaVencido, venceEmBreve } from '@/lib/validade';
import type { StatusModulo } from '@/types';
import { useGetClientes } from './useGetClientes';
import { useGetEstoque } from './useGetEstoque';
import { useGetLotes } from './useGetLotes';

// Um aviso curto por módulo; enquanto os dados não chegam, o card fica sem aviso.
export function useResumoInicio(): Partial<Record<Rota, StatusModulo>> {
  const { data: itens } = useGetEstoque();
  const { data: lotes } = useGetLotes();
  const { data: clientes } = useGetClientes();

  return useMemo(() => {
    const status: Partial<Record<Rota, StatusModulo>> = {};

    if (itens) {
      const baixos = itens.filter(estoqueBaixo).length;
      const defasados = itens.filter(precoDefasado).length;

      status[ROTAS.estoque] = baixos > 0
        ? { texto: `${plural(baixos, 'produto', 'produtos')} com estoque baixo`, tom: 'alerta' }
        : { texto: 'Estoque em dia', tom: 'sucesso' };
      status[ROTAS.precos] = defasados > 0
        ? { texto: plural(defasados, 'preço defasado', 'preços defasados'), tom: 'alerta' }
        : { texto: 'Margens em dia', tom: 'sucesso' };
    }

    if (lotes) {
      const vencidos = lotes.filter((lote) => estaVencido(lote.validade)).length;
      const proximos = lotes.filter((lote) => venceEmBreve(lote.validade)).length;

      if (vencidos > 0) status[ROTAS.lotes] = { texto: plural(vencidos, 'lote vencido', 'lotes vencidos'), tom: 'perigo' };
      else if (proximos > 0) status[ROTAS.lotes] = { texto: `${plural(proximos, 'lote vence', 'lotes vencem')} em até ${DIAS_ALERTA} dias`, tom: 'alerta' };
      else status[ROTAS.lotes] = { texto: 'Nada perto de vencer', tom: 'sucesso' };
    }

    if (clientes) {
      const total = totalAReceber(clientes);

      status[ROTAS.fiado] = total > 0
        ? { texto: `${formatarMoeda(total)} a receber`, tom: 'alerta' }
        : { texto: 'Ninguém devendo', tom: 'sucesso' };
    }

    return status;
  }, [itens, lotes, clientes]);
}
