import { Card } from '@/components/atoms';

type TomResumo = 'positivo' | 'negativo' | 'neutro';

const CLASSES_TOM: Record<TomResumo, string> = {
  positivo: 'text-emerald-700',
  negativo: 'text-red-700',
  neutro: 'text-stone-900',
};

interface CardResumoProps {
  titulo: string;
  valor: string;
  tom?: TomResumo;
  destaque?: boolean;
}

export function CardResumo({ titulo, valor, tom = 'neutro', destaque = false }: CardResumoProps) {
  return (
    <Card destaque={destaque}>
      <p className="text-sm text-stone-500">{titulo}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${CLASSES_TOM[tom]}`}>{valor}</p>
    </Card>
  );
}
