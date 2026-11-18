import { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { esquecerAtividade, inativoDemais, marcarSaidaPorInatividade } from '@/lib/inatividade';
import { observarSessao, sair } from '@/services';
import { useInatividade } from './useInatividade';

export function useSessao() {
  const queryClient = useQueryClient();
  // undefined significa que a sessão salva ainda está sendo lida.
  const [sessao, setSessao] = useState<Session | null | undefined>(undefined);

  const encerrarPorInatividade = useCallback(() => {
    marcarSaidaPorInatividade();
    void sair();
  }, []);

  useEffect(
    () =>
      observarSessao((novaSessao) => {
        // Qualquer fim de sessão apaga os dados da memória e a hora do último uso.
        if (!novaSessao) {
          queryClient.clear();
          esquecerAtividade();
        }
        // O Supabase repete o aviso de login ao voltar para a aba; com o mesmo token, nada muda.
        setSessao((atual) => (atual && novaSessao && atual.access_token === novaSessao.access_token ? atual : novaSessao));
      }),
    [queryClient],
  );

  // Cobre quem fechou o navegador e voltou depois do limite.
  const expirou = Boolean(sessao) && inativoDemais();

  useEffect(() => {
    if (expirou) encerrarPorInatividade();
  }, [expirou, encerrarPorInatividade]);

  useInatividade(Boolean(sessao) && !expirou, encerrarPorInatividade);

  return { sessao: expirou ? null : sessao, carregando: sessao === undefined || expirou };
}
