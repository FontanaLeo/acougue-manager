import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/atoms';

interface ErroConsultaProps {
  mensagem: string;
  onTentarDeNovo: () => void;
}

export function ErroConsulta({ mensagem, onTentarDeNovo }: ErroConsultaProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-4 py-8 text-center" role="alert">
      <TriangleAlert className="mb-2 h-6 w-6 text-red-700" aria-hidden />
      <p className="mb-3 text-red-800">{mensagem}</p>
      <Button variant="secondary" onClick={onTentarDeNovo}>Tentar de novo</Button>
    </div>
  );
}
