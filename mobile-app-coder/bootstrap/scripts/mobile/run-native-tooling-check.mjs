import fs from "node:fs";
import path from "node:path";
import { parseArgs } from "../lib/cli.mjs";
import { repoRootPath } from "../lib/backlog.mjs";

const { flags } = parseArgs(process.argv.slice(2));
const platform = (flags.platform ?? "").toLowerCase();

if (!platform || !["android", "ios"].includes(platform)) {
  throw new Error("Usage: node scripts/mobile/run-native-tooling-check.mjs --platform <android|ios>");
}

const repoRoot = repoRootPath();
const reviewDir = path.join(repoRoot, "artifacts", "review");
fs.mkdirSync(reviewDir, { recursive: true });

const report = `# Native tooling check - ${platform}

- verify local IDE path and SDK assumptions
- verify simulator or emulator target
- verify native signing or provisioning requirements before release work
`;

fs.writeFileSync(path.join(reviewDir, `${platform}-tooling-check.md`), report, "utf8");
console.log(`native tooling check written to ${reviewDir}`);
