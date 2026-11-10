import type { ItemEstoque } from '@/types';

export interface AnaliseMargem {
  custoKg: number;
  margem: number;
  lucroKg: number;
  precoSugerido: number;
  aumentoCusto: number;
  defasado: boolean;
}

export function analisarMargem(item: ItemEstoque): AnaliseMargem | null {
  if (item.custo_kg === null) return null;

  const lucroKg = item.preco_kg - item.custo_kg;
  const margem = item.preco_kg > 0 ? (lucroKg / item.preco_kg) * 100 : 0;
  const centavos = (item.custo_kg / (1 - item.margem_minima / 100)) * 100;
  const aumentoCusto = item.custo_anterior_kg === null ? 0 : Math.max(0, item.custo_kg - item.custo_anterior_kg);

  return {
    custoKg: item.custo_kg,
    margem,
    lucroKg,
    // toFixed evita que um erro de arredondamento suba o preço em um centavo.
    precoSugerido: Math.ceil(Number(centavos.toFixed(6))) / 100,
    aumentoCusto,
    defasado: margem < item.margem_minima,
  };
}

export function precoDefasado(item: ItemEstoque): boolean {
  return analisarMargem(item)?.defasado === true;
}
