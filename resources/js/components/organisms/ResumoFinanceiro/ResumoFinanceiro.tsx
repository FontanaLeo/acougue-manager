import { CardResumo } from '@/components/molecules';
import type { ItemResumo } from '@/types';

interface ResumoFinanceiroProps {
  resumo: ItemResumo[];
}

export function ResumoFinanceiro({ resumo }: ResumoFinanceiroProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4 mb-6">
      {resumo.map((item) => <CardResumo key={item.titulo} item={item} />)}
    </div>
  );
}
