import { useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/atoms';
import { useJanelaModal } from '@/hooks';

interface ModalProps {
  titulo: string;
  largo?: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ titulo, largo = false, onClose, children }: ModalProps) {
  const tituloId = useId();
  const painel = useRef<HTMLDivElement>(null);

  useJanelaModal(painel, onClose);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloId}
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/50 sm:items-center sm:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={painel}
        tabIndex={-1}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl outline-none motion-safe:animate-surgir sm:rounded-2xl sm:p-6 ${largo ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={tituloId} className="text-lg font-bold text-stone-900">{titulo}</h2>
          <Button variant="ghost" tamanho="icone" icone={X} aria-label="Fechar" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}
