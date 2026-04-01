import { spawnSync } from "node:child_process";
import { loadRepoEnv } from "./env-file.mjs";

loadRepoEnv();

function env(name, fallback = "") {
  return process.env[name] ?? fallback;
}

function githubBaseUrl() {
  return env("GITHUB_API_BASE_URL", "https://api.github.com").replace(/\/$/, "");
}

function githubApiVersion() {
  return env("GITHUB_API_VERSION", "2026-03-10");
}

function token() {
  const value = env("GITHUB_TOKEN") || env("GH_TOKEN");
  if (!value) {
    throw new Error("GITHUB_TOKEN or GH_TOKEN is not configured.");
  }
  return value;
}

function parseRepository(value) {
  const trimmed = value.trim().replace(/\.git$/, "");
  const direct = /^([^/\s]+)\/([^/\s]+)$/.exec(trimmed);
  if (direct) {
    return { owner: direct[1], repo: direct[2] };
  }

  const remote = /[:/]([^/\s:]+)\/([^/\s]+?)(?:\.git)?$/.exec(trimmed);
  if (remote) {
    return { owner: remote[1], repo: remote[2] };
  }

  return null;
}

function readOriginUrl() {
  const result = spawnSync("git", ["config", "--get", "remote.origin.url"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.error || result.status !== 0) {
    return "";
  }

  return (result.stdout || "").trim();
}

export function resolveRepository() {
  const repository = env("GITHUB_REPOSITORY");
  if (repository) {
    const parsed = parseRepository(repository);
    if (parsed) return parsed;
  }

  const owner = env("GITHUB_OWNER");
  const repo = env("GITHUB_REPO");
  if (owner && repo) {
    return { owner, repo };
  }

  const originUrl = readOriginUrl();
  if (originUrl) {
    const parsed = parseRepository(originUrl);
    if (parsed) return parsed;
  }

  throw new Error("Could not resolve GitHub repository. Set GITHUB_REPOSITORY or configure origin.");
}

async function request(pathname, init = {}) {
  const url = new URL(`${githubBaseUrl()}${pathname}`);

  if (init.query) {
    for (const [key, value] of Object.entries(init.query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": githubApiVersion(),
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function githubRequest(pathname, init = {}) {
  return request(pathname, init);
}

export function parseReviewerLogins() {
  const raw = env("GITHUB_DEFAULT_REVIEWERS", "");
  return raw
    .split(",")
    .map((value) => value.trim().replace(/^@/, ""))
    .filter(Boolean);
}

export async function findOpenPullRequestForBranch(sourceBranch, destinationBranch = env("GITHUB_BASE_BRANCH", "main")) {
  const { owner, repo } = resolveRepository();
  const pulls = await request(`/repos/${owner}/${repo}/pulls`, {
    method: "GET",
    query: {
      state: "open",
      head: `${owner}:${sourceBranch}`,
      base: destinationBranch,
    },
  });

  return pulls[0] ?? null;
}

export async function updatePullRequest(prNumber, payload) {
  const { owner, repo } = resolveRepository();
  return request(`/repos/${owner}/${repo}/pulls/${prNumber}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function requestReviewers(prNumber, reviewers = parseReviewerLogins()) {
  if (!reviewers.length) {
    return null;
  }

  const { owner, repo } = resolveRepository();
  return request(`/repos/${owner}/${repo}/pulls/${prNumber}/requested_reviewers`, {
    method: "POST",
    body: JSON.stringify({ reviewers }),
  });
}

export async function createPullRequest({
  title,
  description,
  sourceBranch,
  destinationBranch = env("GITHUB_BASE_BRANCH", "main"),
  reviewers = parseReviewerLogins(),
  draft = false,
}) {
  const { owner, repo } = resolveRepository();
  const existing = await findOpenPullRequestForBranch(sourceBranch, destinationBranch);

  let pr;
  let created = false;

  if (existing) {
    pr = await updatePullRequest(existing.number, {
      title,
      body: description,
      base: destinationBranch,
    });
  } else {
    pr = await request(`/repos/${owner}/${repo}/pulls`, {
      method: "POST",
      body: JSON.stringify({
        title,
        body: description,
        head: sourceBranch,
        base: destinationBranch,
        draft,
        maintainer_can_modify: true,
      }),
    });
    created = true;
  }

  if (reviewers.length) {
    await requestReviewers(pr.number, reviewers);
  }

  return {
    ...pr,
    created,
  };
}

export async function getAuthenticatedUser() {
  return request("/user", {
    method: "GET",
  });
}

export async function getPullRequest(pullNumber) {
  const { owner, repo } = resolveRepository();
  return request(`/repos/${owner}/${repo}/pulls/${pullNumber}`, {
    method: "GET",
  });
}

export async function listPullRequestReviews(pullNumber) {
  const { owner, repo } = resolveRepository();
  return request(`/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`, {
    method: "GET",
    query: {
      per_page: 100,
    },
  });
}

export async function listPullRequestReviewComments(pullNumber) {
  const { owner, repo } = resolveRepository();
  return request(`/repos/${owner}/${repo}/pulls/${pullNumber}/comments`, {
    method: "GET",
    query: {
      per_page: 100,
    },
  });
}

export async function listIssueComments(issueNumber) {
  const { owner, repo } = resolveRepository();
  return request(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: "GET",
    query: {
      per_page: 100,
    },
  });
}

export async function createIssueComment(issueNumber, body) {
  const { owner, repo } = resolveRepository();
  return request(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export async function createPullRequestReview(pullNumber, body, event = "COMMENT") {
  const { owner, repo } = resolveRepository();
  return request(`/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`, {
    method: "POST",
    body: JSON.stringify({
      body,
      event,
    }),
  });
}

export async function replyToPullRequestReviewComment(pullNumber, commentId, body) {
  const { owner, repo } = resolveRepository();
  return request(`/repos/${owner}/${repo}/pulls/${pullNumber}/comments/${commentId}/replies`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export async function createCommitStatus(commitSha, {
  state = "success",
  description = "Status updated.",
  context = "codex/work-item",
  targetUrl,
} = {}) {
  const { owner, repo } = resolveRepository();
  return request(`/repos/${owner}/${repo}/statuses/${commitSha}`, {
    method: "POST",
    body: JSON.stringify({
      state,
      description,
      context,
      target_url: targetUrl,
    }),
  });
}
