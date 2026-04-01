#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
import socket
from pathlib import Path

from project_config import detect_uproject, parse_enabled_plugins


def port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.3)
        return sock.connect_ex(("127.0.0.1", port)) == 0


def line(level: str, ok: bool, label: str) -> str:
    prefix = "PASS" if ok else level
    return f"[{prefix}] {label}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Check local MCP prerequisites for the Unreal repo.")
    parser.add_argument("--project-root", required=True)
    args = parser.parse_args()

    project_root = Path(args.project_root).resolve()
    try:
        uproject = detect_uproject(project_root)
    except Exception:
        uproject = None

    plugin_unreal_mcp = project_root / "Plugins" / "McpAutomationBridge" / "McpAutomationBridge.uplugin"
    plugin_mcp_unreal = project_root / "Plugins" / "MCPUnreal" / "MCPUnreal.uplugin"
    local_codex = project_root / ".codex" / "config.local.toml"
    enabled = parse_enabled_plugins(uproject) if uproject else {}

    checks = [
        line("FAIL", uproject is not None, f".uproject detected ({uproject})" if uproject else ".uproject detected"),
        line("WARN", shutil.which("node") is not None, "node available"),
        line("WARN", shutil.which("npx") is not None, "npx available"),
        line("WARN", shutil.which("go") is not None, "go available"),
        line("WARN", shutil.which("mcp-unreal") is not None, "mcp-unreal binary available"),
        line("WARN", plugin_unreal_mcp.exists(), f"{plugin_unreal_mcp} exists"),
        line("WARN", plugin_mcp_unreal.exists(), f"{plugin_mcp_unreal} exists"),
        line("WARN", local_codex.exists(), f"{local_codex} exists"),
        line("WARN", enabled.get("McpAutomationBridge", {}).get("Enabled") is True, "McpAutomationBridge enabled in .uproject"),
        line("WARN", enabled.get("MCPUnreal", {}).get("Enabled") is True, "MCPUnreal enabled in .uproject"),
        line("WARN", enabled.get("RemoteControl", {}).get("Enabled") is True, "RemoteControl enabled in .uproject"),
        line("WARN", port_open(30010), "Remote Control API port 30010 reachable"),
        line("WARN", port_open(8090), "MCPUnreal plugin port 8090 reachable"),
        line("WARN", port_open(8091), "McpAutomationBridge port 8091 reachable"),
    ]

    print("MCP healthcheck")
    print(f"Project root: {project_root}")
    if uproject is None:
        print("Note: no .uproject was found. This is expected before the real Unreal project is created.")
    for entry in checks:
        print(entry)

    return 0 if uproject else 1


if __name__ == "__main__":
    raise SystemExit(main())
