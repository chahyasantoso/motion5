import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, posix, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { COMMANDS } from "../../packages/tools/bin/commands.mjs";

const ROOT = new URL("../../", import.meta.url);
const ROOT_PATH = fileURLToPath(ROOT);
const PACKAGES = join(ROOT_PATH, "packages");

interface Manifest {
  readonly name: string;
  readonly files?: readonly string[];
  readonly exports?: Readonly<Record<string, unknown>>;
}

function manifestOf(dir: string): Manifest | undefined {
  const file = join(PACKAGES, dir, "package.json");
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : undefined;
}

/** Every markdown file under a folder, as a path from the repository root. */
function markdownIn(folder: string): string[] {
  return readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    if (statSync(path).isDirectory()) return markdownIn(path);
    return name.endsWith(".md") ? [relative(ROOT_PATH, path).split("\\").join("/")] : [];
  });
}

const DOC_PACKAGES = readdirSync(PACKAGES).filter((dir) => existsSync(join(PACKAGES, dir, "docs")));

/** Pages a person or agent writes: every docs page except the generated reference. */
const HAND_WRITTEN = DOC_PACKAGES.flatMap((dir) =>
  markdownIn(join(PACKAGES, dir, "docs")).filter((path) => !path.includes("/docs/reference/")),
);
const guide = HAND_WRITTEN.map((page) => readFileSync(new URL(page, ROOT), "utf8")).join("\n");
const manifest: { readonly scripts: Readonly<Record<string, string>> } = JSON.parse(
  readFileSync(new URL("package.json", ROOT), "utf8"),
);

function rawLinksOf(text: string): string[] {
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
    .map((match) => match[1] ?? "")
    .filter((link) => !/^[a-z][a-z0-9+.-]*:/i.test(link));
}

