import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath } from "../lib/backlog.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0] ?? flags.item;

if (!itemId) {
  throw new Error("Usage: node scripts/mobile/run-screen-check.mjs --item <ITEM_ID> [--title <title>] [--source-path <path>]");
}

const repoRoot = repoRootPath();
const item = resolveWorkItem(itemId, {
  title: flags.title,
  sourcePath: flags["source-path"],
});
const reviewDir = path.join(repoRoot, "artifacts", "review");
fs.mkdirSync(reviewDir, { recursive: true });

const report = `# Screen review - ${item.id}

- compare screen hierarchy against .prototype
- verify loading, empty, error, and success states
- record navigation and gesture notes
`;

fs.writeFileSync(path.join(reviewDir, `${item.id}.screen-review.md`), report, "utf8");
console.log(`screen review notes written to ${reviewDir}`);
