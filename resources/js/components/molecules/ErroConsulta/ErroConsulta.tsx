import { Button } from '@/components/atoms';

interface ErroConsultaProps {
  mensagem: string;
  onTentarDeNovo: () => void;
}

export function ErroConsulta({ mensagem, onTentarDeNovo }: ErroConsultaProps) {
  return (
    <div className="py-8 text-center" role="alert">
      <p className="mb-3 text-red-700">{mensagem}</p>
      <Button variant="secondary" onClick={onTentarDeNovo}>Tentar de novo</Button>
    </div>
  );
}
