#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path

def main() -> int:
    parser = argparse.ArgumentParser(description="Create a human preview request for a task.")
    parser.add_argument("--task-id", required=True)
    parser.add_argument("--preview-artifact", required=True)
    parser.add_argument("--question", action="append", default=[])
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[2]
    task_dir = repo_root / "tasks" / "active" / args.task_id
    task_json_path = task_dir / "task.json"
    if not task_json_path.exists():
        raise SystemExit(f"Task dossier not found: {task_json_path}")

    task_json = json.loads(task_json_path.read_text(encoding="utf-8"))
    template = (repo_root / "templates" / "human-preview-request.md").read_text(encoding="utf-8")
    rendered = (
        template
        .replace("{{TASK_ID}}", task_json["task_id"])
        .replace("{{BRANCH_NAME}}", task_json["branch_name"])
        .replace("{{TASK_SUMMARY}}", task_json["summary"])
    )
    if args.question:
        question_block = "\n".join(f"{idx}. {q}" for idx, q in enumerate(args.question, start=1))
        rendered = rendered.replace("1.\n2.\n3.", question_block)

    rendered = rendered.replace("Path or URL:", f"Path or URL: {args.preview_artifact}")

    output_dir = task_dir / "human-loop"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"preview-request-{datetime.now():%Y%m%d-%H%M}.md"
    output_path.write_text(rendered, encoding="utf-8")

    task_json["status"] = "awaiting-human-preview"
    task_json_path.write_text(json.dumps(task_json, indent=2), encoding="utf-8")

    print(f"Created preview request: {output_path}")
    print("Task status updated to awaiting-human-preview")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
