import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** The make-motion skill as `gerak init` writes it: in the repository, the committed skill; installed, the copy the build wrote beside `dist`. */
export function shippedSkill(): string {
  const inRepository = existsSync(fileURLToPath(new URL("../../src/", import.meta.url)));
  const file = inRepository
    ? new URL("../../../../.claude/skills/make-motion/SKILL.md", import.meta.url)
    : new URL("../../skill/SKILL.md", import.meta.url);
  return readFileSync(fileURLToPath(file), "utf8");
}
