#!/usr/bin/env python3
from __future__ import annotations

import json
import shutil
import tempfile
import urllib.request
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

UNREAL_MCP_ZIP_URL = "https://codeload.github.com/ChiR24/Unreal_mcp/zip/refs/heads/main"
MCP_UNREAL_ZIP_URL = "https://codeload.github.com/remiphilippe/mcp-unreal/zip/refs/heads/main"

REQUIRED_PROJECT_PLUGIN_ENTRIES = [
    {"Name": "McpAutomationBridge", "Enabled": True},
    {"Name": "MCPUnreal", "Enabled": True},
    {"Name": "RemoteControl", "Enabled": True},
    {"Name": "EditorScriptingUtilities", "Enabled": True},
    {"Name": "Niagara", "Enabled": True},
    {"Name": "Fab", "Enabled": True},
]

DEFAULT_ENGINE_APPEND = """
; Added by bootstrap scripts/mcp/project_config.py
[ConsoleVariables]
mcp.Port=8090
"""

@dataclass(frozen=True)
class PluginInstallSpec:
    name: str
    zip_url: str
    extracted_plugin_path: str
    license_path: str
    dest_dir_name: str


PLUGIN_INSTALL_SPECS = [
    PluginInstallSpec(
        name="Unreal_mcp",
        zip_url=UNREAL_MCP_ZIP_URL,
        extracted_plugin_path="Unreal_mcp-main/plugins/McpAutomationBridge",
        license_path="Unreal_mcp-main/LICENSE",
        dest_dir_name="McpAutomationBridge",
    ),
    PluginInstallSpec(
        name="mcp-unreal",
        zip_url=MCP_UNREAL_ZIP_URL,
        extracted_plugin_path="mcp-unreal-main/plugin",
        license_path="mcp-unreal-main/LICENSE",
        dest_dir_name="MCPUnreal",
    ),
]


def detect_uproject(project_root: Path) -> Path:
    files = list(project_root.glob("*.uproject"))
    if len(files) != 1:
        raise RuntimeError(f"Expected exactly one .uproject in {project_root}, found {len(files)}")
    return files[0]


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def dump_json(path: Path, payload: dict) -> None:
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


LEGACY_BAD_PLUGIN_NAMES = {"RemoteControlAPI"}


def remove_plugin_entries(path: Path, names: set[str]) -> bool:
    payload = load_json(path)
    plugins = payload.get("Plugins", [])
    filtered = [entry for entry in plugins if not (isinstance(entry, dict) and entry.get("Name") in names)]
    if filtered == plugins:
        return False
    payload["Plugins"] = filtered
    dump_json(path, payload)
    return True


def ensure_plugin_entries(uproject_path: Path, entries: Iterable[dict]) -> bool:
    payload = load_json(uproject_path)
    plugins = payload.setdefault("Plugins", [])
    changed = False
    filtered_plugins = [entry for entry in plugins if not (isinstance(entry, dict) and entry.get("Name") in LEGACY_BAD_PLUGIN_NAMES)]
    if filtered_plugins != plugins:
        plugins[:] = filtered_plugins
        changed = True
    by_name = {entry.get("Name"): entry for entry in plugins if isinstance(entry, dict) and entry.get("Name")}
    for wanted in entries:
        name = wanted["Name"]
        existing = by_name.get(name)
        if existing is None:
            plugins.append(dict(wanted))
            changed = True
            continue
        for key, value in wanted.items():
            if existing.get(key) != value:
                existing[key] = value
                changed = True
    if changed:
        payload["Plugins"] = sorted(plugins, key=lambda item: item.get("Name", ""))
        dump_json(uproject_path, payload)
    return changed


def ensure_default_engine_append(project_root: Path) -> bool:
    path = project_root / "Config" / "DefaultEngine.ini"
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text(DEFAULT_ENGINE_APPEND.lstrip(), encoding="utf-8")
        return True
    text = path.read_text(encoding="utf-8")
    if "mcp.Port=8090" in text:
        return False
    separator = "\n" if text.endswith("\n") else "\n\n"
    path.write_text(text + separator + DEFAULT_ENGINE_APPEND.lstrip(), encoding="utf-8")
    return True


def copytree_replace(src: Path, dst: Path) -> None:
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)


def _download_archive(url: str, temp_dir: Path) -> Path:
    archive_path = temp_dir / Path(url).name
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 bootstrap-installer"})
    with urllib.request.urlopen(req) as response, archive_path.open("wb") as fh:
        shutil.copyfileobj(response, fh)
    return archive_path


def install_plugin_from_archive(*, spec: PluginInstallSpec, project_root: Path, temp_dir: Path) -> tuple[Path, Path | None]:
    archive_path = _download_archive(spec.zip_url, temp_dir)
    with zipfile.ZipFile(archive_path) as zf:
        zf.extractall(temp_dir)
    src_plugin = temp_dir / spec.extracted_plugin_path
    if not src_plugin.exists():
        raise RuntimeError(f"Archive layout changed for {spec.name}: {src_plugin} missing")
    dst_plugin = project_root / "Plugins" / spec.dest_dir_name
    copytree_replace(src_plugin, dst_plugin)
    license_src = temp_dir / spec.license_path
    if license_src.exists():
        notices_dir = project_root / "Plugins" / "ThirdPartyNotices"
        notices_dir.mkdir(parents=True, exist_ok=True)
        license_dst = notices_dir / f"{spec.dest_dir_name}-LICENSE.txt"
        shutil.copy2(license_src, license_dst)
    else:
        license_dst = None
    return dst_plugin, license_dst


def patch_mcpunreal_descriptor(descriptor_path: Path) -> bool:
    if not descriptor_path.exists():
        return False
    payload = load_json(descriptor_path)
    plugins = payload.setdefault("Plugins", [])
    changed = False
    filtered_plugins = [entry for entry in plugins if not (isinstance(entry, dict) and entry.get("Name") in LEGACY_BAD_PLUGIN_NAMES)]
    if filtered_plugins != plugins:
        plugins[:] = filtered_plugins
        changed = True
    required = [
        {"Name": "Fab", "Enabled": True},
        {"Name": "RemoteControl", "Enabled": True},
    ]
    by_name = {entry.get("Name"): entry for entry in plugins if isinstance(entry, dict) and entry.get("Name")}
    for wanted in required:
        existing = by_name.get(wanted["Name"])
        if existing is None:
            plugins.append(dict(wanted))
            changed = True
        else:
            for key, value in wanted.items():
                if existing.get(key) != value:
                    existing[key] = value
                    changed = True
    if changed:
        payload["Plugins"] = sorted(plugins, key=lambda item: item.get("Name", ""))
        dump_json(descriptor_path, payload)
    return changed


def parse_enabled_plugins(uproject_path: Path) -> dict[str, dict]:
    payload = load_json(uproject_path)
    plugins = payload.get("Plugins", [])
    result: dict[str, dict] = {}
    for entry in plugins:
        if isinstance(entry, dict) and entry.get("Name"):
            result[entry["Name"]] = entry
    return result


def with_temp_dir() -> tempfile.TemporaryDirectory[str]:
    return tempfile.TemporaryDirectory(prefix="ue_mcp_bootstrap_")
