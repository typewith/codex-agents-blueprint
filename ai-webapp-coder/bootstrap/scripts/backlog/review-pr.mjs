import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath } from "../lib/backlog.mjs";
import { createPullRequestReview } from "../lib/github.mjs";
import { renderTemplate } from "../lib/templates.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0] ?? flags.item;
const worktreePath = flags.worktree;

if (!itemId) {
  throw new Error("Usage: node scripts/backlog/review-pr.mjs <ITEM_ID> [--title <title>] [--source-path <path>] [--worktree <path>]");
}

const repoRoot = repoRootPath();
const item = resolveWorkItem(itemId, {
  title: flags.title,
  sourcePath: flags["source-path"],
});
const prMetadataPath = path.join(repoRoot, "artifacts", "pr", `${item.id}.json`);

if (!fs.existsSync(prMetadataPath)) {
  throw new Error(`PR metadata not found for ${item.id}. Run open-pr first.`);
}

const prMetadata = JSON.parse(fs.readFileSync(prMetadataPath, "utf8"));
const prompt = renderTemplate(
  path.join(repoRoot, "templates", "prompts", "pr-review.prompt.md"),
  {
    ITEM_ID: item.id,
    ITEM_TITLE: item.title,
    DESTINATION_BRANCH: process.env.GITHUB_BASE_BRANCH ?? "main",
  },
);

const cwd = worktreePath ? path.resolve(worktreePath) : repoRoot;
const result = spawnSync(
  "codex",
  ["exec", "--profile", "backlog-reviewer", "--cd", cwd, prompt],
  {
    encoding: "utf8",
    cwd: repoRoot,
  },
);

if (result.error) {
  throw result.error;
}

if (result.status !== 0) {
  throw new Error(result.stderr || result.stdout || "codex review failed");
}

const reviewText = (result.stdout || "").trim() || "_No review output returned._";
const reviewDir = path.join(repoRoot, "artifacts", "review");
fs.mkdirSync(reviewDir, { recursive: true });
fs.writeFileSync(path.join(reviewDir, `${item.id}.md`), reviewText, "utf8");

await createPullRequestReview(prMetadata.prNumber ?? prMetadata.prId, reviewText, "COMMENT");

console.log(reviewText);
