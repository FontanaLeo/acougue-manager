import { TipoLancamentoFiado } from '@/enums';
import { formatarMoeda } from '@/lib/formatters';
import { hojeISO } from '@/lib/validade';
import type { Cliente } from '@/types';

// Prazo de referência do CDC, art. 43, § 1º, para informações negativas.
export const ANOS_DE_GUARDA = 5;

// O React Query mantém o mesmo objeto enquanto o cliente não muda, então cada saldo é somado uma vez só.
const saldos = new WeakMap<Cliente, number>();

export function saldoCliente(cliente: Cliente): number {
  const guardado = saldos.get(cliente);
  if (guardado !== undefined) return guardado;

  const centavos = cliente.lancamentos.reduce((total, lancamento) => {
    const valor = Math.round(lancamento.valor * 100);
    return lancamento.tipo === TipoLancamentoFiado.COMPRA ? total + valor : total - valor;
  }, 0);
  const saldo = centavos / 100;

  saldos.set(cliente, saldo);
  return saldo;
}

export function estaDevendo(cliente: Cliente): boolean {
  return saldoCliente(cliente) > 0;
}

export function totalAReceber(clientes: Cliente[]): number {
  return clientes.reduce((soma, cliente) => soma + saldoCliente(cliente), 0);
}

export function passouPrazoDeGuarda(cliente: Cliente): boolean {
  if (estaDevendo(cliente)) return false;

  const hoje = hojeISO();
  const limite = `${Number(hoje.slice(0, 4)) - ANOS_DE_GUARDA}${hoje.slice(4)}`;
  const ultimaMovimentacao = cliente.lancamentos.reduce(
    (ultima, lancamento) => (lancamento.data > ultima ? lancamento.data : ultima),
    cliente.criado_em.slice(0, 10),
  );

  return ultimaMovimentacao < limite;
}

export function linkLembreteWhatsApp(cliente: Cliente): string {
  const telefone = cliente.telefone ?? '';
  // Telefone salvo só com DDD ganha o código do Brasil.
  const numero = telefone.length <= 11 ? `55${telefone}` : telefone;
  const texto = `Olá, ${cliente.nome}! Passando para lembrar do seu saldo em aberto no açougue: ${formatarMoeda(saldoCliente(cliente))}. Obrigado!`;

  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
