import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { shippedSkill } from "@gerak/tools/scene";

const REPO = fileURLToPath(new URL("../../../", import.meta.url));
const SKILL = `${REPO}.claude/skills/make-motion/SKILL.md`;

function linksOf(text: string): string[] {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((match) => match[1] ?? "")
    .filter((link) => !/^[a-z][a-z0-9+.-]*:/i.test(link) && !link.startsWith("#"))
    .map((link) => link.replace(/#.*$/, ""));
}

describe("the shipped skill", () => {
  it("is the committed make-motion skill", () => {
    expect(shippedSkill()).toBe(readFileSync(SKILL, "utf8"));
  });

  it("links only to package docs that exist, by paths that become node_modules paths", () => {
    const links = linksOf(shippedSkill());
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.startsWith("../../../packages/"), link).toBe(true);
      expect(existsSync(resolve(dirname(SKILL), link)), link).toBe(true);
    }
  });

  it("names no repository script and no repository path with a placeholder", () => {
    const text = shippedSkill();
    expect(text).not.toContain(["npm run", "motion:"].join(" "));
    expect(text).not.toContain("apps/pieces/<");
  });
});
