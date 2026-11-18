import { CLASSES_SUPERFICIE, Esqueleto } from '@/components/atoms';
import { CLASSES_GRADE, CLASSES_GRADE_RESUMO } from '@/components/molecules/GradeCartoes/GradeCartoes';

interface CartoesCarregandoProps {
  quantidade?: number;
  // Formato dos cartões de resumo, menores e em quatro colunas.
  resumo?: boolean;
}

export function CartoesCarregando({ quantidade = 6, resumo = false }: CartoesCarregandoProps) {
  return (
    <div className={resumo ? CLASSES_GRADE_RESUMO : CLASSES_GRADE} role="status" aria-label="Carregando">
      {Array.from({ length: quantidade }, (_, indice) =>
        resumo ? (
          <Esqueleto key={indice} className="h-24 rounded-2xl" />
        ) : (
          <div key={indice} className={`${CLASSES_SUPERFICIE} p-5`}>
            <Esqueleto className="h-5 w-1/2" />
            <Esqueleto className="mt-4 h-8 w-1/3" />
            <Esqueleto className="mt-3 h-4 w-2/3" />
          </div>
        ),
      )}
    </div>
  );
}
