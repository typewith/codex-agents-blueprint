import fs from "node:fs";
import path from "node:path";
import { repoRootPath } from "./backlog.mjs";

function unquote(value) {
  if (value.length < 2) {
    return value;
  }

  const first = value[0];
  const last = value[value.length - 1];

  if ((first === "\"" || first === "'") && last === first) {
    const inner = value.slice(1, -1);
    if (first === "\"") {
      return inner
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, "\"")
        .replace(/\\\\/g, "\\");
    }
    return inner.replace(/\\'/g, "'");
  }

  return value;
}

function parseEnvFile(content) {
  const parsed = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const normalized = line.startsWith("export ") ? line.slice(7).trim() : line;
    const match = /^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(normalized);
    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    const value = unquote(rawValue.trim());
    parsed[key] = value;
  }

  return parsed;
}

export function loadRepoEnv() {
  const repoRoot = repoRootPath();
  const candidates = [".env", ".env.local"];

  for (const fileName of candidates) {
    const filePath = path.join(repoRoot, fileName);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const loaded = parseEnvFile(fs.readFileSync(filePath, "utf8"));
    for (const [key, value] of Object.entries(loaded)) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}
