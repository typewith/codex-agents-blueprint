import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const backlogRoot = path.join(repoRoot, "backlog");

function readHeading(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const line = content.split(/\r?\n/).find((entry) => entry.startsWith("# "));
  return line ? line.replace(/^#\s+/, "").trim() : path.basename(filePath);
}

export function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function workItemToken(value) {
  return value.trim().replace(/[^A-Za-z0-9._-]+/g, "-");
}

function describePath(filePath) {
  if (!filePath) {
    return "external work item";
  }

  const relative = path.relative(repoRoot, filePath);
  if (relative && !relative.startsWith("..") && !path.isAbsolute(relative)) {
    return relative;
  }

  return filePath;
}

function normalizeSourcePath(sourcePath) {
  if (!sourcePath) {
    return null;
  }

  return path.isAbsolute(sourcePath) ? sourcePath : path.join(repoRoot, sourcePath);
}

export function tryResolveBacklogItem(itemId) {
  if (!fs.existsSync(backlogRoot)) {
    return null;
  }

  const normalized = itemId.trim().toUpperCase();
  const epicMatch = /^EPIC-(\d{2})$/.exec(normalized);

  if (epicMatch) {
    const folder = path.join(backlogRoot, normalized);
    const filePath = path.join(folder, "README.md");
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const title = readHeading(filePath);
    return {
      id: normalized,
      type: "epic",
      title,
      filePath,
      folder,
      slug: slugify(title),
      repoRoot,
      sourcePathLabel: describePath(filePath),
    };
  }

  const taskFileName = `${normalized}.md`;
  const epicFolders = fs.readdirSync(backlogRoot).filter((entry) => entry.startsWith("EPIC-"));

  for (const epicFolder of epicFolders) {
    const filePath = path.join(backlogRoot, epicFolder, taskFileName);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const title = readHeading(filePath);
    return {
      id: normalized,
      type: "task",
      title,
      filePath,
      folder: path.dirname(filePath),
      epicId: epicFolder,
      slug: slugify(title),
      repoRoot,
      sourcePathLabel: describePath(filePath),
    };
  }

  return null;
}

export function resolveBacklogItem(itemId) {
  const item = tryResolveBacklogItem(itemId);
  if (!item) {
    throw new Error(`Backlog item not found: ${itemId.trim()}`);
  }
  return item;
}

export function resolveWorkItem(itemId, options = {}) {
  const backlogItem = tryResolveBacklogItem(itemId);
  if (backlogItem) {
    return backlogItem;
  }

  const normalizedId = itemId.trim();
  const title = (options.title ?? normalizedId).trim();
  const filePath = normalizeSourcePath(options.sourcePath ?? null);

  return {
    id: normalizedId,
    type: "work-item",
    title,
    filePath,
    folder: filePath ? path.dirname(filePath) : repoRoot,
    slug: slugify(title),
    repoRoot,
    sourcePathLabel: describePath(filePath),
  };
}

export function repoRootPath() {
  return repoRoot;
}
