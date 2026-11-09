import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary';

const CLASSES_VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-red-800 text-white hover:bg-red-900',
  secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-lg disabled:opacity-50 ${CLASSES_VARIANT[variant]}`}
      {...props}
    />
  );
}
