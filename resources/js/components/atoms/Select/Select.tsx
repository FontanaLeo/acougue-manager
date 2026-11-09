import type { SelectHTMLAttributes } from 'react';

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="mt-1 w-full rounded-lg border border-gray-300 p-2.5" {...props} />;
}
