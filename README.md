# Açougue Manager — Protótipo com Laravel, React e TypeScript

## Requisitos

- PHP 8.2 ou superior e Composer
- Node.js e npm

## Instalação e execução

Consulte [COMO-INICIAR.md](COMO-INICIAR.md) para os comandos testados neste ambiente, incluindo a ativação das extensões PHP necessárias e a inicialização do Vite no PowerShell.

Para gerar os arquivos de produção, execute:

```bash
npm.cmd run build
```

## Módulos

- `/estoque`: controle do estoque mock, persistido na sessão, com movimentações pela API.
- `/financeiro`: saldos do açougue, da família e saldo líquido geral, com filtro de transações.

## De onde vêm os dados

Os cards são gerados a partir dos dados, então cada item novo vira um card sem mudar a tela. Por enquanto os dados são mocks em `database/mock/*.json`, com o formato das futuras tabelas (`produtos`, `categorias` e `transacoes`). As alterações feitas pela tela ficam na sessão e no cache.

Para usar o Supabase, crie classes que implementem `App\Repositories\EstoqueRepository` e `App\Repositories\FinanceiroRepository` e troque as classes Mock em `app/Providers/AppServiceProvider.php`. O frontend continua igual, porque só conversa com a API do Laravel.

## Padrão do frontend

O código fica em `resources/js` e os dados sempre seguem este caminho:

```text
componente → hook (React Query) → service → API do Laravel
```

- `types` e `enums`: formato dos dados e valores fixos.
- `services`: funções `async` que chamam a API, sem nada de React.
- `lib/queryKeys.ts`: todas as chaves do React Query.
- `hooks`: um hook por consulta ou ação, e as regras de cada página, como em `useFinanceiroPage`.
- `components`: dividido em `atoms`, `molecules`, `organisms` e `layout`, recebendo os dados por props.
- `pages`: juntam hooks e componentes, e tratam os estados de carregando, erro e sucesso.

Use imports absolutos com `@/`, como `@/hooks` e `@/components/atoms`.
