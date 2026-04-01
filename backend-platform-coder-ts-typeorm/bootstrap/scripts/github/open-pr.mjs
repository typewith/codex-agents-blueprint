import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath } from "../lib/backlog.mjs";
import { createPullRequest, createIssueComment } from "../lib/github.mjs";
import { currentBranch, headCommit } from "../lib/git.mjs";
import { renderTemplate } from "../lib/templates.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0] ?? flags.item;
const worktreePath = flags.worktree;

if (!itemId) {
  throw new Error("Usage: node scripts/github/open-pr.mjs --item <ITEM_ID> [--title <title>] [--source-path <path>] --worktree <PATH>");
}

const repoRoot = repoRootPath();
const item = resolveWorkItem(itemId, {
  title: flags.title,
  sourcePath: flags["source-path"],
});
const cwd = worktreePath ? path.resolve(worktreePath) : repoRoot;
const branchName = currentBranch(cwd);
const commit = headCommit(cwd);

const evidencePath = path.join(repoRoot, "artifacts", "evidence", item.id, "summary.md");
const evidence = fs.existsSync(evidencePath)
  ? fs.readFileSync(evidencePath, "utf8")
  : "_No evidence bundle found yet._";

const templatePath = path.join(repoRoot, "templates", "pr", "description.md");
const description = renderTemplate(templatePath, {
  ITEM_ID: item.id,
  ITEM_TITLE: item.title,
  ITEM_PATH: item.sourcePathLabel,
  SUMMARY: "Generated from work-item automation. Replace or refine in follow-up commits if needed.",
  CHECKS: "- See evidence comment for command-level detail.",
  EVIDENCE: `- \`artifacts/evidence/${item.id}/summary.md\``,
  RISKS: "- Review evidence and automated review comment before approval.",
});

const pr = await createPullRequest({
  title: `${item.id} - ${item.title}`,
  description,
  sourceBranch: branchName,
});

await createIssueComment(pr.number, evidence);

const prDir = path.join(repoRoot, "artifacts", "pr");
fs.mkdirSync(prDir, { recursive: true });
fs.writeFileSync(path.join(prDir, `${item.id}.json`), JSON.stringify({
  itemId: item.id,
  itemTitle: item.title,
  sourcePath: item.sourcePathLabel,
  branchName,
  commit,
  prId: pr.id,
  prNumber: pr.number,
  prLink: pr.html_url ?? null,
  created: pr.created ?? false,
  createdAt: new Date().toISOString(),
}, null, 2));

console.log(JSON.stringify({
  prId: pr.id,
  prNumber: pr.number,
  prLink: pr.html_url ?? null,
  branchName,
  commit,
}, null, 2));
