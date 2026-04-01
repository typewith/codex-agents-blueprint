#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
from datetime import datetime
from pathlib import Path

from pr_workflow import TASK_JSON_DEFAULTS

TEMPLATE_FILES = {
    "plan.md": "templates/task-plan.md",
    "evidence.md": "templates/evidence-report.md",
    "handoff.md": "templates/review-handoff.md",
    "pr-body.md": "templates/pr-body.md",
    "human-loop/preview-request.md": "templates/human-preview-request.md",
    "human-loop/feedback.md": "templates/human-feedback.md",
}

def run(cmd: list[str], cwd: Path | None = None) -> str:
    completed = subprocess.run(
        cmd,
        cwd=str(cwd) if cwd else None,
        check=True,
        capture_output=True,
        text=True,
    )
    return completed.stdout.strip()

def git_status_clean(repo_root: Path) -> bool:
    return run(["git", "status", "--porcelain"], cwd=repo_root) == ""

def render(text: str, mapping: dict[str, str]) -> str:
    rendered = text
    for key, value in mapping.items():
        rendered = rendered.replace("{{" + key + "}}", value)
    return rendered

def main() -> int:
    parser = argparse.ArgumentParser(description="Create a task branch, worktree, and task dossier.")
    parser.add_argument("--slug", required=True, help="Short task slug, e.g. npc-desk-alignment")
    parser.add_argument("--summary", required=True, help="Human-readable task summary")
    parser.add_argument("--branch", help="Explicit branch name. Defaults to task/<slug>")
    parser.add_argument("--worktree-dir", help="Override worktree path")
    parser.add_argument("--allow-dirty", action="store_true", help="Allow starting from a dirty primary checkout")
    args = parser.parse_args()

    repo_root = Path(run(["git", "rev-parse", "--show-toplevel"])).resolve()
    if not args.allow_dirty and not git_status_clean(repo_root):
        raise SystemExit("Primary checkout is dirty. Commit or stash changes before starting a task, or pass --allow-dirty.")

    branch_name = args.branch or f"task/{args.slug}"
    now = datetime.now()
    task_id = f"{now:%Y%m%d-%H%M}-{args.slug}"

    default_worktree = repo_root.parent / f"{repo_root.name}__wt__{args.slug}"
    worktree_path = Path(args.worktree_dir).resolve() if args.worktree_dir else default_worktree.resolve()

    existing_branches = run(["git", "branch", "--list", branch_name], cwd=repo_root)
    if existing_branches:
        run(["git", "worktree", "add", str(worktree_path), branch_name], cwd=repo_root)
    else:
        run(["git", "worktree", "add", "-b", branch_name, str(worktree_path), "main"], cwd=repo_root)

    task_dir = worktree_path / "tasks" / "active" / task_id
    task_dir.mkdir(parents=True, exist_ok=True)

    mapping = {
        "TASK_ID": task_id,
        "BRANCH_NAME": branch_name,
        "TASK_SUMMARY": args.summary,
        "CREATED_AT": now.isoformat(timespec="minutes"),
    }

    for target_rel, template_rel in TEMPLATE_FILES.items():
        template_path = worktree_path / template_rel
        target_path = task_dir / target_rel
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(render(template_path.read_text(encoding="utf-8"), mapping), encoding="utf-8")

    evidence_run_root = worktree_path / "evidence" / "runs" / task_id
    evidence_run_root.mkdir(parents=True, exist_ok=True)

    task_json = {
        "task_id": task_id,
        "summary": args.summary,
        "branch_name": branch_name,
        "created_at": now.isoformat(timespec="minutes"),
        "status": "in-progress",
        "worktree_path": str(worktree_path),
    }
    task_json.update(TASK_JSON_DEFAULTS)
    (task_dir / "task.json").write_text(json.dumps(task_json, indent=2), encoding="utf-8")

    print(f"Task created: {task_id}")
    print(f"Branch: {branch_name}")
    print(f"Worktree: {worktree_path}")
    print(f"Dossier: {task_dir}")
    print("Next: switch to the worktree, classify player_facing_change / requires_temporal_clip in task.json, and start committing granular changes.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
