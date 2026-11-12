import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

const ROOT = new URL("../../", import.meta.url);
const guide = [
  "docs/guide/live.md",
  "docs/guide/agent-motion.md",
  "docs/guide/agent-events.md",
  "docs/guide/agent-physics.md",
  "docs/guide/agent-rigs.md",
  "docs/guide/agent-principles.md",
  "docs/guide/agent-3d.md",
]
  .map((page) => readFileSync(new URL(page, ROOT), "utf8"))
  .join("\n");
const manifest: { readonly scripts: Readonly<Record<string, string>> } = JSON.parse(
  readFileSync(new URL("package.json", ROOT), "utf8"),
);

describe("agent guide", () => {
  it("names only npm scripts that exist", () => {
    const named = [...guide.matchAll(/npm run ([\w:-]+)|`(motion:[\w-]+)`/g)].map(
      (match) => match[1] ?? match[2] ?? "",
    );
    expect(named.length).toBeGreaterThan(0);
    for (const script of named) expect(Object.keys(manifest.scripts)).toContain(script);
  });

  it("points only at paths that exist", () => {
    const paths = [...guide.matchAll(/`((?:apps|packages)\/[\w./-]+)`/g)].map((match) => match[1]);
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) expect(existsSync(new URL(path ?? "", ROOT)), path).toBe(true);
  });

  it("names only package import paths a workspace package exports", () => {
    const declared = new Set(
      readdirSync(new URL("packages/", ROOT)).flatMap((dir) => {
        const path = new URL(`packages/${dir}/package.json`, ROOT);
        if (!existsSync(path)) return [];
        const manifest: {
          readonly name: string;
          readonly exports?: Readonly<Record<string, unknown>>;
        } = JSON.parse(readFileSync(path, "utf8"));
        return Object.keys(manifest.exports ?? {}).map((subpath) =>
          subpath === "." ? manifest.name : `${manifest.name}/${subpath.slice(2)}`,
        );
      }),
    );
    const named = [...guide.matchAll(/["`](@gerak\/[\w/-]+)["`]/g)].map((match) => match[1] ?? "");
    expect(named.length).toBeGreaterThan(5);
    for (const path of named)
      if (!path.endsWith("/") && !path.includes("<")) expect(declared, path).toContain(path);
  });

  it("stays reachable from the guide index and the agent rules", () => {
    const index = readFileSync(new URL("docs/guide/README.md", ROOT), "utf8");
    const core = readFileSync(new URL("docs/guide/agent-motion.md", ROOT), "utf8");
    for (const part of [
      "live",
      "agent-motion",
      "agent-events",
      "agent-physics",
      "agent-rigs",
      "agent-principles",
      "agent-3d",
    ])
      expect(index, part).toContain(`./${part}.md`);
    for (const part of [
      "agent-events",
      "agent-physics",
      "agent-rigs",
      "agent-principles",
      "agent-3d",
    ])
      expect(core, part).toContain(`./${part}.md`);
    expect(readFileSync(new URL("AGENTS.md", ROOT), "utf8")).toContain(
      "docs/guide/agent-motion.md",
    );
  });

  it("names no worked example's scene file, so a piece starts from its brief and not from a copy", () => {
    const read = [
      guide,
      readFileSync(new URL("docs/guide/agent-reference.md", ROOT), "utf8"),
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
    ];
    expect(examples.filter((example) => read.includes(example))).toEqual([]);
  });

  it("names no source file of the demo app, a worked example's component or entry included", () => {
    // Lists the folder's file names only; no source text is read.
    const sources = new Set(readdirSync(new URL("src", new URL("apps/examples/", ROOT))));
    const read = [
      guide,
      readFileSync(new URL("docs/guide/agent-reference.md", ROOT), "utf8"),
      readFileSync(new URL(".claude/skills/make-motion/SKILL.md", ROOT), "utf8"),
    ].join("\n");
    const named = [...read.matchAll(/[\w-]+\.tsx?\b/g)].map((match) => match[0]);
    expect(named.filter((file) => sources.has(file))).toEqual([]);
  });

  it("is what the make-motion skill sends an agent to, by a link that resolves", () => {
    const skill = new URL(".claude/skills/make-motion/SKILL.md", ROOT);
    const text = readFileSync(skill, "utf8");
    expect(text).toMatch(/^---\r?\nname: make-motion\r?\ndescription: .+\r?\n---\r?\n/);
    const link = /\]\((\.\.\/[^)]+agent-motion\.md)\)/.exec(text)?.[1] ?? "";
    expect(existsSync(new URL(link, skill)), link).toBe(true);
  });
});
