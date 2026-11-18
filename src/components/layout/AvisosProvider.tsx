import { useCallback, useRef, useState, type ReactNode } from 'react';
import { CircleCheck } from 'lucide-react';
import { AvisosContext } from '@/hooks';

const DURACAO_MS = 4000;

interface AvisosProviderProps {
  children: ReactNode;
}

export function AvisosProvider({ children }: AvisosProviderProps) {
  const [avisos, setAvisos] = useState<{ id: number; mensagem: string }[]>([]);
  const proximoId = useRef(0);

  const avisar = useCallback((mensagem: string) => {
    proximoId.current += 1;
    const id = proximoId.current;

    setAvisos((atuais) => [...atuais, { id, mensagem }]);
    window.setTimeout(() => setAvisos((atuais) => atuais.filter((aviso) => aviso.id !== id)), DURACAO_MS);
  }, []);

  return (
    <AvisosContext.Provider value={avisar}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 print:hidden"
      >
        {avisos.map((aviso) => (
          <div
            key={aviso.id}
            className="flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white shadow-lg motion-safe:animate-surgir"
          >
            <CircleCheck className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            {aviso.mensagem}
          </div>
        ))}
      </div>
    </AvisosContext.Provider>
  );
}
