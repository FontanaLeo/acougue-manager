import type { InputHTMLAttributes } from 'react';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" {...props} />;
}
