import fs from "node:fs";

export function renderTemplate(filePath, replacements) {
  let template = fs.readFileSync(filePath, "utf8");
  for (const [key, value] of Object.entries(replacements)) {
    const pattern = new RegExp(`{{${key}}}`, "g");
    template = template.replace(pattern, value ?? "");
  }
  return template;
}
