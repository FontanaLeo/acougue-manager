import type { ReactNode } from 'react';

interface DadoProps {
  rotulo: string;
  largo?: boolean;
  className?: string;
  children: ReactNode;
}

// Par rótulo e valor dentro de uma lista <dl>.
export function Dado({ rotulo, largo = false, className = 'font-semibold tabular-nums text-stone-900', children }: DadoProps) {
  return (
    <div className={largo ? 'col-span-2' : undefined}>
      <dt className="text-stone-500">{rotulo}</dt>
      <dd className={className}>{children}</dd>
    </div>
  );
}
