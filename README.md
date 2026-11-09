# Açougue Manager — Protótipo com Laravel, Vite e TypeScript

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

- `/estoque`: controle do estoque mock, persistido na sessão, com movimentações via AJAX.
- `/financeiro`: saldos do açougue, da família e saldo líquido geral, com filtro de transações.

## De onde vêm os dados

Os cards são gerados a partir dos dados, então cada item novo vira um card sem mudar a tela. Por enquanto os dados são mocks em `database/mock/*.json`, com o formato das futuras tabelas (`produtos`, `categorias` e `transacoes`). As alterações feitas pela tela ficam na sessão e no cache.

Para usar o Supabase, crie classes que implementem `App\Repositories\EstoqueRepository` e `App\Repositories\FinanceiroRepository` e troque as classes Mock em `app/Providers/AppServiceProvider.php`.
