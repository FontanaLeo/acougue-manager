import type { ReactNode } from 'react';

interface CabecalhoCardProps {
  titulo: string;
  subtitulo?: string;
  nivel?: 'h2' | 'h3';
  // Selos ou data, alinhados à direita.
  children?: ReactNode;
}

export function CabecalhoCard({ titulo, subtitulo, nivel: Titulo = 'h2', children }: CabecalhoCardProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0">
        <Titulo className="break-words text-base font-semibold text-stone-900">{titulo}</Titulo>
        {subtitulo && <p className="text-xs tabular-nums text-stone-500">{subtitulo}</p>}
      </div>
      {children}
    </div>
  );
}
