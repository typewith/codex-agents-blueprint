import path from "node:path";
import { parseArgs } from "../lib/cli.mjs";
import { repoRootPath, workItemToken } from "../lib/backlog.mjs";
import { git } from "../lib/git.mjs";

const { positional } = parseArgs(process.argv.slice(2));
const itemId = positional[0];

if (!itemId) {
  throw new Error("Usage: node scripts/backlog/finalize-item.mjs <ITEM_ID>");
}

const repoRoot = repoRootPath();
const mainBranch = process.env.GITHUB_BASE_BRANCH ?? "main";
const worktreePath = path.join(repoRoot, ".worktrees", workItemToken(itemId));

try {
  git(["worktree", "remove", worktreePath, "--force"], { cwd: repoRoot, stdio: "inherit" });
} catch (error) {
  console.warn(`Could not remove worktree ${worktreePath}: ${error.message}`);
}

git(["checkout", mainBranch], { cwd: repoRoot, stdio: "inherit" });
git(["worktree", "prune"], { cwd: repoRoot, stdio: "inherit" });
