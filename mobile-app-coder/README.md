# mobile-app-coder

Blueprint publica para times que querem usar o Codex para desenvolver apps Expo/React Native com fluxo de telas, `.prototype/`, evidencia visual e skills explicitas para Android Studio e Xcode.

## O que esta blueprint resolve

- organizar o trabalho de telas, navegação e integrações mobile em worktrees isoladas
- transformar briefs e `.prototype/` em mocks ou telas revisaveis
- padronizar evidence visual, check nativo e publicacao de draft PR

## Estrutura publica

- `README.md`: entrada principal da blueprint
- `bootstrap/`: scaffold copiavel para o repositorio de destino
- `agents/`: catalogo publico dos subagentes incluidos
- `skills/`: catalogo publico das skills incluidas

## Modos de operacao

- backlog-first: usa `backlog/EPIC-*` e `TASK-*` como fonte de verdade
- task-first: aceita issue, spec ou roteiro externo com `--title` e `--source-path`

## Como usar o bootstrap

1. Copie `bootstrap/` para o repositorio de destino.
2. Leia `bootstrap/AGENTS.md` e `bootstrap/docs/README.md`.
3. Ajuste os templates, variaveis e scripts ao seu ambiente real.
4. Use os catalogos em `agents/` e `skills/` para entender papeis e gatilhos.

## Agentes incluidos

- `mobile-architect`: define arquitetura mobile, navegação e fronteiras de release
- `react-native-implementer`: implementa telas, componentes e fluxos em React Native/Expo
- `android-studio-specialist`: cobre Android Studio, emulator e caveats nativos de Android
- `xcode-specialist`: cobre Xcode, simulator e caveats nativos de iOS
- `api-integration-validator`: valida consumo de API e integracoes no app
- `visual-evidence-reviewer`: revisa paridade visual e ajuste das telas
- `release-curator`: organiza evidencia e notas de release para mobile
- `github-operator`: publica e mantem o PR draft

## Skills incluidas

- `screen-brief-to-mock`: orquestra o fluxo de uma tela a partir do brief ate o PR draft
- `expo-app-workflow`: guia implementacao de telas e fluxos Expo/React Native
- `android-studio-ops`: cobre Android Studio e operacao nativa de Android
- `xcode-ops`: cobre Xcode e operacao nativa de iOS
- `screen-parity-review`: revisa paridade entre contrato visual e tela mobile
- `api-contract-sync`: alinha telas mobile com contratos de API
- `mobile-evidence-pack`: monta o evidence pack de uma entrega mobile
- `github-pr-ops`: opera publicacao e manutencao do PR mobile no GitHub

## Observacoes

- o v1 assume Expo/React Native como base, mas sem carregar contexto de projeto existente
- `.prototype/` armazena a intencao visual das telas
- Android Studio e Xcode entram como skills operacionais explicitas do bootstrap
