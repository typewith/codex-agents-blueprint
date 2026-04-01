import path from "node:path";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath } from "../lib/backlog.mjs";
import { ensureCleanWorkingTree, currentBranch, git, run } from "../lib/git.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0];

if (!itemId) {
  throw new Error("Usage: node scripts/prototype/prepare-mock.mjs <ITEM_ID> [--title <title>] [--source-path <path>]");
}

const item = resolveWorkItem(itemId, {
  title: flags.title,
  sourcePath: flags["source-path"],
});
const repoRoot = repoRootPath();
const mainBranch = process.env.GITHUB_BASE_BRANCH ?? "main";
const branchName = `mock/${item.id.toLowerCase()}-${item.slug}`;
const worktreePath = path.join(repoRoot, ".worktrees", item.id);

ensureCleanWorkingTree(repoRoot);

if (currentBranch(repoRoot) !== mainBranch) {
  console.warn(`Primary checkout is on ${currentBranch(repoRoot)}. Recommended branch is ${mainBranch}.`);
}

git(["worktree", "add", "-B", branchName, worktreePath, mainBranch], { cwd: repoRoot, stdio: "inherit" });
run("node", [path.join(repoRoot, "scripts", "worktree", "link-env.mjs"), worktreePath], {
  cwd: repoRoot,
  stdio: "inherit",
});

console.log(JSON.stringify({
  itemId: item.id,
  title: item.title,
  branchName,
  worktreePath,
  mode: item.type,
}, null, 2));
