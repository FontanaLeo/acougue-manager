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

Os dados são mocks em memória/sessão, sem banco de dados. A próxima etapa pode substituir os mocks por Models e Migrations Eloquent.
