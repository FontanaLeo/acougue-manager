import type { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';

const MENSAGEM_PADRAO = 'Não foi possível concluir agora. Verifique a internet e tente de novo.';

// As funções do banco validam as regras e já respondem em português.
// Qualquer outro erro é técnico e não deve aparecer para quem usa o sistema.
export function erroDoBanco(erro: PostgrestError): Error {
  const mensagemDoSistema = erro.code === '22023' || erro.code === 'P0002' || erro.message.startsWith('Faça login');

  if (import.meta.env.DEV && !mensagemDoSistema) console.error(erro);

  return new Error(mensagemDoSistema ? erro.message : MENSAGEM_PADRAO);
}

// Toda resposta do banco passa por aqui, então nenhum service esquece de esconder o erro técnico.
export async function semErro<T>(consulta: PromiseLike<PostgrestSingleResponse<T>>): Promise<T> {
  const resposta = await consulta;

  if (resposta.error) throw erroDoBanco(resposta.error);

  return resposta.data;
}
