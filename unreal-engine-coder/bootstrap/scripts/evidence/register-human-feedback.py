#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path

def main() -> int:
    parser = argparse.ArgumentParser(description="Register human feedback for a task preview gate.")
    parser.add_argument("--task-id", required=True)
    parser.add_argument("--reviewer", default="human")
    parser.add_argument("--verdict", required=True, choices=["approve", "request-changes", "block"])
    parser.add_argument("--summary", help="Concise interpreted summary of the feedback")
    parser.add_argument("--original", default="(original wording not captured yet)")
    parser.add_argument("--feedback-file", help="Optional file whose contents should become the original wording")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[2]
    task_dir = repo_root / "tasks" / "active" / args.task_id
    task_json_path = task_dir / "task.json"
    if not task_json_path.exists():
        raise SystemExit(f"Task dossier not found: {task_json_path}")

    original = args.original
    if args.feedback_file:
        original = Path(args.feedback_file).read_text(encoding="utf-8").strip()

    summary = args.summary or "Review the original wording and derive actionable next steps."

    task_json = json.loads(task_json_path.read_text(encoding="utf-8"))
    template = (repo_root / "templates" / "human-feedback.md").read_text(encoding="utf-8")
    rendered = template.replace("{{TASK_ID}}", task_json["task_id"])
    rendered = rendered.replace("- Reviewer:", f"- Reviewer: {args.reviewer}")
    rendered = rendered.replace("- Date/time:", f"- Date/time: {datetime.now().isoformat(timespec='minutes')}")
    rendered = rendered.replace("- Verdict:", f"- Verdict: {args.verdict}")
    rendered = rendered.replace("> Paste the human's wording here verbatim.", f"> {original}")
    rendered = rendered.replace("1.\n2.\n3.", f"1. {summary}\n2.\n3.")

    output_dir = task_dir / "human-loop"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"feedback-{datetime.now():%Y%m%d-%H%M}.md"
    output_path.write_text(rendered, encoding="utf-8")

    task_json["status"] = "human-feedback-received"
    task_json_path.write_text(json.dumps(task_json, indent=2), encoding="utf-8")

    print(f"Registered human feedback: {output_path}")
    print("Task status updated to human-feedback-received")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
