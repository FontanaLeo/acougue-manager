export enum TipoMovimentacao {
  ENTRADA = 'entrada',
  SAIDA = 'saida',
}

export enum MotivoSaida {
  VENDA = 'venda',
  VENCIMENTO = 'vencimento',
  APARAS = 'aparas',
  PERDA_PESO = 'perda_peso',
}

export enum TipoLancamentoFiado {
  COMPRA = 'compra',
  PAGAMENTO = 'pagamento',
}

export enum TipoTransacao {
  DESPESA = 'despesa',
  RECEITA = 'receita',
}

// Com Record, um valor novo no enum sem rótulo vira erro de compilação.
export const ROTULO_MOTIVO_SAIDA: Record<MotivoSaida, string> = {
  [MotivoSaida.VENDA]: 'Venda',
  [MotivoSaida.VENCIMENTO]: 'Vencimento',
  [MotivoSaida.APARAS]: 'Aparas',
  [MotivoSaida.PERDA_PESO]: 'Perda de peso',
};

export const ROTULO_LANCAMENTO_FIADO: Record<TipoLancamentoFiado, string> = {
  [TipoLancamentoFiado.COMPRA]: 'Compra',
  [TipoLancamentoFiado.PAGAMENTO]: 'Pagamento',
};
