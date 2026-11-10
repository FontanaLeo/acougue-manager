import { useEffect, useState, type RefObject } from 'react';

const SELETOR_FOCAVEL = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';

// Comportamento de toda janela que cobre a tela: trava o fundo, prende o Tab,
// fecha com Escape e devolve o foco a quem abriu.
export function useJanelaModal(painel: RefObject<HTMLElement | null>, onClose: () => void) {
  // Guardado na primeira renderização, antes de um campo com autoFocus pegar o foco.
  const [focoAnterior] = useState(() => document.activeElement as HTMLElement | null);

  useEffect(() => {
    const rolagemAnterior = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    if (!painel.current?.contains(document.activeElement)) painel.current?.focus();

    return () => {
      document.body.style.overflow = rolagemAnterior;
      focoAnterior?.focus();
    };
  }, [painel, focoAnterior]);

  useEffect(() => {
    const aoTeclar = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !painel.current) return;

      const focaveis = painel.current.querySelectorAll<HTMLElement>(SELETOR_FOCAVEL);
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault();
        ultimo?.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primeiro?.focus();
      }
    };

    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [painel, onClose]);
}
