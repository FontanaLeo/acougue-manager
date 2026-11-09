# Como iniciar o Açougue Manager

## Requisitos

- PHP instalado em `C:\Program Files\PHP\current\php.exe`
- Composer
- Node.js e npm

## Preparação inicial

Execute estes passos uma vez, na pasta do projeto, caso ainda não tenham sido feitos:

```powershell
cd "D:\Projeto integrador\acougue-manager"
composer install
Copy-Item .env.example .env
& "C:\Program Files\PHP\current\php.exe" -d extension=mbstring -d extension=openssl artisan key:generate
npm.cmd install
```

Se o arquivo `.env` já existir e a chave da aplicação já tiver sido criada, não repita `Copy-Item` nem `key:generate`.

## Iniciar o servidor

Abra dois terminais PowerShell na pasta do projeto. Deixe os dois abertos enquanto estiver usando o sistema.

No primeiro terminal, inicie o Laravel com as extensões necessárias:

```
powershell
cd "D:\Projeto integrador\acougue-manager"
& "C:\Program Files\PHP\current\php.exe" -d extension=mbstring -d extension=openssl -S 127.0.0.1:8000 -t public public/index.php
```

No segundo terminal, inicie o Vite:

```powershell
cd "D:\Projeto integrador\acougue-manager"
npm.cmd run dev -- --host 127.0.0.1
```

Abra o sistema em <http://127.0.0.1:8000/>. A página inicial redireciona para o estoque. O financeiro fica em <http://127.0.0.1:8000/financeiro>.

Para encerrar, pressione `Ctrl+C` em cada terminal.

## Abrir o diagrama no Mermaid Live

1. Acesse <https://mermaid.live/edit>.
2. Escolha abaixo o diagrama que deseja visualizar e copie somente o código dentro do bloco Mermaid correspondente.
3. No Mermaid Live, substitua o conteúdo do painel esquerdo pelo código copiado.
4. O desenho será atualizado no painel de visualização. Para exportar, use os controles de download do Mermaid Live.

## Diagrama de fluxo do sistema

Este fluxograma mostra o caminho principal das ações nos módulos de Estoque e Financeiro.

```mermaid
flowchart TD
    U[Usuário] --> M{Escolhe módulo}

    M -->|Estoque| E1[Abre a tela de estoque]
    E1 --> E2[EstoqueController lê os itens pelo EstoqueRepository]
    E2 --> E3[Blade gera um card por item]
    E3 --> E4{Movimentar estoque?}
    E4 -->|Sim| E5[TypeScript envia POST /estoque/movimentar]
    E5 --> E6[Controller valida e atualiza pelo repositório]
    E6 --> E7[Resposta JSON traz os cards atualizados]

    M -->|Financeiro| F1[Abre a tela financeira]
    F1 --> F2[FinanceiroController lê categorias e transações pelo FinanceiroRepository]
    F2 --> F3[Calcula os saldos por categoria]
    F3 --> F4[Blade gera os cards de saldo, os filtros e os cards de transações]
    F4 --> F5{Adicionar lançamento?}
    F5 -->|Sim| F6[Informa tipo, categoria, descrição e valor]
    F6 --> F7[TypeScript envia POST /financeiro/transacoes]
    F7 --> F8[Controller valida e salva pelo repositório]
    F8 --> F9[Resposta JSON traz os cards atualizados]
```

## Diagrama de casos de uso

O Mermaid não possui um tipo nativo para diagrama UML de casos de uso. Este fluxograma representa o ator e as funcionalidades de forma aproximada:

```mermaid
flowchart LR
    usuario[Usuário]

    subgraph sistema [Açougue Manager]
        UC1([Visualizar estoque])
        UC2([Movimentar estoque])
        UC3([Visualizar saldos financeiros])
        UC4([Filtrar transações])
        UC5([Adicionar lançamento])
        UC6([Informar tipo, categoria, descrição e valor])
    end

    usuario --> UC1
    usuario --> UC2
    usuario --> UC3
    usuario --> UC4
    usuario --> UC5
    UC5 -. inclui .-> UC6
```

## Diagrama de classes

Este diagrama representa as classes PHP implementadas. Os dados ainda vêm dos mocks em `database/mock`; para usar o Supabase, basta criar novas implementações das duas interfaces.

```mermaid
classDiagram
    class Controller {
        <<abstract>>
    }

    class EstoqueController {
        +index()
        +movimentar(Request request)
    }

    class FinanceiroController {
        +index()
        +store(Request request)
        -montarResumo(array categorias, array transacoes) array
    }

    class Request {
        +validate(rules)
    }

    class EstoqueRepository {
        <<interface>>
        +listar() array
        +movimentar(int id, string tipo, float quantidade) bool
    }

    class FinanceiroRepository {
        <<interface>>
        +categorias() array
        +transacoes() array
        +adicionarTransacao(array dados)
    }

    class MockEstoqueRepository
    class MockFinanceiroRepository

    Controller <|-- EstoqueController
    Controller <|-- FinanceiroController
    EstoqueController ..> Request : recebe
    FinanceiroController ..> Request : recebe
    EstoqueController --> EstoqueRepository : usa
    FinanceiroController --> FinanceiroRepository : usa
    EstoqueRepository <|.. MockEstoqueRepository
    FinanceiroRepository <|.. MockFinanceiroRepository
```
