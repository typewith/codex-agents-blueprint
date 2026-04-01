import fs from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { parseArgs } from "../lib/cli.mjs";
import { resolveWorkItem, repoRootPath } from "../lib/backlog.mjs";
import {
  getAuthenticatedUser,
  listIssueComments,
  listPullRequestReviewComments,
  listPullRequestReviews,
} from "../lib/github.mjs";

const { positional, flags } = parseArgs(process.argv.slice(2));
const itemId = positional[0] ?? flags.item;

if (!itemId) {
  throw new Error("Usage: node scripts/github/poll-review-feedback.mjs --item <ITEM_ID> [--title <title>] [--source-path <path>] [--min-wait-minutes 5] [--max-wait-minutes 15] [--poll-seconds 30]");
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
const minWaitMs = Number(flags["min-wait-minutes"] ?? 5) * 60_000;
const maxWaitMs = Number(flags["max-wait-minutes"] ?? 15) * 60_000;
const pollMs = Number(flags["poll-seconds"] ?? 30) * 1_000;
const createdAtMs = new Date(prMetadata.createdAt).getTime();
const notBeforeMs = createdAtMs + minWaitMs;
const deadlineMs = createdAtMs + maxWaitMs;
const self = await getAuthenticatedUser();

function classifyFeedback(body) {
  const lower = body.toLowerCase();
  if (/\b(bug|fix|broken|regression|incorrect|wrong|missing test|needs test|should|must|handle)\b/.test(lower)) {
    return "code_change";
  }
  if (/\b(nit|question|clarify|clarification|why|can you explain|could you explain)\b/.test(lower) || lower.includes("?")) {
    return "clarification";
  }
  return "unknown";
}

function normalizeReviewComments(comments) {
  return comments
    .filter((comment) => !comment.in_reply_to_id)
    .map((comment) => ({
      kind: "review_comment",
      id: comment.id,
      url: comment.html_url ?? comment.url ?? null,
      author: comment.user?.login ?? "unknown",
      createdAt: comment.created_at ?? null,
      updatedAt: comment.updated_at ?? null,
      path: comment.path ?? null,
      line: comment.line ?? comment.original_line ?? null,
      body: comment.body ?? "",
      classification: classifyFeedback(comment.body ?? ""),
    }));
}

function normalizeIssueComments(comments) {
  return comments.map((comment) => ({
    kind: "issue_comment",
    id: comment.id,
    url: comment.html_url ?? comment.url ?? null,
    author: comment.user?.login ?? "unknown",
    createdAt: comment.created_at ?? null,
    updatedAt: comment.updated_at ?? null,
    body: comment.body ?? "",
    classification: classifyFeedback(comment.body ?? ""),
  }));
}

function normalizeReviews(reviews) {
  return reviews.map((review) => ({
    kind: "review",
    id: review.id,
    url: review.html_url ?? review.pull_request_url ?? null,
    author: review.user?.login ?? "unknown",
    state: review.state ?? "COMMENTED",
    submittedAt: review.submitted_at ?? null,
    body: review.body ?? "",
    classification: classifyFeedback(review.body ?? ""),
  }));
}

async function fetchFeedback() {
  const [reviews, reviewComments, issueComments] = await Promise.all([
    listPullRequestReviews(prMetadata.prNumber),
    listPullRequestReviewComments(prMetadata.prNumber),
    listIssueComments(prMetadata.prNumber),
  ]);

  return {
    reviews: normalizeReviews(reviews).filter((entry) => entry.author !== self.login),
    reviewComments: normalizeReviewComments(reviewComments).filter((entry) => entry.author !== self.login),
    issueComments: normalizeIssueComments(issueComments).filter((entry) => entry.author !== self.login),
  };
}

const nowMs = Date.now();
if (nowMs < notBeforeMs) {
  await delay(notBeforeMs - nowMs);
}

let latest = {
  reviews: [],
  reviewComments: [],
  issueComments: [],
};

while (Date.now() <= deadlineMs) {
  latest = await fetchFeedback();
  if (latest.reviews.length || latest.reviewComments.length || latest.issueComments.length) {
    break;
  }

  if (Date.now() + pollMs > deadlineMs) {
    break;
  }

  await delay(pollMs);
}

const reviewDir = path.join(repoRoot, "artifacts", "pr");
fs.mkdirSync(reviewDir, { recursive: true });
const outputPath = path.join(reviewDir, `${item.id}-external-review.json`);
fs.writeFileSync(outputPath, JSON.stringify({
  itemId: item.id,
  prNumber: prMetadata.prNumber,
  selfLogin: self.login,
  polledAt: new Date().toISOString(),
  minWaitMinutes: minWaitMs / 60_000,
  maxWaitMinutes: maxWaitMs / 60_000,
  reviewComments: latest.reviewComments,
  issueComments: latest.issueComments,
  reviews: latest.reviews,
}, null, 2));

console.log(JSON.stringify({
  itemId: item.id,
  prNumber: prMetadata.prNumber,
  outputPath: path.relative(repoRoot, outputPath),
  reviewComments: latest.reviewComments.length,
  issueComments: latest.issueComments.length,
  reviews: latest.reviews.length,
}, null, 2));
