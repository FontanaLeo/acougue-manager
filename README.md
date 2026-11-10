# Açougue Manager — Protótipo com React, TypeScript e Supabase

## Requisitos

- Node.js e npm
- Um projeto no [Supabase](https://supabase.com)

## Instalação e execução

Consulte [COMO-INICIAR.md](COMO-INICIAR.md) para preparar o Supabase e iniciar o sistema.

Para gerar os arquivos de produção, execute:

```bash
npm.cmd run build
```

## Módulos

- `/`: tela inicial, aberta logo após o login, para escolher o módulo.
- `/estoque`: controle do estoque. Cada entrada vira um lote com custo e validade, e cada saída tem um motivo.
- `/lotes`: lotes do que vence primeiro ao último e quanto dinheiro se perdeu no mês, por motivo.
- `/precos`: margem de cada corte, aviso de aumento do fornecedor e sugestão de preço.
- `/desossa`: rendimento de cada compra e custo de cada corte, que entram no estoque como lotes.
- `/fiado`: clientes, dívidas, pagamentos e lembrete pronto para o WhatsApp. Cada cliente pode ter os dados corrigidos, consultados (impressão ou planilha) e excluídos.
- `/financeiro`: saldos por categoria e saldo líquido geral, com filtro de lançamentos.
- `/privacidade`: dados do açougue, aviso de privacidade para imprimir, clientes que passaram do prazo de guarda e como atender pedidos dos clientes.

## Privacidade e segurança

- A sessão termina depois de 30 minutos sem uso, e o botão Sair funciona mesmo sem internet.
- Ao terminar a sessão, os dados carregados saem da memória do navegador.
- Os estilos são gerados no próprio projeto, sem scripts de terceiros, e o site gerado por `npm.cmd run build` traz uma política de segurança (CSP) que só permite falar com o Supabase.
- Erros técnicos do banco não aparecem na tela; só as mensagens das regras do sistema.
- Excluir os dados de um cliente apaga nome, telefone e descrições, e mantém os valores sem identificação. Cliente com dívida não pode ser excluído.

## De onde vêm os dados

O React fala direto com o Supabase, e os cards são gerados a partir dos dados: cada item novo no banco vira um card sem mudar a tela.

- `supabase/migrations`: tabelas, regras de acesso e funções.
- `supabase/seed.sql`: dados de exemplo.

Só usuários logados leem os dados, e toda escrita passa por funções SQL, como `registrar_entrada` e `adicionar_transacao`, que validam as regras e devolvem as mensagens de erro em português.

## Padrão do frontend

O código fica em `src` e os dados sempre seguem este caminho:

```text
componente → hook (React Query) → service → Supabase
```

- `types` e `enums`: formato dos dados e valores fixos.
- `services`: funções `async` que chamam o Supabase, sem nada de React.
- `lib/queryKeys.ts`: todas as chaves do React Query.
- `hooks`: um hook por consulta ou ação, e as regras de cada página, como em `useFinanceiroPage`.
- `components`: dividido em `atoms`, `molecules`, `organisms` e `layout`, recebendo os dados por props.
- `pages`: juntam hooks e componentes, e tratam os estados de carregando, erro e sucesso.

Use imports absolutos com `@/`, como `@/hooks` e `@/components/atoms`.

### Peças compartilhadas

Antes de escrever algo novo, veja se uma destas já resolve:

- `lib/erros.ts` → `semErro`: toda chamada ao Supabase passa por ela, que esconde os erros técnicos.
- `hooks/useMutacao.ts`: base de toda ação que grava; recarrega as listas e mostra o aviso de sucesso.
- `molecules/ModalFormulario`: janela com formulário, faixa de erro e os botões Cancelar e enviar.
- `molecules/ConteudoConsulta`: mostra carregando, erro ou os dados de uma consulta.
- `molecules/BarraFiltros` e `molecules/GradeCartoes`: filtros com contagem e a grade de cards com estado vazio.
- `lib/estoque.ts`, `lib/validade.ts`, `lib/margem.ts`, `lib/fiado.ts` e `lib/desossa.ts`: as regras do negócio (estoque baixo, vencido, preço defasado, quem deve, rendimento), usadas por todas as telas.
- `lib/rotas.ts`: os caminhos das telas.
