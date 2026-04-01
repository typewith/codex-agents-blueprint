#!/usr/bin/env python3
from __future__ import annotations

import json
import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import quote

TASK_JSON_DEFAULTS = {
    "player_facing_change": None,
    "requires_temporal_clip": None,
    "selected_pr_evidence_run": None,
    "native_pr_upload_status": "not-started",
    "native_pr_comment_url": None,
    "pr_number": None,
    "pr_url": None,
}

NATIVE_UPLOAD_PENDING = "pending-native-upload"
NATIVE_UPLOAD_UPLOADED = "uploaded"


class PRWorkflowError(RuntimeError):
    """Raised when a task does not meet the PR workflow contract."""


@dataclass
class MediaEntry:
    kind: str
    relative_path: str
    scenario_id: str
    caption: str
    duration_seconds: float | None
    include_in_pr_body: bool
    upload_native_to_github: bool
    absolute_path: Path
    repo_relative_path: str


@dataclass
class PRArtifacts:
    task_dir: Path
    task_json_path: Path
    task_json: dict[str, Any]
    pr_body_path: Path
    pr_comment_path: Path
    pr_body: str
    pr_comment: str
    run_dir: Path | None
    run_relative_path: str | None
    media_entries: list[MediaEntry]
    native_media_entries: list[MediaEntry]
    body_media_entries: list[MediaEntry]


def repo_root_from(script_path: Path) -> Path:
    return script_path.resolve().parents[2]


def render_template(text: str, mapping: dict[str, str]) -> str:
    rendered = text
    for key, value in mapping.items():
        rendered = rendered.replace("{{" + key + "}}", value)
    return rendered


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def ensure_task_defaults(task_json: dict[str, Any]) -> bool:
    changed = False
    for key, value in TASK_JSON_DEFAULTS.items():
        if key not in task_json:
            task_json[key] = value
            changed = True
    return changed


def load_task(repo_root: Path, task_id: str, *, persist_defaults: bool = False) -> tuple[Path, Path, dict[str, Any]]:
    task_dir = repo_root / "tasks" / "active" / task_id
    task_json_path = task_dir / "task.json"
    if not task_json_path.exists():
        raise PRWorkflowError(f"Task dossier not found: {task_json_path}")

    task_json = load_json(task_json_path)
    if not isinstance(task_json, dict):
        raise PRWorkflowError(f"Task json must be an object: {task_json_path}")

    if ensure_task_defaults(task_json) and persist_defaults:
        write_json(task_json_path, task_json)

    return task_dir, task_json_path, task_json


def bool_label(value: Any) -> str:
    if value is True:
        return "yes"
    if value is False:
        return "no"
    return "unset"


def read_git_stdout(repo_root: Path, *args: str) -> str | None:
    completed = subprocess.run(
        ["git", *args],
        cwd=str(repo_root),
        capture_output=True,
        text=True,
        check=False,
    )
    if completed.returncode != 0:
        return None
    return completed.stdout.strip()


def parse_origin_slug(remote_url: str | None) -> str | None:
    if not remote_url:
        return None

    cleaned = remote_url.strip().removesuffix(".git").rstrip("/")
    if cleaned.startswith("git@github.com:"):
        return cleaned.split(":", 1)[1]
    if cleaned.startswith("ssh://git@github.com/"):
        return cleaned.removeprefix("ssh://git@github.com/")
    if cleaned.startswith("https://github.com/"):
        return cleaned.removeprefix("https://github.com/")
    return None


def github_blob_url(repo_slug: str | None, revision: str | None, repo_relative_path: str, *, raw: bool = False) -> str | None:
    if not repo_slug or not revision:
        return None

    encoded_revision = quote(revision, safe="")
    encoded_path = quote(repo_relative_path.replace("\\", "/"), safe="/")
    suffix = "?raw=1" if raw else ""
    return f"https://github.com/{repo_slug}/blob/{encoded_revision}/{encoded_path}{suffix}"


def load_pr_media(run_dir: Path) -> list[dict[str, Any]]:
    manifest_path = run_dir / "pr-media.json"
    if not manifest_path.exists():
        raise PRWorkflowError(f"Missing PR media manifest: {manifest_path}")

    payload = load_json(manifest_path)
    if isinstance(payload, list):
        media_items = payload
    elif isinstance(payload, dict) and isinstance(payload.get("media"), list):
        media_items = payload["media"]
    else:
        raise PRWorkflowError(f"Expected pr-media.json to contain a 'media' list: {manifest_path}")

    normalized: list[dict[str, Any]] = []
    for item in media_items:
        if not isinstance(item, dict):
            raise PRWorkflowError(f"Each PR media entry must be an object: {manifest_path}")
        normalized.append(item)
    return normalized


