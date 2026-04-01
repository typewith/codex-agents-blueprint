import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "../lib/cli.mjs";
import { repoRootPath } from "../lib/backlog.mjs";

const { positional } = parseArgs(process.argv.slice(2));
const target = positional[0];

if (!target) {
  throw new Error("Usage: node scripts/worktree/link-env.mjs <worktree-path>");
}

const repoRoot = repoRootPath();
const worktreePath = path.resolve(target);
const candidates = [".env", ".env.local", ".npmrc"];

for (const fileName of candidates) {
  const source = path.join(repoRoot, fileName);
  const destination = path.join(worktreePath, fileName);

  if (!fs.existsSync(source) || fs.existsSync(destination)) {
    continue;
  }

  fs.symlinkSync(source, destination);
  console.log(`linked ${fileName}`);
}
