import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Card } from '@/components/atoms';
import type { Modulo, StatusModulo } from '@/types';

interface CardModuloProps {
  modulo: Modulo;
  status?: StatusModulo;
}

export function CardModulo({ modulo, status }: CardModuloProps) {
  const Icone = modulo.icone;

  return (
    <Link
      to={modulo.caminho}
      className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-marca-600 focus-visible:ring-offset-2"
    >
      <Card interativo>
        <div className="flex items-start justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-marca-50 text-marca-700">
            <Icone className="h-6 w-6" aria-hidden />
          </span>
          <ChevronRight className="h-5 w-5 text-stone-300 transition group-hover:translate-x-0.5 group-hover:text-marca-600" aria-hidden />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-stone-900">{modulo.titulo}</h2>
        <p className="mt-0.5 text-sm text-stone-600">{modulo.descricao}</p>
        {status && <div className="mt-auto pt-3"><Badge tom={status.tom}>{status.texto}</Badge></div>}
      </Card>
    </Link>
  );
}
