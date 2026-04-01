# human-loop-preview-gate

- Arquivo runtime: [`bootstrap/.codex/agents/human-loop-preview-gate.toml`](../bootstrap/.codex/agents/human-loop-preview-gate.toml)
- Use quando: a task precisa pausar para uma revisao humana e depois converter esse feedback em proximos passos rastreaveis.
- Nao use quando: ainda nao existe um preview artifact para mostrar ou o trabalho ainda esta no meio da implementacao.
- Entrega esperada: preview request path, task state transition e resumo das acoes apos feedback humano.