function linksOf(text: string): string[] {
  return rawLinksOf(text)
    .filter((link) => !link.startsWith("#"))
    .map((link) => link.replace(/#.*$/, ""));
}

/** GitHub-style heading anchors of a markdown document. */
function headingSlugs(text: string): Set<string> {
  const counts = new Map<string, number>();
  const slugs = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const match = /^#{1,6}\s+(.+?)\s*$/.exec(line);
    if (match === null) continue;
    const plain = (match[1] ?? "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[`*_~]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-");
    if (plain === "") continue;
    const seen = counts.get(plain) ?? 0;
    counts.set(plain, seen + 1);
    slugs.add(seen === 0 ? plain : `${plain}-${seen}`);
  }
  return slugs;
}

describe("package docs", () => {
  it("ship in every package that has them", () => {
    expect(DOC_PACKAGES.length).toBeGreaterThan(10);
    for (const dir of DOC_PACKAGES) expect(manifestOf(dir)?.files, dir).toContain("docs");
  });

  it.each(DOC_PACKAGES)(
    "%s: every relative link resolves inside its docs, or into another package's docs by the path an installed project has",
    (dir) => {
      const pages = markdownIn(join(PACKAGES, dir, "docs"));
      for (const page of pages) {
        const text = readFileSync(new URL(page, ROOT), "utf8");
        for (const link of linksOf(text)) {
          const target = posix.normalize(posix.join(posix.dirname(page), link));
          const own = `packages/${dir}/docs/`;
          const other = /^packages\/([\w-]+)\/docs\//.exec(target)?.[1];
          const inside = target.startsWith(own);
          const sibling = other !== undefined && link.startsWith(`../../${other}/docs/`);
          expect(inside || sibling, `${page} -> ${link}`).toBe(true);
          if (sibling)
            expect(manifestOf(other ?? "")?.files, `${page} -> ${link}`).toContain("docs");
          expect(existsSync(new URL(target, ROOT)), `${page} -> ${link}`).toBe(true);
        }
        for (const raw of rawLinksOf(text)) {
          const hash = raw.indexOf("#");
          if (hash < 0) continue;
          const anchor = raw.slice(hash + 1);
          const targetPath =
            hash === 0
              ? page
              : posix.normalize(posix.join(posix.dirname(page), raw.slice(0, hash)));
          const targetUrl = new URL(targetPath, ROOT);
          if (!existsSync(targetUrl)) continue;
          const slugs = headingSlugs(readFileSync(targetUrl, "utf8"));
          expect(slugs.has(anchor), `${page} -> ${raw}`).toBe(true);
        }
      }
    },
  );

  it.each(DOC_PACKAGES)("%s: its README lists every page of its docs", (dir) => {
    const readme = `packages/${dir}/docs/README.md`;
    const text = readFileSync(new URL(readme, ROOT), "utf8");
    const allPages = markdownIn(join(PACKAGES, dir, "docs"));
    expect(allPages.filter((page) => page.endsWith(".intro.md"))).toEqual([]);
    const pages = allPages.filter((page) => page !== readme && !page.includes("/docs/reference/"));
    for (const page of pages) {
      const name = page.slice(`packages/${dir}/docs/`.length);
      expect(text, `${dir}: ${name}`).toContain(`(./${name})`);
    }
    if (existsSync(new URL(`packages/${dir}/docs/reference/README.md`, ROOT)))
      expect(text, dir).toContain("(./reference/README.md)");
  });

  it("names only npm scripts that exist", () => {
    const named = [...guide.matchAll(/npm run ([\w:-]+)/g)].map((match) => match[1] ?? "");
    for (const script of named) expect(Object.keys(manifest.scripts)).toContain(script);
  });

  it("names only gerak commands that exist", () => {
    const named = [...guide.matchAll(/npx gerak ([\w-]+)|`gerak ([\w-]+)/g)].map(
      (match) => match[1] ?? match[2] ?? "",
    );
    expect(named.length).toBeGreaterThan(0);
    for (const command of named) expect(Object.keys(COMMANDS)).toContain(command);
  });

  it("points only at paths that exist", () => {
    const paths = [...guide.matchAll(/`((?:apps|packages|<pieces>)\/[\w./-]+)`/g)].map(
      (match) => match[1],
    );
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths)
      if (!(path ?? "").includes("<"))
        expect(
          existsSync(new URL((path ?? "").replace(/^<pieces>\//, "apps/pieces/"), ROOT)),
          path,
        ).toBe(true);
  });

  it("names only package import paths a workspace package exports", () => {
    const declared = new Set(
      readdirSync(PACKAGES).flatMap((dir) => {
        const found = manifestOf(dir);
        if (found === undefined) return [];
        return Object.keys(found.exports ?? {}).map((subpath) =>
          subpath === "." ? found.name : `${found.name}/${subpath.slice(2)}`,
        );
      }),
    );
    const named = [...guide.matchAll(/["`](@gerak\/[\w/-]+)["`]/g)].map((match) => match[1] ?? "");
    expect(named.length).toBeGreaterThan(5);
    for (const path of named)
      if (!path.endsWith("/") && !path.includes("<")) expect(declared, path).toContain(path);
  });

  it("is where the agent rules, the skill and the user guide send a reader", () => {
    expect(readFileSync(new URL("AGENTS.md", ROOT), "utf8")).toContain(
      "packages/stage/docs/stage.md",
    );
    expect(readFileSync(new URL("AGENTS.md", ROOT), "utf8")).toContain(
      "packages/core/docs/core.md",
    );
    const index = readFileSync(new URL("docs/guide/README.md", ROOT), "utf8");
    for (const dir of DOC_PACKAGES)
      expect(index, dir).toContain(`../../packages/${dir}/docs/README.md`);
  });

  it("names no worked example's scene file, so a piece starts from its brief and not from a copy", () => {
    const read = [
      guide,
      readFileSync(new URL(".claude/skills/make-motion/SKILL.md", ROOT), "utf8"),
    ].join("\n");
    const examples = [
      "timing-scene",
      "catch-scene",
      "splash-scene",
      "card-scene",
      "pile-scene",
      "principles-scene",
      "principles3d-scene",
      "character3d-scene",
      "overlay3d-scene",
    ];
    expect(examples.filter((example) => read.includes(example))).toEqual([]);
  });

  it("names no source file of the demo app, a worked example's component or entry included", () => {
    const examples = [
      "timing",
      "catch",
      "splash",
      "card",
      "pile",
      "principles",
      "principles3d",
      "character3d",
      "overlay3d",
    ];
    const sources = new Set(
      examples.flatMap((name) => readdirSync(new URL(`apps/pieces/${name}/src`, ROOT))),
    );
    const read = [
      guide,
      readFileSync(new URL(".claude/skills/make-motion/SKILL.md", ROOT), "utf8"),
    ].join("\n");
    const named = [...read.matchAll(/[\w-]+\.tsx?\b/g)].map((match) => match[0]);
    expect(named.filter((file) => sources.has(file))).toEqual([]);
  });

  it("is what the make-motion skill sends an agent to, by links that resolve", () => {
    const skill = new URL(".claude/skills/make-motion/SKILL.md", ROOT);
    const text = readFileSync(skill, "utf8");
    expect(text).toMatch(/^---\r?\nname: make-motion\r?\ndescription: .+\r?\n---\r?\n/);
    const links = linksOf(text);
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) expect(existsSync(new URL(link, skill)), link).toBe(true);
    expect(dirname(fileURLToPath(skill))).toContain("make-motion");
  });
});
