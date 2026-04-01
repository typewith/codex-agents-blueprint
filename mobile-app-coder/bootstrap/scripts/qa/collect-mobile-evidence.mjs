import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath } from "../lib/backlog.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0] ?? flags.item;

if (!itemId) {
  throw new Error("Usage: node scripts/qa/collect-mobile-evidence.mjs --item <ITEM_ID> [--title <title>] [--source-path <path>]");
}

const repoRoot = repoRootPath();
const item = resolveWorkItem(itemId, {
  title: flags.title,
  sourcePath: flags["source-path"],
});
const evidenceDir = path.join(repoRoot, "artifacts", "evidence", item.id);
fs.mkdirSync(evidenceDir, { recursive: true });

const summary = `# Mobile evidence - ${item.id}

## Capture checklist
- screen screenshots
- platform notes for Android Studio and Xcode
- API contract sync notes
- release caveats
`;

fs.writeFileSync(path.join(evidenceDir, "mobile-summary.md"), summary, "utf8");
console.log(`mobile evidence summary written to ${evidenceDir}`);