def coerce_duration(value: Any, label: str) -> float | None:
    if value in (None, ""):
        return None
    if isinstance(value, bool):
        raise PRWorkflowError(f"{label} must be numeric, not boolean.")
    if isinstance(value, (int, float)):
        return float(value)
    try:
        return float(str(value))
    except ValueError as exc:
        raise PRWorkflowError(f"{label} must be numeric.") from exc


def validate_media_entries(repo_root: Path, run_dir: Path, manifest_entries: list[dict[str, Any]]) -> list[MediaEntry]:
    entries: list[MediaEntry] = []
    for index, item in enumerate(manifest_entries, start=1):
        label = f"{run_dir / 'pr-media.json'} entry #{index}"
        kind = item.get("kind")
        if kind not in {"screenshot", "clip"}:
            raise PRWorkflowError(f"{label}: 'kind' must be 'screenshot' or 'clip'.")

        relative_path = item.get("relative_path")
        if not isinstance(relative_path, str) or not relative_path.strip():
            raise PRWorkflowError(f"{label}: 'relative_path' is required.")

        scenario_id = item.get("scenario_id")
        if not isinstance(scenario_id, str) or not scenario_id.strip():
            raise PRWorkflowError(f"{label}: 'scenario_id' is required.")

        caption = item.get("caption")
        if not isinstance(caption, str) or not caption.strip():
            raise PRWorkflowError(f"{label}: 'caption' is required.")

        include_in_pr_body = item.get("include_in_pr_body")
        if not isinstance(include_in_pr_body, bool):
            raise PRWorkflowError(f"{label}: 'include_in_pr_body' must be true or false.")

        upload_native_to_github = item.get("upload_native_to_github")
        if not isinstance(upload_native_to_github, bool):
            raise PRWorkflowError(f"{label}: 'upload_native_to_github' must be true or false.")

        duration_seconds = coerce_duration(item.get("duration_seconds"), f"{label}: 'duration_seconds'")
        if kind == "clip" and duration_seconds is None:
            raise PRWorkflowError(f"{label}: clips require 'duration_seconds'.")
        if kind == "screenshot" and duration_seconds is not None:
            raise PRWorkflowError(f"{label}: screenshots must leave 'duration_seconds' empty.")
        if duration_seconds is not None and duration_seconds <= 0:
            raise PRWorkflowError(f"{label}: 'duration_seconds' must be greater than zero.")

        absolute_path = (run_dir / Path(relative_path)).resolve()
        try:
            absolute_path.relative_to(run_dir.resolve())
        except ValueError as exc:
            raise PRWorkflowError(f"{label}: 'relative_path' must stay inside the evidence run directory.") from exc

        if not absolute_path.exists():
            raise PRWorkflowError(f"{label}: media file not found: {absolute_path}")

        repo_relative_path = absolute_path.relative_to(repo_root.resolve()).as_posix()
        entries.append(
            MediaEntry(
                kind=kind,
                relative_path=relative_path.replace("\\", "/"),
                scenario_id=scenario_id.strip(),
                caption=caption.strip(),
                duration_seconds=duration_seconds,
                include_in_pr_body=include_in_pr_body,
                upload_native_to_github=upload_native_to_github,
                absolute_path=absolute_path,
                repo_relative_path=repo_relative_path,
            )
        )

    return entries


def task_requires_classification(task_json: dict[str, Any]) -> None:
    if task_json.get("player_facing_change") not in {True, False}:
        raise PRWorkflowError(
            "Task PR generation is blocked until 'player_facing_change' is explicitly set to true or false in task.json."
        )
    if task_json.get("requires_temporal_clip") not in {True, False}:
        raise PRWorkflowError(
            "Task PR generation is blocked until 'requires_temporal_clip' is explicitly set to true or false in task.json."
        )
    if task_json["requires_temporal_clip"] and not task_json["player_facing_change"]:
        raise PRWorkflowError("'requires_temporal_clip' cannot be true when 'player_facing_change' is false.")


