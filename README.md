# codex-agents-blueprint

Catalogo publico de blueprints reutilizaveis para times que querem estruturar o uso do Codex com agentes, skills, bootstrap operacional e convencoes de trabalho por contexto.

Este repositorio existe para transformar setups recorrentes em pontos de partida claros, copiaveis e revisaveis. Em vez de reinventar a base a cada novo projeto, a proposta aqui e manter um conjunto curado de blueprints para diferentes stacks, fluxos e niveis de maturidade.

## Visao geral

Cada blueprint deste catalogo foi pensada para funcionar como referencia publica e como base de bootstrap:

- explica o problema que resolve
- documenta como o fluxo deve ser operado
- expoe agentes, skills e artefatos reutilizaveis
- ajuda o time a sair do zero com menos ambiguidade

O foco da raiz do repositorio e orientar descoberta e adocao. Os detalhes operacionais vivem dentro de cada blueprint.

## O que existe em uma blueprint

A estrutura pode evoluir de forma independente, mas o formato recomendado hoje e:

- `README.md`: visao geral, modos de uso e onboarding da blueprint
- `bootstrap/`: scaffold copiavel para o repositorio de destino
- `agents/`: catalogo publico dos agentes incluidos
- `skills/`: catalogo publico das skills incluidas

Nem toda blueprint futura precisa ter exatamente os mesmos diretorios, mas a navegacao deve continuar simples e legivel para quem chega pela primeira vez.

## Como comecar

Se voce esta explorando opcoes:

1. Leia a tabela de blueprints abaixo.
2. Abra o `README.md` da blueprint que mais se aproxima do seu caso.
3. Confirme se o fluxo, os agentes e os artefatos batem com a realidade do seu projeto.

Se voce ja escolheu uma blueprint:

1. Entre no diretorio da blueprint desejada.
2. Leia o `README.md` dela por completo.
3. Copie ou adapte o conteudo de `bootstrap/` para o repositorio de destino.
4. Siga a documentacao interna da propria blueprint para instalar, validar e operar o fluxo.

## Blueprints disponiveis

Esta tabela funciona como indice do catalogo e inclui blueprints ja publicadas no repositorio, alem de blueprints consideradas validas para adicao a partir de PRs abertas.

| Blueprint | Foco | Quando usar |
| --- | --- | --- |
| [`unreal-engine-coder`](./unreal-engine-coder/README.md) | Projetos Unreal Engine com harness engineering, subagents, skills e fluxo de evidence/handoff | Quando o time quer operar um repositorio Unreal com disciplina de task dossier, worktree, evidence pack e opcionalmente MCP |
| [`ai-webapp-coder`](./ai-webapp-coder/README.md) | Monorepos web com modelos, `.prototype`, backlog opcional, evidence e PR workflow | Quando o time quer estruturar apps web e runtimes de modelos com worktrees, paridade visual, validacao e handoff de PR |
| [`backend-platform-coder-go`](./backend-platform-coder-go/README.md) | Servicos Go-first com contratos, storage, concorrencia e operacao | Quando o time quer um bootstrap forte para desenho de servico, workers, schema e release com evidencia |
| [`design-system-coder`](./design-system-coder/README.md) | Prototipacao code-first, mocks, componentes e evidence visual | Quando o time quer transformar briefs e `.prototype/` em mocks revisaveis, com acessibilidade e handoff visual claros |
| [`backend-platform-coder-ts-typeorm`](./backend-platform-coder-ts-typeorm/README.md) | Backends Node/TypeScript com TypeORM, contratos, migrations e integracoes | Quando o time quer um bootstrap operacional para API, fila, modelagem de dados e release com evidencia |
| [`backend-platform-coder-agnostic`](./backend-platform-coder-agnostic/README.md) | Arquitetura backend agnostica, contratos, estrutura de dados e readiness | Quando o time quer um blueprint forte em decisao tecnica e handoff, sem travar linguagem ou framework |
| [`mobile-app-coder`](./mobile-app-coder/README.md) | Expo/React Native, `.prototype`, evidence visual e operacao Android/iOS | Quando o time quer estruturar apps mobile com skills explicitas para Android Studio, Xcode e handoff visual |

## Como contribuir

Se voce quiser adicionar uma nova blueprint ao catalogo:

1. Crie uma pasta propria para a blueprint.
2. Garanta um `README.md` forte na raiz dessa pasta.
3. Organize o material publico em torno de `bootstrap/`, `agents/` e `skills/` quando fizer sentido.
4. Adicione uma linha na tabela desta `README.md` com nome, foco e quando usar.
5. Mantenha a descricao curta o suficiente para que o catalogo continue escaneavel.

A raiz do repositorio deve continuar enxuta. O objetivo aqui nao e concentrar toda a documentacao, e sim facilitar descoberta, comparacao e onboarding para cada blueprint.
