# backend-platform-coder-go

Blueprint publica para times que querem estruturar o Codex para criar e evoluir servicos Go com contratos, persistencia, concorrencia e operacao explicita.

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

- `backend-architect`: define boundaries, contratos e estrategia de rollout de servicos Go
- `go-service-implementer`: implementa handlers, servicos e fluxos operacionais em Go
- `api-contract-designer`: desenha contratos e compatibilidade para servicos Go
- `storage-reviewer`: revisa storage, schema e risco de persistencia
- `concurrency-reviewer`: revisa concorrencia, retries e seguranca de workers
- `integration-validator`: valida integracoes e confianca operacional do servico
- `evidence-curator`: organiza evidence pack e notas de release
- `github-operator`: publica e mantem o PR draft

## Skills incluidas

- `adr-driven-design`: formaliza decisoes de arquitetura em servicos Go
- `api-contract-design`: desenha contratos de servico e compatibilidade
- `go-service-slicing`: guia o corte de pacotes e implementacao do servico
- `storage-and-schema-review`: revisa risco de storage e schema
- `worker-and-concurrency-patterns`: guia workers, goroutines e padroes de concorrencia
- `release-evidence-pack`: monta evidence pack tecnico para servicos Go
- `github-pr-ops`: opera o PR de servicos Go no GitHub

## Observacoes

- esta blueprint nao inclui `.prototype/` no v1
- PRs permanecem abertas para revisao humana
- adapte templates de contrato e decisao ao stack real do repositorio de destino
