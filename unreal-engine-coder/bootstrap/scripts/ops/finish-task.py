#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import subprocess
from pathlib import Path

def run(cmd: list[str], cwd: Path | None = None) -> str:
    completed = subprocess.run(
        cmd,
        cwd=str(cwd) if cwd else None,
        check=True,
        capture_output=True,
        text=True,
    )
    return completed.stdout.strip()

def parse_worktrees(repo_root: Path) -> list[dict[str, str]]:
    raw = run(["git", "worktree", "list", "--porcelain"], cwd=repo_root)
    entries: list[dict[str, str]] = []
    current: dict[str, str] = {}
    for line in raw.splitlines():
        if not line:
            if current:
                entries.append(current)
                current = {}
            continue
        key, _, value = line.partition(" ")
        current[key] = value
    if current:
        entries.append(current)
    return entries

def main() -> int:
    parser = argparse.ArgumentParser(description="Remove an isolated task worktree and leave the main checkout clean.")
    parser.add_argument("--worktree-path", required=True, help="Path to the worktree to remove")
    parser.add_argument("--keep-worktree", action="store_true", help="Skip worktree removal; still normalize main checkout")
    args = parser.parse_args()

    repo_root = Path(run(["git", "rev-parse", "--show-toplevel"])).resolve()
    task_worktree = Path(args.worktree_path).resolve()

    worktrees = parse_worktrees(repo_root)
    main_entry = None
    for entry in worktrees:
        if entry.get("branch") == "refs/heads/main":
            main_entry = entry
            break
    if main_entry is None:
        raise SystemExit("Could not find a worktree on branch 'main'.")

    main_worktree = Path(main_entry["worktree"]).resolve()

    status = run(["git", "-C", str(task_worktree), "status", "--porcelain"])
    if status:
        raise SystemExit("Task worktree is dirty. Commit or stash changes before cleanup.")

    run(["git", "-C", str(main_worktree), "checkout", "main"])
    os.chdir(main_worktree)

    if not args.keep_worktree:
        run(["git", "-C", str(main_worktree), "worktree", "remove", str(task_worktree)])
        run(["git", "-C", str(main_worktree), "worktree", "prune"])

    print(f"Main checkout normalized on: {main_worktree}")
    if args.keep_worktree:
        print(f"Worktree preserved: {task_worktree}")
    else:
        print(f"Worktree removed: {task_worktree}")
    print("Task branch preserved by default so the PR can remain open.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
