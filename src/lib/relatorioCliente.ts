import { ROTULO_LANCAMENTO_FIADO } from '@/enums';
import type { Cliente } from '@/types';

function celula(valor: string): string {
  // O apóstrofo impede que planilhas interpretem o texto como fórmula.
  const seguro = /^[=+\-@\t\r]/.test(valor) ? `'${valor}` : valor;

  return `"${seguro.replace(/"/g, '""')}"`;
}

function csvDoCliente(cliente: Cliente): string {
  const pessoa = [celula(cliente.nome), celula(cliente.telefone ?? '')];
  const linhas = cliente.lancamentos.map((lancamento) =>
    [
      ...pessoa,
      lancamento.data,
      ROTULO_LANCAMENTO_FIADO[lancamento.tipo],
      celula(lancamento.descricao),
      lancamento.valor.toFixed(2).replace('.', ','),
    ].join(';'),
  );

  return ['Cliente;Telefone;Data;Tipo;Descrição;Valor', ...(linhas.length > 0 ? linhas : [pessoa.join(';')])].join('\r\n');
}

export function baixarCsvDoCliente(cliente: Cliente): void {
  // A marca inicial faz o Excel reconhecer os acentos.
  const arquivo = new Blob([`﻿${csvDoCliente(cliente)}`], { type: 'text/csv;charset=utf-8' });
  const endereco = URL.createObjectURL(arquivo);
  const link = document.createElement('a');

  link.href = endereco;
  link.download = `dados-cliente-${cliente.id}.csv`;
  link.click();
  URL.revokeObjectURL(endereco);
}
