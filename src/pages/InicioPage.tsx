import { CabecalhoPagina, CardModulo, CLASSES_GRADE } from '@/components/molecules';
import { useResumoInicio, useTituloPagina } from '@/hooks';
import { MODULOS } from '@/lib/modulos';

export default function InicioPage() {
  useTituloPagina('Início');
  const status = useResumoInicio();

  return (
    <>
      <CabecalhoPagina titulo="Para onde você quer ir?" descricao="Escolha um módulo. Os avisos mostram o que precisa de atenção hoje." />
      <div className={CLASSES_GRADE}>
        {MODULOS.map((modulo) => <CardModulo key={modulo.caminho} modulo={modulo} status={status[modulo.caminho]} />)}
      </div>
    </>
  );
}
