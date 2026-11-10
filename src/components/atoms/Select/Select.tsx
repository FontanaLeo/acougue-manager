import type { SelectHTMLAttributes } from 'react';
import { CLASSES_CAMPO } from '@/components/atoms/Input/Input';

export function Select({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${CLASSES_CAMPO} ${className}`} {...props} />;
}
