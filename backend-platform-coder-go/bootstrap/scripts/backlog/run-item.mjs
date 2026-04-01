import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath } from "../lib/backlog.mjs";
import { run } from "../lib/git.mjs";
import { renderTemplate } from "../lib/templates.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0];

if (!itemId) {
  throw new Error("Usage: node scripts/backlog/run-item.mjs <ITEM_ID> [--title <title>] [--source-path <path>]");
}

const item = resolveWorkItem(itemId, {
  title: flags.title,
  sourcePath: flags["source-path"],
});
const repoRoot = repoRootPath();

function parsePrepareOutput(raw) {
  const start = raw.indexOf("{");
  if (start === -1) {
    throw new Error(`Could not parse prepare-item output: ${raw}`);
  }
  return JSON.parse(raw.slice(start));
}

const prepareArgs = [
  path.join(repoRoot, "scripts", "backlog", "prepare-item.mjs"),
  item.id,
];
if (flags.title) {
  prepareArgs.push("--title", flags.title);
}
if (flags["source-path"]) {
  prepareArgs.push("--source-path", flags["source-path"]);
}

const preparedRaw = run("node", prepareArgs, { cwd: repoRoot });
const prepared = parsePrepareOutput(preparedRaw);

const prompt = renderTemplate(
  path.join(repoRoot, "templates", "prompts", "backlog-execution.prompt.md"),
  {
    ITEM_ID: item.id,
    ITEM_PATH: item.sourcePathLabel,
    ITEM_TITLE: item.title,
    WORKTREE_PATH: prepared.worktreePath,
    BRANCH_NAME: prepared.branchName,
  },
);

const reviewDir = path.join(repoRoot, "artifacts", "review");
fs.mkdirSync(reviewDir, { recursive: true });

const codexResult = spawnSync(
  "codex",
  ["exec", "--profile", "backlog-worker", "--cd", prepared.worktreePath, prompt],
  {
    encoding: "utf8",
    cwd: repoRoot,
  },
);

if (codexResult.error) {
  throw codexResult.error;
}

fs.writeFileSync(
  path.join(reviewDir, `${item.id}.execution.log`),
  [codexResult.stdout, codexResult.stderr].filter(Boolean).join("\n"),
  "utf8",
);

if (codexResult.status !== 0) {
  throw new Error(codexResult.stderr || codexResult.stdout || "codex execution failed");
}

const sharedArgs = ["--item", item.id, "--worktree", prepared.worktreePath];
if (flags.title) {
  sharedArgs.push("--title", flags.title);
}
if (flags["source-path"]) {
  sharedArgs.push("--source-path", flags["source-path"]);
}

run("node", [path.join(repoRoot, "scripts", "qa", "collect-evidence.mjs"), ...sharedArgs], {
  cwd: repoRoot,
  stdio: "inherit",
});

run("git", ["-C", prepared.worktreePath, "push", "-u", "origin", prepared.branchName], {
  cwd: repoRoot,
  stdio: "inherit",
});

run("node", [path.join(repoRoot, "scripts", "github", "open-pr.mjs"), ...sharedArgs], {
  cwd: repoRoot,
  stdio: "inherit",
});

run("node", [path.join(repoRoot, "scripts", "backlog", "review-pr.mjs"), ...sharedArgs], {
  cwd: repoRoot,
  stdio: "inherit",
});

run("node", [path.join(repoRoot, "scripts", "backlog", "finalize-item.mjs"), item.id], {
  cwd: repoRoot,
  stdio: "inherit",
});