def collect_media(repo_root: Path, task_json: dict[str, Any]) -> tuple[Path | None, str | None, list[MediaEntry]]:
    resolved_root = repo_root.resolve()
    run_relative_path = task_json.get("selected_pr_evidence_run")
    if not run_relative_path:
        return None, None, []

    run_dir = (resolved_root / Path(run_relative_path)).resolve()
    if not run_dir.exists():
        raise PRWorkflowError(f"Selected PR evidence run does not exist: {run_dir}")

    entries = validate_media_entries(resolved_root, run_dir, load_pr_media(run_dir))
    return run_dir, run_dir.relative_to(resolved_root).as_posix(), entries


def ensure_player_facing_media(task_json: dict[str, Any], run_relative_path: str | None, media_entries: list[MediaEntry]) -> None:
    if not task_json["player_facing_change"]:
        return

    if not run_relative_path:
        raise PRWorkflowError("Player-facing tasks must set 'selected_pr_evidence_run' before generating a PR.")

    screenshot_entries = [
        entry
        for entry in media_entries
        if entry.kind == "screenshot" and entry.include_in_pr_body and entry.upload_native_to_github
    ]
    if not screenshot_entries:
        raise PRWorkflowError(
            "Player-facing tasks need at least one screenshot in pr-media.json with both "
            "'include_in_pr_body' and 'upload_native_to_github' set to true."
        )

    if task_json["requires_temporal_clip"]:
        clip_entries = [
            entry
            for entry in media_entries
            if entry.kind == "clip" and entry.include_in_pr_body and entry.upload_native_to_github
        ]
        if not clip_entries:
            raise PRWorkflowError(
                "Tasks marked with 'requires_temporal_clip' need at least one clip in pr-media.json with both "
                "'include_in_pr_body' and 'upload_native_to_github' set to true."
            )
        for entry in clip_entries:
            if entry.duration_seconds is None or entry.duration_seconds > 15:
                raise PRWorkflowError(
                    f"Clip '{entry.repo_relative_path}' exceeds the 15 second PR limit or is missing duration metadata."
                )


def format_scenario_ids(media_entries: list[MediaEntry]) -> str:
    scenario_ids = sorted({entry.scenario_id for entry in media_entries if entry.include_in_pr_body or entry.upload_native_to_github})
    if not scenario_ids:
        return "none"
    return ", ".join(f"`{scenario_id}`" for scenario_id in scenario_ids)


def format_native_upload_status(task_json: dict[str, Any]) -> str:
    if not task_json["player_facing_change"]:
        return "`not-required`"
    status = task_json.get("native_pr_upload_status") or "not-started"
    comment_url = task_json.get("native_pr_comment_url")
    if comment_url:
        return f"`{status}` ([comment]({comment_url}))"
    return f"`{status}`"


def format_evidence_run(run_relative_path: str | None, task_json: dict[str, Any]) -> str:
    if run_relative_path:
        return f"`{run_relative_path}`"
    if task_json["player_facing_change"]:
        return "missing"
    return "not required for non-player-facing task"


def format_media_section(repo_root: Path, task_json: dict[str, Any], body_media_entries: list[MediaEntry]) -> str:
    if not body_media_entries:
        if task_json["player_facing_change"]:
            return "_Missing repo-backed PR media._"
        return "_No repo-backed PR media required for this task._"

    repo_slug = parse_origin_slug(read_git_stdout(repo_root, "config", "--get", "remote.origin.url"))
    revision = read_git_stdout(repo_root, "rev-parse", "HEAD")
    lines: list[str] = []
    for entry in body_media_entries:
        lines.append(f"### {entry.kind.title()}: {entry.caption}")
        if entry.kind == "screenshot":
            image_url = github_blob_url(repo_slug, revision, entry.repo_relative_path, raw=True)
            if image_url:
                lines.append(f"![{entry.caption}]({image_url})")
            else:
                lines.append(f"`{entry.repo_relative_path}`")
        else:
            clip_url = github_blob_url(repo_slug, revision, entry.repo_relative_path, raw=False)
            duration_label = f"{entry.duration_seconds:.1f}s" if entry.duration_seconds is not None else "duration unset"
            if clip_url:
                lines.append(f"- [{entry.caption}]({clip_url})")
            else:
                lines.append(f"- `{entry.repo_relative_path}`")
            lines.append(f"- Scenario: `{entry.scenario_id}`")
            lines.append(f"- Duration: `{duration_label}`")
        if entry.kind == "screenshot":
            lines.append(f"`{entry.repo_relative_path}`")
            lines.append(f"Scenario: `{entry.scenario_id}`")
        lines.append("")
    return "\n".join(lines).strip()


