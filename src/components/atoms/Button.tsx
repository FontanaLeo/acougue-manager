import type { ButtonHTMLAttributes } from 'react';
import { LoaderCircle, type LucideIcon } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ghost-danger' | 'danger' | 'whatsapp';
type ButtonTamanho = 'md' | 'sm' | 'xs' | 'icone';

const CLASSES_VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-marca-700 text-white hover:bg-marca-800',
  secondary: 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-50',
  ghost: 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
  'ghost-danger': 'text-red-700 hover:bg-red-50',
  danger: 'bg-red-700 text-white hover:bg-red-800',
  whatsapp: 'bg-emerald-700 text-white hover:bg-emerald-800',
};

const CLASSES_TAMANHO: Record<ButtonTamanho, string> = {
  md: 'min-h-11 px-4 text-sm',
  sm: 'min-h-9 px-3 text-sm',
  xs: 'min-h-9 px-2 text-sm',
  // Botão só com ícone: precisa de aria-label.
  icone: 'h-9 w-9 shrink-0',
};

export function classesBotao(variant: ButtonVariant = 'primary', tamanho: ButtonTamanho = 'md'): string {
  return `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-marca-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${CLASSES_VARIANT[variant]} ${CLASSES_TAMANHO[tamanho]}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  tamanho?: ButtonTamanho;
  icone?: LucideIcon;
  carregando?: boolean;
}

export function Button({
  variant,
  tamanho,
  icone: Icone,
  carregando = false,
  type = 'button',
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classeIcone = tamanho === 'icone' ? 'h-5 w-5' : 'h-4 w-4';

  return (
    <button
      type={type}
      className={`${classesBotao(variant, tamanho)} ${className}`}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      {...props}
    >
      {carregando ? <LoaderCircle className={`${classeIcone} animate-spin`} aria-hidden /> : Icone && <Icone className={classeIcone} aria-hidden />}
      {children}
    </button>
  );
}
