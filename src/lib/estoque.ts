import { estaVencido, proximaValidade, venceEmBreve } from '@/lib/validade';
import type { ItemEstoque } from '@/types';

export function estoqueBaixo(item: ItemEstoque): boolean {
  return item.kg < item.estoque_minimo;
}

// Olha o lote que vence primeiro: vencido ou perto de vencer.
export function venceLogo(item: ItemEstoque): boolean {
  const validade = proximaValidade(item.lotes);
  return estaVencido(validade) || venceEmBreve(validade);
}
