import { Badge } from '@/components/atoms';
import { DIAS_ALERTA, diasParaVencer } from '@/lib/validade';
import type { Tom } from '@/types';

function rotulo(dias: number): string {
  if (dias < 0) return 'Vencido';
  if (dias === 0) return 'Vence hoje';
  if (dias === 1) return 'Vence amanhã';
  return `Vence em ${dias} dias`;
}

function tomDaValidade(dias: number): Tom {
  if (dias <= 0) return 'perigo';
  return dias <= DIAS_ALERTA ? 'alerta' : 'sucesso';
}

interface BadgeValidadeProps {
  validade: string;
  somenteAlerta?: boolean;
}

export function BadgeValidade({ validade, somenteAlerta = false }: BadgeValidadeProps) {
  const dias = diasParaVencer(validade);

  if (somenteAlerta && dias > DIAS_ALERTA) return null;

  return <Badge tom={tomDaValidade(dias)}>{rotulo(dias)}</Badge>;
}
