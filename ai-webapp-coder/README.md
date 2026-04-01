# ai-webapp-coder

Blueprint publico para monorepos web com modelos, `.prototype`, backlog opcional, workflow de evidencias e publicacao de PR com GitHub.

Este blueprint nasceu de um recorte curado de um monorepo web real e foi abstraido para servir como base compartilhavel para produtos que combinam frontend, backend, workers, runtime de modelos e um fluxo disciplinado de implementacao e review.

## Estrutura

- `bootstrap/`: scaffold copiavel e plug-and-play com os arquivos reais consumidos pelo Codex.
- `agents/`: catalogo publico dos subagentes incluidos no bootstrap.
- `skills/`: catalogo publico das skills incluidas no bootstrap.

## Modos de uso

### Modo 1: backlog-first

Use este modo quando o repositorio organiza o trabalho em `EPIC-XX` e `TASK-XXXX`.

Fluxo sugerido:

1. Copie `bootstrap/` para a raiz do repositorio de destino.
2. Preencha `.prototype/` e `backlog/` com o seu contexto real.
3. Rode `node scripts/backlog/prepare-item.mjs <ITEM_ID>`.
4. Se quiser automatizar o ciclo completo, rode `node scripts/backlog/run-item.mjs <ITEM_ID>`.
5. Use `node scripts/backlog/finalize-item.mjs <ITEM_ID>` para limpar a worktree local ao final.

### Modo 2: task-first

Use este modo quando o trabalho nasce de issues, specs, docs externas ou task dossiers fora de `backlog/`.

O bootstrap continua sendo o mesmo, mas `backlog/` vira opcional. Para operar sem backlog estruturado:

1. Use `.prototype/` como fonte de verdade visual quando houver UI.
2. Crie o work item com um identificador estavel, por exemplo `ISSUE-42` ou `SPEC-auth-fallback`.
3. Passe `--title` e, quando fizer sentido, `--source-path` para os scripts backlog-aware:

   ```bash
   node scripts/backlog/prepare-item.mjs ISSUE-42 --title "Add provider fallback banner" --source-path docs/specs/provider-fallback.md
   ```

4. Use os mesmos scripts de evidence e PR, ou opere manualmente com a mesma convencao de artefatos.

## `.prototype`

`.prototype` e uma convencao explicita deste blueprint.

- ela representa a fonte de verdade visual e de fluxo
- ela nao deve ser editada diretamente durante a execucao normal das tasks
- qualquer divergencia precisa ser documentada em evidencias e PR

## Runtime de modelos

O v1 e `provider-agnostic`.

Isso significa:

- o bootstrap nao exige um fornecedor especifico
- o repositorio pode usar qualquer runtime de modelos que documente credenciais, smoke checks, degraded mode e evidencias
- a linguagem de agentes, skills e runbooks fala em provider, runtime, inference e outputs derivados, nao em um vendor obrigatorio

## Como navegar

- para usar o blueprint: comece em [bootstrap/docs/README.md](./bootstrap/docs/README.md)
- para entender os papeis dos subagentes: veja [agents/README.md](./agents/README.md)
- para entender os workflows reutilizaveis: veja [skills/README.md](./skills/README.md)

## O que entra no v1

- subagentes curados para frontend, backend, integracao, prototype mapping, evidence, GitHub ops e review
- skills curadas para backlog execution, prototype parity, evidence, Docker stack ops, GitHub PR ops e model runtime ops
- scripts para worktree, backlog, evidence, PR, review e feedback de review
- docs minimas para arquitetura, `.prototype`, worktrees, GitHub flow e runtime de modelos

## O que fica de fora

- apps reais, packages reais, dockerfiles, providers e dominio de um produto especifico
- backlog historico, artifacts historicos e segredos locais
- testes de provider com side effects reais
- qualquer regra que obrigue um framework, banco ou vendor especifico
