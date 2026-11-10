import { ANOS_DE_GUARDA } from '@/lib/fiado';
import type { Empresa } from '@/types';

interface AvisoPrivacidadeProps {
  empresa: Empresa;
}

const TOPICOS = (empresa: Empresa) => [
  { titulo: 'Para quê', texto: 'Para controlar as compras a prazo e os pagamentos, e para lembrar você de valores em aberto.' },
  { titulo: 'Por quanto tempo', texto: `Enquanto houver dívida e por até ${ANOS_DE_GUARDA} anos depois da última movimentação. Depois disso, os dados que identificam você são apagados.` },
  { titulo: 'Com quem', texto: 'Os dados ficam em um serviço de banco de dados na nuvem (Supabase). Lembretes são enviados pelo WhatsApp. Não vendemos seus dados.' },
  { titulo: 'Seus direitos', texto: 'Você pode saber quais dados temos, pedir uma cópia, corrigir o que estiver errado e pedir a exclusão do que não for necessário. É gratuito.' },
  { titulo: 'Fale com a gente', texto: empresa.contato },
];

export function AvisoPrivacidade({ empresa }: AvisoPrivacidadeProps) {
  return (
    <div className="space-y-3 text-stone-800">
      <h2 className="text-2xl font-bold text-stone-900">Como cuidamos dos seus dados</h2>
      <p>Quando você compra fiado no <strong>{empresa.nome}</strong>, anotamos seu nome, seu telefone, suas compras e seus pagamentos.</p>
      <dl className="space-y-2">
        {TOPICOS(empresa).map((topico) => (
          <div key={topico.titulo}>
            <dt className="font-semibold text-stone-900">{topico.titulo}</dt>
            <dd>{topico.texto}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-stone-500">Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).</p>
    </div>
  );
}
