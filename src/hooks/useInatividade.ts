import { useEffect } from 'react';
import { atividadeJaRegistrada, inativoDemais, registrarAtividade } from '@/lib/inatividade';

const EVENTOS_DE_USO = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;
const INTERVALO_REGISTRO_MS = 10_000;
const INTERVALO_CONFERENCIA_MS = 15_000;

export function useInatividade(ativa: boolean, aoExpirar: () => void) {
  useEffect(() => {
    if (!ativa) return undefined;
    if (!atividadeJaRegistrada()) registrarAtividade();

    let ultimoRegistro = 0;

    const aoUsar = () => {
      if (Date.now() - ultimoRegistro < INTERVALO_REGISTRO_MS) return;

      ultimoRegistro = Date.now();
      registrarAtividade();
    };
    const conferir = () => {
      if (inativoDemais()) aoExpirar();
    };

    EVENTOS_DE_USO.forEach((evento) => window.addEventListener(evento, aoUsar, { passive: true }));
    document.addEventListener('visibilitychange', conferir);
    const relogio = window.setInterval(conferir, INTERVALO_CONFERENCIA_MS);

    return () => {
      EVENTOS_DE_USO.forEach((evento) => window.removeEventListener(evento, aoUsar));
      document.removeEventListener('visibilitychange', conferir);
      window.clearInterval(relogio);
    };
  }, [ativa, aoExpirar]);
}
