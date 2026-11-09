import type { ReactNode } from 'react';

interface BadgeProps {
  cor: string;
  children: ReactNode;
}

export function Badge({ cor, children }: BadgeProps) {
  return (
    <span
      className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
      style={{ color: cor, backgroundColor: `${cor}1a` }}
    >
      {children}
    </span>
  );
}
