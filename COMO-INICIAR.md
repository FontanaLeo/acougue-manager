# Como iniciar o Açougue Manager

## Requisitos

- Node.js e npm
- Um projeto no [Supabase](https://supabase.com) na região **South America (São Paulo)**. Escolha essa região específica: a opção geral "Americas" pode colocar o banco nos EUA.

## Preparar o Supabase

Faça estes passos uma vez:

1. No painel do projeto, abra o **SQL Editor** e execute, nesta ordem, o conteúdo de cada arquivo de `supabase/migrations`:
   - `20261109120000_estrutura_inicial.sql`
   - `20261109130000_lotes_margem_desossa_fiado.sql`
   - `20261109140000_direitos_dos_clientes.sql`
   - `20261109150000_cadastros.sql`
2. Opcional: execute `supabase/seed.sql` para carregar produtos, categorias e clientes de exemplo. Para começar do zero, pule este passo e cadastre tudo pelo sistema, em **Estoque → Novo produto** e **Financeiro → Nova categoria**.
3. Em **Authentication → Sign In / Providers**, desative a opção que permite novos cadastros (**Allow new users to sign up**). Sem isso, qualquer pessoa poderia criar uma conta e ver os dados.
4. Nas configurações do provedor **Email**, defina uma senha mínima de pelo menos 12 caracteres.
5. Em **Authentication → Users**, crie o usuário que vai entrar no sistema.
6. Copie a **URL do projeto** e a **chave pública** (`publishable` ou `anon`) em **Connect** ou **Project Settings → API Keys**.
7. Depois de entrar no sistema, abra **Privacidade**, preencha os dados do açougue e imprima o aviso para o balcão.

Nunca use a chave `secret` ou `service_role` no `.env` deste projeto: tudo que começa com `VITE_` fica visível no navegador.

## Preparação inicial

Execute uma vez, na pasta do projeto:

```powershell
cd "D:\Projeto integrador\acougue-manager"
npm.cmd install
Copy-Item .env.example .env
```

Depois, preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no arquivo `.env`.

## Conferir o Supabase

Este comando só faz consultas e diz o que ainda falta, sem alterar nada no projeto e sem mostrar a chave:

```powershell
npm.cmd run verificar:supabase
```

Ele confere o `.env`, a conexão, o bloqueio de novos cadastros, a região do banco e se as tabelas e funções existem e recusam quem não fez login. Os dados de exemplo e o usuário não aparecem nessa verificação: confira os dois entrando no sistema.

## Iniciar o sistema

```powershell
cd "D:\Projeto integrador\acougue-manager"
npm.cmd run dev -- --host 127.0.0.1
```

Abra o sistema em <http://127.0.0.1:5173/> e entre com o usuário criado no Supabase. Para encerrar, pressione `Ctrl+C` no terminal.

## Diagramas

Os diagramas do documento do projeto ficam em `docs/diagramas`:

- [Diagrama 1 – Caso de uso geral](docs/diagramas/diagrama1_casos_de_uso.png)
- [Diagrama 2 – Diagrama de classes](docs/diagramas/diagrama2_classes.png)
- [Diagrama 3 – Arquitetura](docs/diagramas/diagrama3_arquitetura.png)
- [Diagrama 4 – Fluxo de entrada no sistema e de registro de saída](docs/diagramas/diagrama4_fluxo.png)
- [Diagrama 5 – Features implementadas vs pretendidas](docs/diagramas/diagrama5_features.png)
