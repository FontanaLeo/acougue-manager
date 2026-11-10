// Criados uma vez: montar um formatador a cada chamada custa muito mais que formatar.
const MOEDA = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const UMA_CASA = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formatarMoeda(valor: number): string {
  return MOEDA.format(valor).replace(/ /g, ' ');
}

// "+ R$ 10,00" para o que entra na conta e "- R$ 10,00" para o que sai.
export function formatarMoedaComSinal(valor: number, positivo: boolean): string {
  return `${positivo ? '+' : '-'} ${formatarMoeda(valor)}`;
}

export function formatarKg(kg: number): string {
  return UMA_CASA.format(kg);
}

export function formatarPercentual(valor: number): string {
  return `${UMA_CASA.format(valor)}%`;
}

export function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function formatarTelefone(telefone: string): string {
  const numero = telefone.length >= 12 && telefone.startsWith('55') ? telefone.slice(2) : telefone;

  if (numero.length === 11) return `(${numero.slice(0, 2)}) ${numero.slice(2, 7)}-${numero.slice(7)}`;
  if (numero.length === 10) return `(${numero.slice(0, 2)}) ${numero.slice(2, 6)}-${numero.slice(6)}`;

  return telefone;
}
