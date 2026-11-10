import { Search } from 'lucide-react';
import { Input } from '@/components/atoms';

interface CampoBuscaProps {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
}

export function CampoBusca({ rotulo, valor, onChange }: CampoBuscaProps) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden />
      <Input
        type="search"
        aria-label={rotulo}
        placeholder={rotulo}
        value={valor}
        onChange={(event) => onChange(event.target.value)}
        className="pl-9"
      />
    </div>
  );
}
