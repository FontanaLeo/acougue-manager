import type { InputHTMLAttributes } from 'react';

// Sem margem: o espaço até o rótulo fica com o CampoFormulario.
export const CLASSES_CAMPO =
  'block w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base font-normal text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-900/10 sm:text-sm';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return <input className={`${CLASSES_CAMPO} ${className}`} {...props} />;
}

// Valores em reais, com centavos.
export function InputMoeda(props: InputProps) {
  return <Input type="number" inputMode="decimal" min="0.01" step="0.01" {...props} />;
}

// Pesos em kg, com uma casa decimal.
export function InputKg(props: InputProps) {
  return <Input type="number" inputMode="decimal" min="0.1" step="0.1" {...props} />;
}
