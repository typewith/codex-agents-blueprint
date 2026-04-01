import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath } from "../lib/backlog.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0] ?? flags.item;

if (!itemId) {
  throw new Error("Usage: node scripts/prototype/check-parity.mjs --item <ITEM_ID> [--title <title>] [--source-path <path>]");
}

const repoRoot = repoRootPath();
const item = resolveWorkItem(itemId, {
  title: flags.title,
  sourcePath: flags["source-path"],
});
const evidenceDir = path.join(repoRoot, "artifacts", "evidence", item.id);
fs.mkdirSync(evidenceDir, { recursive: true });

const report = `# Prototype parity - ${item.id}

- Compare the generated mock against .prototype and the work item brief.
- Capture state gaps, copy mismatches, and token issues.
- Attach screenshots beside this report when available.
`;

fs.writeFileSync(path.join(evidenceDir, "parity.md"), report, "utf8");
console.log(`prototype parity report written to ${evidenceDir}`);
