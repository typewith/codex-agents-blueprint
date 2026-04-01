#!/usr/bin/env python3
from __future__ import annotations

import argparse
from datetime import datetime
import json
from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scripts.ops.pr_workflow import ensure_task_defaults, write_json

def main() -> int:
    parser = argparse.ArgumentParser(description="Create a new evidence pack for a task.")
    parser.add_argument("--task-id", required=True)
    parser.add_argument("--run-label", required=True)
    args = parser.parse_args()

    repo_root = REPO_ROOT
    stamp = datetime.now().strftime("%Y%m%d-%H%M")
    run_dir = repo_root / "evidence" / "runs" / args.task_id / f"{stamp}-{args.run_label}"
    for child in ["screenshots", "video", "logs", "notes"]:
        (run_dir / child).mkdir(parents=True, exist_ok=True)

    task_json_path = repo_root / "tasks" / "active" / args.task_id / "task.json"
    branch_name = "TBD"
    if task_json_path.exists():
        try:
            task_json = json.loads(task_json_path.read_text(encoding="utf-8"))
            if isinstance(task_json, dict):
                ensure_task_defaults(task_json)
                branch_name = task_json.get("branch_name", "TBD")
                task_json["selected_pr_evidence_run"] = run_dir.relative_to(repo_root).as_posix()
                write_json(task_json_path, task_json)
        except json.JSONDecodeError:
            branch_name = "TBD"

    template = (repo_root / "templates" / "evidence-report.md").read_text(encoding="utf-8")
    rendered = template.replace("{{TASK_ID}}", args.task_id).replace("{{BRANCH_NAME}}", branch_name)
    (run_dir / "run.md").write_text(rendered, encoding="utf-8")
    (run_dir / "screenshot-index.csv").write_text(
        (repo_root / "templates" / "screenshot-index.csv").read_text(encoding="utf-8"),
        encoding="utf-8",
    )
    (run_dir / "pr-media.json").write_text(
        (repo_root / "templates" / "pr-media.json").read_text(encoding="utf-8") + "\n",
        encoding="utf-8",
    )

    print(f"Created evidence pack: {run_dir}")
    print("Updated task.json with the selected PR evidence run.")
    print("Next: fill run.md, screenshot-index.csv, and pr-media.json before generating the PR body.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
