import type { ItemEstoque } from '@/types';

export const DIAS_ALERTA = 3;

function emDias(data: string): number {
  const [ano, mes, dia] = data.split('-').map(Number);
  return Date.UTC(ano, mes - 1, dia) / 86400000;
}

export function hojeISO(): string {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

export function inicioDoMesISO(): string {
  return `${hojeISO().slice(0, 7)}-01`;
}

export function diasParaVencer(validade: string): number {
  return emDias(validade) - emDias(hojeISO());
}

export function estaVencido(validade: string | null): boolean {
  return validade !== null && diasParaVencer(validade) < 0;
}

// De hoje até DIAS_ALERTA dias.
export function venceEmBreve(validade: string | null): boolean {
  if (validade === null) return false;

  const dias = diasParaVencer(validade);
  return dias >= 0 && dias <= DIAS_ALERTA;
}

export function proximaValidade(lotes: ItemEstoque['lotes']): string | null {
  const datas = lotes.flatMap((lote) => (lote.kg_atual > 0 && lote.validade ? [lote.validade] : []));
  return datas.sort()[0] ?? null;
}
