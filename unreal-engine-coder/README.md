# unreal-engine-coder

Blueprint publico para projetos Unreal Engine que usam `harness engineering`, subagents, skills e ferramentas de suporte no Codex.

Este blueprint nasce de um recorte curado de `S:\Projects\agents_office`, mas troca o foco em um jogo especifico por uma base compartilhavel para times que querem operar um repositorio Unreal com disciplina de task dossier, evidence pack, review handoff e roteamento claro entre agentes.

## Estrutura

- `bootstrap/`: scaffold copiavel e plug-and-play com os arquivos reais consumidos pelo Codex.
- `agents/`: catalogo publico dos subagentes incluidos no bootstrap.
- `skills/`: catalogo publico das skills incluidas no bootstrap.

## Modos de uso

### Modo 1: C++ sem MCP

Use este modo quando voce quer:

- manter gameplay authored em C++
- trabalhar com branch por task e worktree isolada
- gerar dossier, evidencias e PR handoff
- adiar configuracao de MCP para depois

Fluxo sugerido:

1. Copie `bootstrap/` para a raiz do seu projeto.
2. Crie o projeto Unreal em `Games > Third Person > C++`.
3. Use `scripts/ops/start-task.py` e `scripts/ops/finish-task.py` como fluxo padrao.
4. Capture evidencias com `scripts/evidence/create-evidence-pack.py`.
5. Gere o PR handoff com `scripts/ops/generate-pr-body.py`.

### Modo 2: C++ + MCP

Use este modo quando voce quer adicionar automacao de editor, healthchecks e docs/build loops com MCPs Unreal.

No v1, MCP e opcional. O bootstrap versiona apenas `.codex/config.toml`; a configuracao local fica fora do Git em `.codex/config.local.toml` e deve ser gerada apenas quando o projeto e os plugins locais estiverem prontos.

Fluxo sugerido:

1. Comece pelo mesmo fluxo do modo `C++ sem MCP`.
2. Instale e configure o stack MCP que fizer sentido para o projeto.
3. Gere `.codex/config.local.toml` com `scripts/mcp/render-codex-local-config.py`.
4. Rode `scripts/mcp/healthcheck.py` para validar o ambiente e registrar qualquer degraded mode.

## Como navegar

- Se voce quer usar o blueprint: comece em [bootstrap/docs/README.md](./bootstrap/docs/README.md).
- Se voce quer entender os papeis dos subagentes: veja [agents/README.md](./agents/README.md).
- Se voce quer entender os workflows reutilizaveis: veja [skills/README.md](./skills/README.md).

## O que entra no v1

- subagentes curados para arquitetura, runtime C++, repo ops, build/test/docs, editor automation, visual evidence e human preview gate
- skills curadas para workflow de harness, worktree, evidence, MCP e cleanup
- scripts minimos para task lifecycle, evidence pack, preview gate e MCP local config
- docs minimas para primeira execucao, arquitetura, workflow, validacao e MCP

## O que fica de fora

- qualquer artefato de um jogo especifico
- projeto Unreal pronto para compilar
- CI e automacoes de GitHub do repositorio de referencia
- historico de tasks, evidencias e manifests herdados
