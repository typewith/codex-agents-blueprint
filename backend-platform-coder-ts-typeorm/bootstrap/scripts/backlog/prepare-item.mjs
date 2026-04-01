import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath, workItemToken } from "../lib/backlog.mjs";
import { git, ensureCleanWorkingTree, currentBranch, run } from "../lib/git.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0];

if (!itemId) {
  throw new Error("Usage: node scripts/backlog/prepare-item.mjs <ITEM_ID> [--title <title>] [--source-path <path>]");
}

const item = resolveWorkItem(itemId, {
  title: flags.title,
  sourcePath: flags["source-path"],
});
const repoRoot = repoRootPath();
const mainBranch = process.env.GITHUB_BASE_BRANCH ?? "main";
const branchToken = workItemToken(item.id).toLowerCase();
const branchName = item.slug === branchToken ? `work/${branchToken}` : `work/${branchToken}-${item.slug}`;
const worktreePath = path.join(repoRoot, ".worktrees", workItemToken(item.id));

ensureCleanWorkingTree(repoRoot);

if (currentBranch(repoRoot) !== mainBranch) {
  console.warn(`Primary checkout is on ${currentBranch(repoRoot)}. Recommended branch is ${mainBranch}.`);
}

fs.mkdirSync(path.dirname(worktreePath), { recursive: true });

git(["worktree", "add", "-B", branchName, worktreePath, mainBranch], { cwd: repoRoot, stdio: "inherit" });
run("node", [path.join(repoRoot, "scripts", "worktree", "link-env.mjs"), worktreePath], {
  cwd: repoRoot,
  stdio: "inherit",
});

console.log(JSON.stringify({
  itemId: item.id,
  title: item.title,
  mode: item.type,
  sourcePath: item.sourcePathLabel,
  branchName,
  worktreePath,
}, null, 2));
