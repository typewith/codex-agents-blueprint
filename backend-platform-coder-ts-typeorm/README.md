# backend-platform-coder-ts-typeorm

Blueprint publica para times que querem estruturar o Codex para criar e evoluir backends Node/TypeScript com TypeORM, contratos, migrations, jobs e decisoes de software explicitas.

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

- `backend-architect`: define boundaries, contratos e estrategia de rollout do backend
- `api-contract-designer`: desenha contratos de API e compatibilidade
- `typeorm-implementer`: implementa entidades, repositorios e migrations em TypeORM
- `migration-reviewer`: revisa risco de migration e reversibilidade
- `integration-validator`: valida integracoes, smoke tests e confianca operacional
- `evidence-curator`: organiza evidence pack tecnico e notas de handoff
- `github-operator`: publica e mantem o PR draft
- `reviewer`: faz a revisao tecnica final da mudanca

## Skills incluidas

- `adr-driven-design`: formaliza decisoes de arquitetura e tradeoffs
- `api-contract-design`: desenha contratos de backend e suas compatibilidades
- `typeorm-data-modeling`: guia modelagem de dados e migrations em TypeORM
- `migration-safety-review`: revisa seguranca de migration e rollout
- `background-jobs-and-integrations`: guia jobs, filas e integracoes externas
- `release-evidence-pack`: monta evidence pack tecnico para backend
- `github-pr-ops`: opera o PR de backend no GitHub

## Observacoes

- esta blueprint nao inclui `.prototype/` no v1
- PRs permanecem abertas para revisao humana
- adapte templates de contrato e decisao ao stack real do repositorio de destino
