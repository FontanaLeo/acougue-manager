import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { observarSessao } from '@/services';

export function useSessao() {
  // undefined significa que a sessão salva ainda está sendo lida.
  const [sessao, setSessao] = useState<Session | null | undefined>(undefined);

  useEffect(() => observarSessao(setSessao), []);

  return { sessao, carregando: sessao === undefined };
}
