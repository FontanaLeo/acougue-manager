interface EsqueletoProps {
  className: string;
}

export function Esqueleto({ className }: EsqueletoProps) {
  return <div className={`rounded-md bg-stone-200 motion-safe:animate-pulse ${className}`} aria-hidden />;
}
