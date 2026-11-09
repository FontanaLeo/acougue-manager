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
- `/estoque`: controle do estoque, com entradas, saídas e alerta de estoque mínimo.
- `/financeiro`: saldos por categoria e saldo líquido geral, com filtro de lançamentos.

## De onde vêm os dados

O React fala direto com o Supabase, e os cards são gerados a partir dos dados: cada item novo no banco vira um card sem mudar a tela.

- `supabase/migrations`: tabelas, regras de acesso e funções.
- `supabase/seed.sql`: dados de exemplo.

Só usuários logados leem os dados, e toda escrita passa pelas funções `movimentar_estoque` e `adicionar_transacao`, que validam as regras e devolvem as mensagens de erro em português.

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
