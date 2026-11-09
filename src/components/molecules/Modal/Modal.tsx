import { useEffect, useId, type ReactNode } from 'react';

interface ModalProps {
  titulo: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ titulo, onClose, children }: ModalProps) {
  const tituloId = useId();

  useEffect(() => {
    const fecharComEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', fecharComEscape);
    return () => document.removeEventListener('keydown', fecharComEscape);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 id={tituloId} className="text-lg font-bold text-gray-800">{titulo}</h2>
          <button type="button" aria-label="Fechar" onClick={onClose} className="rounded p-2 text-gray-500 hover:bg-gray-100">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
