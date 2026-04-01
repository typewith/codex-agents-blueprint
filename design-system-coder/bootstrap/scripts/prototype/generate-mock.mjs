import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath } from "../lib/backlog.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0] ?? flags.item;

if (!itemId) {
  throw new Error("Usage: node scripts/prototype/generate-mock.mjs --item <ITEM_ID> [--title <title>] [--source-path <path>]");
}

const repoRoot = repoRootPath();
const item = resolveWorkItem(itemId, {
  title: flags.title,
  sourcePath: flags["source-path"],
});
const outputDir = path.join(repoRoot, "artifacts", "review");
fs.mkdirSync(outputDir, { recursive: true });

const notes = `# Mock draft - ${item.id}

## Goal
- Build a code-first mock from the work item and .prototype references.

## Deliverables
- route or component shell
- state notes
- visual checklist
- accessibility checklist

## Source
- ${item.sourcePathLabel}
`;

fs.writeFileSync(path.join(outputDir, `${item.id}.mock.md`), notes, "utf8");
console.log(`mock draft notes written to ${path.join(outputDir, `${item.id}.mock.md`)}`);
