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

## Trocar a região do projeto

Um projeto do Supabase não muda de região depois de criado. Para levar o sistema para São Paulo, crie outro projeto e repita a preparação:

1. Em [supabase.com/dashboard](https://supabase.com/dashboard), clique em **New project**. Em **Region**, escolha **South America (São Paulo)**. O plano gratuito permite dois projetos, então o antigo pode continuar existindo até o fim da troca.
2. Guarde a senha do banco que o Supabase pedir em um gerenciador de senhas. O app não usa essa senha.
3. No projeto novo, faça todos os passos de [Preparar o Supabase](#preparar-o-supabase).
4. No `.env`, troque `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` pelos valores do projeto novo e reinicie o `npm.cmd run dev`.
5. Rode `npm.cmd run verificar:supabase`. Ele deve mostrar **Banco hospedado em São Paulo (sa-east-1)**.
6. Entre no sistema e confira se tudo aparece. Se o projeto antigo tinha dados reais, eles precisam ser levados antes do passo seguinte.
7. Apague o projeto antigo em **Project Settings → General → Delete project**. Isso apaga os dados dele para sempre.

## Iniciar o sistema

```powershell
cd "D:\Projeto integrador\acougue-manager"
npm.cmd run dev -- --host 127.0.0.1
```

Abra o sistema em <http://127.0.0.1:5173/> e entre com o usuário criado no Supabase. Para encerrar, pressione `Ctrl+C` no terminal.

## Abrir o diagrama no Mermaid Live

1. Acesse <https://mermaid.live/edit>.
2. Escolha abaixo o diagrama que deseja visualizar e copie somente o código dentro do bloco Mermaid correspondente.
3. No Mermaid Live, substitua o conteúdo do painel esquerdo pelo código copiado.
4. O desenho será atualizado no painel de visualização. Para exportar, use os controles de download do Mermaid Live.

## Diagrama de fluxo do sistema

Este fluxograma mostra o caminho principal das ações nos módulos de Estoque e Financeiro.

```mermaid
flowchart TD
    U[Usuário] --> L[Entra com e-mail e senha]
    L --> M{Escolhe módulo}

    M -->|Estoque| E1[Abre a tela de estoque]
    E1 --> E2[useGetEstoque busca os produtos no Supabase]
    E2 --> E3[React gera um card por item]
    E3 --> E4{Movimentar estoque?}
    E4 -->|Sim| E5[useMovimentarEstoque chama registrar_entrada ou registrar_saida]
    E5 --> E6[Função valida e atualiza o produto e os lotes]
    E6 --> E7[React Query busca a lista de novo e atualiza os cards]

    M -->|Financeiro| F1[Abre a tela financeira]
    F1 --> F2[useFinanceiroPage busca categorias e transações no Supabase]
    F2 --> F3[Calcula os saldos por categoria]
    F3 --> F4[React gera os cards de saldo, os filtros e os cards de transações]
    F4 --> F5{Adicionar lançamento?}
    F5 -->|Sim| F6[Informa tipo, categoria, descrição e valor]
    F6 --> F7[useAdicionarTransacao chama a função adicionar_transacao]
    F7 --> F8[Função valida e grava o lançamento]
    F8 --> F9[React Query busca os lançamentos de novo e atualiza os cards]
```

## Diagrama de casos de uso

O Mermaid não possui um tipo nativo para diagrama UML de casos de uso. Este fluxograma representa o ator e as funcionalidades de forma aproximada:

```mermaid
flowchart LR
    usuario[Usuário]

    subgraph sistema [Açougue Manager]
        UC0([Entrar no sistema])
        UC1([Visualizar estoque])
        UC2([Movimentar estoque])
        UC3([Visualizar saldos financeiros])
        UC4([Filtrar transações])
        UC5([Adicionar lançamento])
        UC6([Informar tipo, categoria, descrição e valor])
    end

    usuario --> UC0
    usuario --> UC1
    usuario --> UC2
    usuario --> UC3
    usuario --> UC4
    usuario --> UC5
    UC5 -. inclui .-> UC6
```

## Diagrama de módulos

Este diagrama representa como as camadas do frontend se ligam ao Supabase.

```mermaid
flowchart LR
    subgraph navegador [Navegador]
        pages[pages]
        components[components]
        hooks[hooks]
        services[services]
    end

    subgraph supabase [Supabase]
        auth[Authentication]
        rest[Consultas com RLS]
        funcoes[Funções SQL]
        banco[(PostgreSQL)]
    end

    pages --> components
    pages --> hooks
    hooks --> services
    services --> auth
    services --> rest
    services --> funcoes
    rest --> banco
    funcoes --> banco
```
