import { readdirSync } from "node:fs";
import { dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { guideFiles } from "@gerak/tools/scene";

const REPO = fileURLToPath(new URL("../../../", import.meta.url));
const SKILL = "skill/make-motion/SKILL.md";

function linksOf(text: string): string[] {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((match) => match[1] ?? "")
    .filter((link) => !/^[a-z][a-z0-9+.-]*:/i.test(link) && !link.startsWith("#"))
    .map((link) => link.replace(/#.*$/, ""));
}

describe("the shipped guide", () => {
  const files = guideFiles(REPO);

  it("holds every agent page, the live page and the skill", () => {
    const pages = readdirSync(`${REPO}docs/guide`).filter((name) => /^agent-.+\.md$/.test(name));
    expect(pages.length).toBeGreaterThan(0);
    for (const page of [...pages, "live.md", SKILL])
      expect(Object.keys(files), page).toContain(page);
    expect(Object.keys(files).sort()).toEqual([...pages, "live.md", SKILL].sort());
  });

  it("links every page only to another file it holds", () => {
    for (const [name, text] of Object.entries(files))
      for (const link of linksOf(text)) {
        const target = posix.normalize(posix.join(dirname(name), link));
        expect(Object.keys(files), `${name} -> ${link}`).toContain(target);
      }
  });

  it("names no repository script and no repository path with a placeholder", () => {
    for (const [name, text] of Object.entries(files)) {
      expect(text, name).not.toContain(["npm run", "motion:"].join(" "));
      expect(text, name).not.toContain("apps/pieces/<");
    }
  });

  it("sends the skill only into the set", () => {
    const skill = files[SKILL] ?? "";
    const links = linksOf(skill);
    expect(links.length).toBeGreaterThan(0);
    for (const link of links)
      expect(Object.keys(files), link).toContain(posix.normalize(posix.join(dirname(SKILL), link)));
  });
});
