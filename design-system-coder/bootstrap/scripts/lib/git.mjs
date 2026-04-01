import { spawnSync } from "node:child_process";

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: options.stdio ?? "pipe",
    cwd: options.cwd ?? process.cwd(),
    env: { ...process.env, ...(options.env ?? {}) },
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      [`Command failed: ${command} ${args.join(" ")}`, result.stdout, result.stderr]
        .filter(Boolean)
        .join("\n"),
    );
  }

  return result.stdout?.trim() ?? "";
}

export function git(args, options = {}) {
  return run("git", args, options);
}

export function ensureCleanWorkingTree(cwd = process.cwd()) {
  const status = git(["status", "--porcelain"], { cwd });
  if (status.trim().length > 0) {
    throw new Error("Working tree is not clean. Commit or stash changes before running backlog automation.");
  }
}

export function currentBranch(cwd = process.cwd()) {
  return git(["rev-parse", "--abbrev-ref", "HEAD"], { cwd });
}

export function headCommit(cwd = process.cwd()) {
  return git(["rev-parse", "HEAD"], { cwd });
}
