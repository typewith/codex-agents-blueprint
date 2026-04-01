import { parseArgs } from "../lib/cli.mjs";
import { createCommitStatus } from "../lib/github.mjs";

const { flags } = parseArgs(process.argv.slice(2));
const commit = flags.commit;
const context = flags.context ?? "codex/evidence";
const description = flags.description ?? "Evidence bundle published.";
const state = flags.state ?? "success";
const targetUrl = flags.targetUrl ?? flags.targetURL;

if (!commit) {
  throw new Error("Usage: node scripts/github/create-status.mjs --commit <SHA> [--context <ctx>] [--description <text>] [--state success|failure|pending|error] [--targetUrl <url>]");
}

const status = await createCommitStatus(commit, {
  context,
  description,
  state,
  targetUrl,
});

console.log(JSON.stringify(status, null, 2));
