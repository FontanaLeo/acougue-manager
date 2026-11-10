import { semErro } from '@/lib/erros';
import { supabase } from '@/lib/supabase';
import type { Cliente, DadosCliente, NovoLancamentoFiado } from '@/types';

export function getClientes(): Promise<Cliente[]> {
  return semErro(
    supabase
      .from('clientes')
      .select('id, nome, telefone, criado_em, lancamentos:fiado_lancamentos(id, tipo, descricao, valor, data)')
      .is('anonimizado_em', null)
      .order('nome')
      .returns<Cliente[]>(),
  );
}

// Com id, corrige um cliente existente; sem id, cadastra um novo.
export async function salvarCliente({ id, nome, telefone }: DadosCliente): Promise<void> {
  await semErro(
    id === undefined
      ? supabase.rpc('adicionar_cliente', { p_nome: nome, p_telefone: telefone })
      : supabase.rpc('atualizar_cliente', { p_cliente_id: id, p_nome: nome, p_telefone: telefone }),
  );
}

export async function anonimizarCliente(clienteId: number): Promise<void> {
  await semErro(supabase.rpc('anonimizar_cliente', { p_cliente_id: clienteId }));
}

export async function registrarFiado(lancamento: NovoLancamentoFiado): Promise<void> {
  await semErro(
    supabase.rpc('registrar_fiado', {
      p_cliente_id: lancamento.cliente_id,
      p_tipo: lancamento.tipo,
      p_descricao: lancamento.descricao,
      p_valor: lancamento.valor,
    }),
  );
}
