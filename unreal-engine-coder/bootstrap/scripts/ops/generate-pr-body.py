#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

from pr_workflow import PRWorkflowError, repo_root_from, write_pr_artifacts

def main() -> int:
    parser = argparse.ArgumentParser(description="Render a task PR body from the repo template.")
    parser.add_argument("--task-id", required=True, help="Task id under tasks/active/")
    args = parser.parse_args()

    repo_root = repo_root_from(Path(__file__))
    try:
        artifacts = write_pr_artifacts(repo_root, args.task_id)
    except PRWorkflowError as exc:
        raise SystemExit(str(exc)) from exc

    print(f"Generated PR body: {artifacts.pr_body_path}")
    print(f"Generated native PR comment: {artifacts.pr_comment_path}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
