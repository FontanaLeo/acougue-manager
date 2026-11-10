import { useState, type ReactNode } from 'react';
import { Printer, Trash2 } from 'lucide-react';
import { Button, CLASSES_SUPERFICIE } from '@/components/atoms';
import { AreaImpressao, AvisoPrivacidade, CabecalhoPagina, ConteudoConsulta } from '@/components/molecules';
import { DadosEmpresaForm, ExcluirClienteModal } from '@/components/organisms';
import { useGetClientes, useGetEmpresa, useTituloPagina } from '@/hooks';
import { ANOS_DE_GUARDA, passouPrazoDeGuarda } from '@/lib/fiado';

interface SecaoProps {
  titulo: string;
  descricao: string;
  children: ReactNode;
}

function Secao({ titulo, descricao, children }: SecaoProps) {
  return (
    <section className={`${CLASSES_SUPERFICIE} p-5`}>
      <h2 className="text-lg font-semibold text-stone-900">{titulo}</h2>
      <p className="mb-4 mt-0.5 text-sm text-stone-600">{descricao}</p>
      {children}
    </section>
  );
}

const CARREGANDO = <p className="text-sm text-stone-500">Carregando...</p>;

const PASSOS = [
  { titulo: 'Ver ou receber os dados', texto: 'No Fiado, use "Ver dados" no card do cliente. Dá para imprimir ou baixar a planilha.' },
  { titulo: 'Corrigir', texto: 'Use "Editar" no card do cliente.' },
  { titulo: 'Apagar', texto: 'Com a dívida quitada, use "Excluir dados". O nome e o telefone somem; os valores ficam sem identificação.' },
  { titulo: 'Prazos', texto: 'Responda na hora quando der. Para pequenos negócios, a confirmação simples pode levar até 15 dias e a declaração completa até 30 dias.' },
];

export default function PrivacidadePage() {
  useTituloPagina('Privacidade');
  const empresa = useGetEmpresa();
  const clientes = useGetClientes();
  const [excluirId, setExcluirId] = useState<number | null>(null);

  const clienteParaExcluir = clientes.data?.find((cliente) => cliente.id === excluirId);

  return (
    <>
      <CabecalhoPagina titulo="Privacidade" descricao="O que a LGPD pede para os dados dos clientes do fiado, em um lugar só." />

      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <Secao titulo="Dados do açougue" descricao="Aparecem no aviso do balcão e no relatório que o cliente pode pedir.">
          <ConteudoConsulta consulta={empresa} carregando={CARREGANDO}>
            {(dados) => <DadosEmpresaForm key={dados?.nome ?? 'vazio'} empresa={dados} />}
          </ConteudoConsulta>
        </Secao>

        <Secao titulo="Aviso para o balcão" descricao="Imprima e deixe à vista, ou mostre antes de cadastrar alguém no fiado.">
          {empresa.data ? (
            <>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm">
                <AvisoPrivacidade empresa={empresa.data} />
              </div>
              <div className="mt-4 flex justify-end">
                <Button icone={Printer} onClick={() => window.print()}>Imprimir aviso</Button>
              </div>
              <AreaImpressao>
                <AvisoPrivacidade empresa={empresa.data} />
              </AreaImpressao>
            </>
          ) : (
            <p className="text-sm text-stone-500">Preencha os dados do açougue para gerar o aviso.</p>
          )}
        </Secao>

        <Secao
          titulo="Clientes para revisar"
          descricao={`Quitados e sem movimentação há mais de ${ANOS_DE_GUARDA} anos. Os dados que identificam a pessoa já podem ser apagados.`}
        >
          <ConteudoConsulta consulta={clientes} carregando={CARREGANDO}>
            {(lista) => {
              const paraRevisar = lista.filter(passouPrazoDeGuarda);

              if (paraRevisar.length === 0) return <p className="text-sm text-stone-500">Nenhum cliente passou do prazo.</p>;

              return (
                <ul className="divide-y divide-stone-100">
                  {paraRevisar.map((cliente) => (
                    <li key={cliente.id} className="flex items-center justify-between gap-3 py-2">
                      <span className="min-w-0 break-words text-sm text-stone-800">{cliente.nome}</span>
                      <Button variant="ghost" tamanho="sm" icone={Trash2} aria-label={`Excluir dados de ${cliente.nome}`} onClick={() => setExcluirId(cliente.id)}>
                        Excluir dados
                      </Button>
                    </li>
                  ))}
                </ul>
              );
            }}
          </ConteudoConsulta>
        </Secao>

        <Secao titulo="Quando um cliente pedir" descricao="Pedidos sobre os próprios dados são gratuitos.">
          <ol className="space-y-3 text-sm">
            {PASSOS.map((passo, indice) => (
              <li key={passo.titulo} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-marca-50 text-xs font-bold text-marca-700">{indice + 1}</span>
                <span>
                  <strong className="text-stone-900">{passo.titulo}.</strong> <span className="text-stone-700">{passo.texto}</span>
                </span>
              </li>
            ))}
          </ol>
        </Secao>
      </div>

      {clienteParaExcluir && <ExcluirClienteModal cliente={clienteParaExcluir} onClose={() => setExcluirId(null)} />}
    </>
  );
}
