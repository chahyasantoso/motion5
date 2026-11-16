import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL_NAME = "skill/make-motion/SKILL.md";
const REPO_GUIDE = "docs/guide";
const REPO_SKILL = ".claude/skills/make-motion/SKILL.md";

/** The guide an agent reads, by path inside it: the agent pages, the live page, and the skill with its links into the set. */
export function guideFiles(repoRoot: string): Readonly<Record<string, string>> {
  const folder = join(repoRoot, REPO_GUIDE);
  const files: Record<string, string> = {};
  for (const name of readdirSync(folder).sort())
    if (/^agent-.+\.md$/.test(name) || name === "live.md")
      files[name] = readFileSync(join(folder, name), "utf8");
  files[SKILL_NAME] = readFileSync(join(repoRoot, REPO_SKILL), "utf8").replaceAll(
    "../../../docs/guide/",
    "../../",
  );
  return files;
}

function readFolder(folder: string, prefix = ""): Record<string, string> {
  const files: Record<string, string> = {};
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = `${prefix}${entry.name}`;
    if (entry.isDirectory()) Object.assign(files, readFolder(join(folder, entry.name), `${path}/`));
    else files[path] = readFileSync(join(folder, entry.name), "utf8");
  }
  return files;
}

/** The guide this copy of the tools carries: in the repository (a `src` beside `dist`), its docs; installed, the `guide` folder. */
export function shippedGuide(): Readonly<Record<string, string>> {
  if (existsSync(fileURLToPath(new URL("../../src/", import.meta.url))))
    return guideFiles(fileURLToPath(new URL("../../../../", import.meta.url)));
  return readFolder(fileURLToPath(new URL("../../guide/", import.meta.url)));
}
