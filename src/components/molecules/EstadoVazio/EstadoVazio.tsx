import type { ReactNode } from 'react';
import { Inbox, type LucideIcon } from 'lucide-react';

interface EstadoVazioProps {
  titulo: string;
  texto?: string;
  icone?: LucideIcon;
  acao?: ReactNode;
}

export function EstadoVazio({ titulo, texto, icone: Icone = Inbox, acao }: EstadoVazioProps) {
  return (
    <div className="col-span-full flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white/60 px-4 py-10 text-center">
      <Icone className="mb-2 h-7 w-7 text-stone-400" aria-hidden />
      <p className="font-medium text-stone-700">{titulo}</p>
      {texto && <p className="mt-1 max-w-md text-sm text-stone-500">{texto}</p>}
      {acao && <div className="mt-4">{acao}</div>}
    </div>
  );
}
