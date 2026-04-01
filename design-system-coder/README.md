# design-system-coder

Blueprint publica para times que querem usar o Codex para transformar briefs, `.prototype/` e inventario de componentes em mocks code-first, revisao visual e handoff para implementacao.

## O que esta blueprint resolve

- criar mocks em codigo antes da implementacao final
- mapear componentes, tokens e gaps de acessibilidade com um fluxo operacional claro
- organizar evidence visual, worktrees e draft PRs sem depender de uma ferramenta de design externa no fluxo principal

## Estrutura publica

- `README.md`: entrada principal da blueprint
- `bootstrap/`: scaffold copiavel para o repositorio de destino
- `agents/`: catalogo publico dos subagentes incluidos
- `skills/`: catalogo publico das skills incluidas

## Modos de operacao

- backlog-first: usa `backlog/EPIC-*` e `TASK-*` para priorizar briefs e entregas
- task-first: aceita issue, spec ou prompt externo com `--title` e `--source-path`

## Como usar o bootstrap

1. Copie `bootstrap/` para o repositorio de destino.
2. Leia `bootstrap/AGENTS.md` e `bootstrap/docs/README.md`.
3. Ajuste os templates, variaveis e scripts ao seu ambiente real.
4. Use os catalogos em `agents/` e `skills/` para entender papeis e gatilhos.

## Agentes incluidos

- `design-system-architect`: define o fluxo de prototipo, inventario de componentes e contratos de handoff
- `mock-flow-builder`: monta mocks navegaveis e estados de tela em codigo
- `component-implementer`: implementa componentes e encaixa tokens no mock
- `visual-reviewer`: revisa hierarquia visual, composicao e paridade com o brief
- `accessibility-reviewer`: faz a revisao de acessibilidade do mock e dos componentes
- `evidence-curator`: organiza screenshots, notas de paridade e evidencias do work item
- `github-operator`: abre o PR e mantem a conversa de review organizada

## Skills incluidas

- `prototype-brief-to-mock`: orquestra o fluxo completo de um brief ate um mock revisavel
- `code-first-mock-generation`: acelera a geracao de mocks em codigo
- `component-inventory-and-token-audit`: audita componentes e tokens antes de escalar o mock
- `prototype-parity-review`: revisa a paridade entre contrato visual e mock
- `visual-evidence-pack`: monta o pacote de evidencia visual do work item
- `github-pr-ops`: opera publicacao e manutencao do PR no GitHub

## Observacoes

- o v1 e code-first e nao depende de uma ferramenta de design externa para funcionar
- `.prototype/` e tratado como contrato visual de entrada
- os mocks gerados podem servir de handoff para um repositorio de implementacao separado ou para o proprio app de destino
