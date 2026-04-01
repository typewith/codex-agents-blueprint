import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath } from "../lib/backlog.mjs";
import {
  createIssueComment,
  replyToPullRequestReviewComment,
} from "../lib/github.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0] ?? flags.item;
const responsesPath = flags.responses;

if (!itemId || !responsesPath) {
  throw new Error("Usage: node scripts/github/reply-review-comments.mjs --item <ITEM_ID> [--title <title>] [--source-path <path>] --responses <FILE>");
}

const repoRoot = repoRootPath();
const item = resolveWorkItem(itemId, {
  title: flags.title ?? itemId,
  sourcePath: flags["source-path"],
});
const prMetadataPath = path.join(repoRoot, "artifacts", "pr", `${item.id}.json`);
if (!fs.existsSync(prMetadataPath)) {
  throw new Error(`PR metadata not found for ${item.id}. Run open-pr first.`);
}

const prMetadata = JSON.parse(fs.readFileSync(prMetadataPath, "utf8"));
const responseFilePath = path.resolve(responsesPath);
const payload = JSON.parse(fs.readFileSync(responseFilePath, "utf8"));
const replies = Array.isArray(payload) ? payload : payload.replies ?? [];
const summary = Array.isArray(payload) ? null : payload.summary ?? null;

const results = [];

for (const reply of replies) {
  if (reply.commentId && reply.body) {
    const created = await replyToPullRequestReviewComment(prMetadata.prNumber, reply.commentId, reply.body);
    results.push({
      kind: "review_comment_reply",
      commentId: reply.commentId,
      replyId: created?.id ?? null,
    });
    continue;
  }

  if (reply.issueCommentId && reply.body) {
    const created = await createIssueComment(
      prMetadata.prNumber,
      `Replying to comment ${reply.issueCommentId}:\n\n${reply.body}`,
    );
    results.push({
      kind: "issue_comment_followup",
      issueCommentId: reply.issueCommentId,
      replyId: created?.id ?? null,
    });
  }
}

if (summary) {
  const created = await createIssueComment(prMetadata.prNumber, summary);
  results.push({
    kind: "summary_comment",
    replyId: created?.id ?? null,
  });
}

console.log(JSON.stringify({
  itemId: item.id,
  prNumber: prMetadata.prNumber,
  repliesPosted: results.length,
  results,
}, null, 2));
