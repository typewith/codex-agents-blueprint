# codex-agents-blueprint

Repositorio de blueprints reutilizaveis para times que querem estruturar o uso do Codex com agentes, skills, bootstrap operacional e convencoes de trabalho por contexto.

Hoje o repositorio ja inclui blueprints para Unreal Engine e para monorepos web com modelos, e a ideia e continuar crescendo como um catalogo de referencias publicas para diferentes stacks, fluxos e niveis de maturidade.

## Objetivo

Este repositorio existe para:

- centralizar blueprints compartilhaveis de agentes e workflows
- reduzir o trabalho de montar estruturas repetidas do zero
- servir como base de bootstrap para novos repositorios
- manter documentacao publica de como cada blueprint deve ser usada

Em vez de tratar cada setup como um projeto isolado, a proposta aqui e organizar um conjunto de blueprints curadas, com fronteiras claras e documentacao de entrada.

## Como usar este repositorio

Voce pode usar este repositorio de duas formas:

### 1. Como indice de referencia

Se voce ainda esta explorando opcoes, navegue pelas blueprints disponiveis e leia a documentacao de cada uma para entender:

- qual problema ela resolve
- para que tipo de projeto ela foi pensada
- quais agentes, skills e scripts ela inclui
- como fazer a primeira execucao

### 2. Como fonte de bootstrap

Se voce ja sabe qual blueprint quer adotar:

1. Entre no diretorio da blueprint desejada.
2. Leia o `README.md` daquela blueprint.
3. Copie ou adapte o conteudo de `bootstrap/` para o repositorio de destino.
4. Siga a documentacao interna da propria blueprint para instalar, validar e operar o fluxo.

## Blueprints disponiveis

| Blueprint | Foco | Quando usar | Entrada principal |
| --- | --- | --- | --- |
| [`unreal-engine-coder`](./unreal-engine-coder/README.md) | Projetos Unreal Engine com harness engineering, subagents, skills e fluxo de evidence/handoff | Quando o time quer operar um repositorio Unreal com disciplina de task dossier, worktree, evidence pack e opcionalmente MCP | [`unreal-engine-coder/README.md`](./unreal-engine-coder/README.md) |
| [`ai-webapp-coder`](./ai-webapp-coder/README.md) | Monorepos web com modelos, `.prototype`, backlog opcional, evidence e PR workflow | Quando o time quer estruturar apps web e runtimes de modelos com worktrees, paridade visual, validacao e handoff de PR | [`ai-webapp-coder/README.md`](./ai-webapp-coder/README.md) |
| [`backend-platform-coder-go`](./backend-platform-coder-go/README.md) | Servicos Go-first com contratos, storage, concorrencia e operacao | Quando o time quer um bootstrap forte para desenho de servico, workers, schema e release com evidencia | [`backend-platform-coder-go/README.md`](./backend-platform-coder-go/README.md) |
| [`design-system-coder`](./design-system-coder/README.md) | Prototipacao code-first, mocks, componentes e evidence visual | Quando o time quer transformar briefs e `.prototype/` em mocks revisaveis, com acessibilidade e handoff visual claros | [`design-system-coder/README.md`](./design-system-coder/README.md) |

## Estrutura esperada de cada blueprint

Cada blueprint pode evoluir de forma independente, mas a estrutura atual segue este padrao:

- `README.md`: visao geral da blueprint, modos de uso e ponto de entrada
- `bootstrap/`: scaffold copiavel para o repositorio de destino
- `agents/`: catalogo publico dos agentes incluidos
- `skills/`: catalogo publico das skills incluidas

Nem toda blueprint futura precisa ter exatamente os mesmos diretorios, mas a recomendacao e manter uma navegacao simples, com um `README.md` forte na raiz de cada pasta principal.

## Comecando pelas blueprints atuais

Se o objetivo for usar a blueprint Unreal, este e o caminho mais curto:

1. Abra [`unreal-engine-coder/README.md`](./unreal-engine-coder/README.md).
2. Escolha entre o modo `C++ sem MCP` ou `C++ + MCP`.
3. A partir dali, siga para [`unreal-engine-coder/bootstrap/docs/README.md`](./unreal-engine-coder/bootstrap/docs/README.md).
4. Consulte os catalogos em [`unreal-engine-coder/agents/README.md`](./unreal-engine-coder/agents/README.md) e [`unreal-engine-coder/skills/README.md`](./unreal-engine-coder/skills/README.md) quando precisar entender papeis e workflows.

Se o objetivo for usar a blueprint web + modelos, este e o caminho mais curto:

1. Abra [`ai-webapp-coder/README.md`](./ai-webapp-coder/README.md).
2. Escolha entre o modo `backlog-first` e o modo `task-first`.
3. A partir dali, siga para [`ai-webapp-coder/bootstrap/docs/README.md`](./ai-webapp-coder/bootstrap/docs/README.md).
4. Consulte os catalogos em [`ai-webapp-coder/agents/README.md`](./ai-webapp-coder/agents/README.md) e [`ai-webapp-coder/skills/README.md`](./ai-webapp-coder/skills/README.md) quando precisar entender papeis e workflows.

## Evolucao futura

Este README foi escrito para funcionar como indice do repositorio. Conforme novas blueprints forem adicionadas, a manutencao esperada aqui e simples:

- adicionar a nova entrada na tabela de blueprints
- resumir em uma linha o foco e o caso de uso
- apontar para o `README.md` da blueprint

Assim, a raiz continua enxuta e util, enquanto os detalhes vivem dentro de cada blueprint.
