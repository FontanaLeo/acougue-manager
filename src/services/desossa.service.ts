import { semErro } from '@/lib/erros';
import { supabase } from '@/lib/supabase';
import type { Desossa, NovaDesossa } from '@/types';

export function getDesossas(): Promise<Desossa[]> {
  return semErro(
    supabase
      .from('desossas')
      .select('id, descricao, peso_kg, valor_total, data, itens:desossa_itens(id, kg, custo_kg, produto:produtos(nome))')
      .order('data', { ascending: false })
      .order('id', { ascending: false })
      .returns<Desossa[]>(),
  );
}

export async function registrarDesossa(desossa: NovaDesossa): Promise<void> {
  await semErro(
    supabase.rpc('registrar_desossa', {
      p_descricao: desossa.descricao,
      p_peso_kg: desossa.peso_kg,
      p_valor_total: desossa.valor_total,
      p_validade: desossa.validade,
      p_itens: desossa.itens,
    }),
  );
}
