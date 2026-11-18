import { Beef } from 'lucide-react';

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 font-bold tracking-tight">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-marca-700 text-white">
        <Beef className="h-5 w-5" aria-hidden />
      </span>
      Açougue Manager
    </span>
  );
}
