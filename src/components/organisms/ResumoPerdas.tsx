import { CardResumo, CLASSES_GRADE_RESUMO } from '@/components/molecules';
import { MotivoSaida, ROTULO_MOTIVO_SAIDA } from '@/enums';
import { formatarMoeda } from '@/lib/formatters';
import type { Perda } from '@/types';

const MOTIVOS_PERDA = Object.values(MotivoSaida).filter((motivo) => motivo !== MotivoSaida.VENDA);

function somar(perdas: Perda[]): number {
  return perdas.reduce((total, perda) => total + perda.custo_total, 0);
}

interface ResumoPerdasProps {
  perdas: Perda[];
}

export function ResumoPerdas({ perdas }: ResumoPerdasProps) {
  const total = somar(perdas);

  return (
    <div className={CLASSES_GRADE_RESUMO}>
      <CardResumo titulo="Perdido neste mês" valor={formatarMoeda(total)} tom={total > 0 ? 'negativo' : 'neutro'} destaque />
      {MOTIVOS_PERDA.map((motivo) => (
        <CardResumo
          key={motivo}
          titulo={ROTULO_MOTIVO_SAIDA[motivo]}
          valor={formatarMoeda(somar(perdas.filter((perda) => perda.motivo === motivo)))}
        />
      ))}
    </div>
  );
}
