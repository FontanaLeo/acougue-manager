import type { ReactNode } from 'react';
import { CartoesCarregando } from '@/components/molecules/CartoesCarregando/CartoesCarregando';
import { ErroConsulta } from '@/components/molecules/ErroConsulta/ErroConsulta';

interface Consulta<T> {
  data: T | undefined;
  error: Error | null;
  refetch: () => unknown;
}

interface ConteudoConsultaProps<T> {
  consulta: Consulta<T>;
  carregando?: ReactNode;
  children: (dados: T) => ReactNode;
}

// Carregando, erro ou dados. Com dados em memória, uma recarga que falha não esconde a tela.
export function ConteudoConsulta<T>({ consulta, carregando = <CartoesCarregando />, children }: ConteudoConsultaProps<T>) {
  if (consulta.data !== undefined) return <>{children(consulta.data)}</>;
  if (consulta.error) return <ErroConsulta mensagem={consulta.error.message} onTentarDeNovo={() => void consulta.refetch()} />;
  return <>{carregando}</>;
}
