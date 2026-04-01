# backend-platform-coder-agnostic

Blueprint publica para times que querem um bootstrap generico de backend, centrado em contratos, estrutura de dados, tradeoffs de arquitetura, failure modes e readiness para release.

## O que esta blueprint resolve

- organizar agentes e skills para arquitetura, implementacao e revisao de backend
- padronizar backlog-first e task-first com worktrees e evidence
- manter contratos, decisoes e handoff tecnico explicitos no PR

## Estrutura publica

- `README.md`: entrada principal da blueprint
- `bootstrap/`: scaffold copiavel para o repositorio de destino
- `agents/`: catalogo publico dos subagentes incluidos
- `skills/`: catalogo publico das skills incluidas

## Modos de operacao

- backlog-first: usa `backlog/EPIC-*` e `TASK-*` como fonte de verdade do work item
- task-first: aceita issues, ADRs ou specs externas com `--title` e `--source-path`

## Como usar o bootstrap

1. Copie `bootstrap/` para o repositorio de destino.
2. Leia `bootstrap/AGENTS.md` e `bootstrap/docs/README.md`.
3. Ajuste os templates, variaveis e scripts ao seu ambiente real.
4. Use os catalogos em `agents/` e `skills/` para entender papeis e gatilhos.

## Agentes incluidos

- `architecture-lead`: lidera tradeoffs e fronteiras de arquitetura backend
- `contract-designer`: desenha contratos e interfaces entre superfícies
- `data-structure-reviewer`: revisa estruturas de dados e invariantes
- `integration-planner`: planeja cortes de integracao e sequenciamento
- `risk-reviewer`: revisa failure modes e prontidao para rollout
- `evidence-curator`: organiza evidence e readiness notes
- `github-operator`: publica e mantem o PR draft
- `reviewer`: faz a revisao tecnica final e aponta riscos

## Skills incluidas

- `adr-driven-design`: formaliza decisoes e tradeoffs de arquitetura
- `api-contract-design`: desenha contratos de backend sem travar stack
- `data-structure-review`: revisa shape de dados e invariantes
- `integration-cut-planning`: planeja cortes de integracao e sequenciamento
- `failure-mode-and-rollout-review`: revisa failure modes, degraded mode e readiness
- `release-evidence-pack`: monta o pacote de evidencia e readiness
- `github-pr-ops`: opera o PR backend no GitHub

## Observacoes

- esta blueprint nao inclui `.prototype/` no v1
- PRs permanecem abertas para revisao humana
- adapte templates de contrato e decisao ao stack real do repositorio de destino
