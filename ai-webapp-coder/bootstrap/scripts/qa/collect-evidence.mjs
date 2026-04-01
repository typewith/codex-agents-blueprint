import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath } from "../lib/backlog.mjs";
import { git, headCommit, currentBranch } from "../lib/git.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0] ?? flags.item;
const worktreePath = flags.worktree;

if (!itemId) {
  throw new Error("Usage: node scripts/qa/collect-evidence.mjs --item <ITEM_ID> [--title <title>] [--source-path <path>] --worktree <PATH>");
}

const repoRoot = repoRootPath();
const item = resolveWorkItem(itemId, {
  title: flags.title,
  sourcePath: flags["source-path"],
});
const cwd = worktreePath ? path.resolve(worktreePath) : repoRoot;
const destinationBranch = process.env.GITHUB_BASE_BRANCH ?? "main";
const branch = currentBranch(cwd);
const commit = headCommit(cwd);

let diffStat = "";
let log = "";
let changedFiles = "";

try {
  diffStat = git(["diff", "--stat", `${destinationBranch}...HEAD`], { cwd });
  log = git(["log", "--oneline", `${destinationBranch}..HEAD`], { cwd });
  changedFiles = git(["diff", "--name-only", `${destinationBranch}...HEAD`], { cwd });
} catch (error) {
  diffStat = `Could not compute diff stat: ${error.message}`;
}

const evidenceDir = path.join(repoRoot, "artifacts", "evidence", item.id);
fs.mkdirSync(evidenceDir, { recursive: true });

const summary = `# Evidence - ${item.id}

## Work item
- Title: ${item.title}
- Source: \`${item.sourcePathLabel}\`

## Git
- Branch: \`${branch}\`
- Head commit: \`${commit}\`

## Commit log
\`\`\`
${log || "No commits beyond destination branch yet."}
\`\`\`

## Diff stat
\`\`\`
${diffStat || "No diff stat available."}
\`\`\`

## Changed files
\`\`\`
${changedFiles || "No changed files available."}
\`\`\`

## Validation notes
- Add exact commands and outputs from the agent or subagents here.
- Attach screenshots and logs beside this file when relevant.
- Keep any known gaps explicit before opening the PR.
`;

fs.writeFileSync(path.join(evidenceDir, "summary.md"), summary, "utf8");
fs.writeFileSync(
  path.join(evidenceDir, "metadata.json"),
  JSON.stringify(
    {
      itemId: item.id,
      title: item.title,
      sourcePath: item.sourcePathLabel,
      mode: item.type,
      branch,
      headCommit: commit,
      destinationBranch,
      createdAt: new Date().toISOString(),
    },
    null,
    2,
  ),
  "utf8",
);

console.log(`evidence written to ${evidenceDir}`);