def format_native_comment_body(task_json: dict[str, Any], run_relative_path: str | None, native_media_entries: list[MediaEntry]) -> str:
    if not native_media_entries:
        return (
            "## Native PR Evidence\n\n"
            "No native GitHub uploads are required for this task because it is not marked as player-facing."
        )

    lines = [
        "## Native PR Evidence",
        "",
        "This comment uploads the same PR media selected in the evidence manifest.",
        "",
        f"- Task id: `{task_json['task_id']}`",
        f"- Evidence run: `{run_relative_path}`",
        "",
        "## Planned uploads",
        "",
    ]
    for entry in native_media_entries:
        duration = f" ({entry.duration_seconds:.1f}s)" if entry.duration_seconds is not None else ""
        lines.append(f"- `{entry.kind}`: {entry.caption} [{entry.scenario_id}]{duration}")
    lines.append("")
    lines.append("## Uploaded assets")
    lines.append("")
    return "\n".join(lines)


def build_pr_artifacts(repo_root: Path, task_id: str, *, persist_task_defaults: bool = True) -> PRArtifacts:
    repo_root = repo_root.resolve()
    task_dir, task_json_path, task_json = load_task(repo_root, task_id, persist_defaults=persist_task_defaults)
    task_requires_classification(task_json)

    run_dir, run_relative_path, media_entries = collect_media(repo_root, task_json)
    ensure_player_facing_media(task_json, run_relative_path, media_entries)

    body_media_entries = [entry for entry in media_entries if entry.include_in_pr_body]
    native_media_entries = [entry for entry in media_entries if entry.upload_native_to_github]

    body_template_path = task_dir / "pr-body.md"
    if not body_template_path.exists():
        body_template_path = repo_root / "templates" / "pr-body.md"
    body_template = body_template_path.read_text(encoding="utf-8")
    comment_template = (repo_root / "templates" / "pr-comment.md").read_text(encoding="utf-8")

    mapping = {
        "TASK_ID": str(task_json["task_id"]),
        "BRANCH_NAME": str(task_json["branch_name"]),
        "TASK_SUMMARY": str(task_json["summary"]),
        "PLAYER_FACING_CHANGE": bool_label(task_json["player_facing_change"]),
        "REQUIRES_TEMPORAL_CLIP": bool_label(task_json["requires_temporal_clip"]),
        "PR_EVIDENCE_RUN": format_evidence_run(run_relative_path, task_json),
        "SCENARIO_IDS": format_scenario_ids(media_entries),
        "NATIVE_PR_UPLOAD_STATUS": format_native_upload_status(task_json),
        "NATIVE_PR_COMMENT_URL": task_json.get("native_pr_comment_url") or "not posted yet",
        "REPO_BACKED_PR_MEDIA": format_media_section(repo_root, task_json, body_media_entries),
        "NATIVE_PR_MEDIA_PLAN": "\n".join(
            f"- `{entry.kind}`: `{entry.repo_relative_path}`" for entry in native_media_entries
        )
        or "- none",
        "COMMENT_NATIVE_BODY": format_native_comment_body(task_json, run_relative_path, native_media_entries),
    }

    pr_body = render_template(body_template, mapping).rstrip() + "\n"
    pr_comment = render_template(comment_template, mapping).rstrip() + "\n"

    pr_body_path = task_dir / "pr-body.generated.md"
    pr_comment_path = task_dir / "pr-comment.generated.md"

    return PRArtifacts(
        task_dir=task_dir,
        task_json_path=task_json_path,
        task_json=task_json,
        pr_body_path=pr_body_path,
        pr_comment_path=pr_comment_path,
        pr_body=pr_body,
        pr_comment=pr_comment,
        run_dir=run_dir,
        run_relative_path=run_relative_path,
        media_entries=media_entries,
        native_media_entries=native_media_entries,
        body_media_entries=body_media_entries,
    )


def write_pr_artifacts(repo_root: Path, task_id: str, *, persist_task_defaults: bool = True) -> PRArtifacts:
    artifacts = build_pr_artifacts(repo_root, task_id, persist_task_defaults=persist_task_defaults)
    artifacts.pr_body_path.write_text(artifacts.pr_body, encoding="utf-8")
    artifacts.pr_comment_path.write_text(artifacts.pr_comment, encoding="utf-8")
    return artifacts
