import { Link } from 'react-router-dom';
import { Card } from '@/components/atoms';
import type { Modulo } from '@/types';

interface CardModuloProps {
  modulo: Modulo;
}

export function CardModulo({ modulo }: CardModuloProps) {
  return (
    <Link
      to={modulo.caminho}
      className="block rounded-xl transition hover:ring-2 hover:ring-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-800"
    >
      <Card>
        <span className="text-4xl" aria-hidden="true">{modulo.icone}</span>
        <h2 className="mt-2 text-xl font-bold text-gray-800">{modulo.titulo}</h2>
        <p className="text-gray-600">{modulo.descricao}</p>
      </Card>
    </Link>
  );
}
