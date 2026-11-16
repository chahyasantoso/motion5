import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { guideFiles, pageFiles } from "@gerak/tools/scene";

const REPO = fileURLToPath(new URL("../../../", import.meta.url));
const INIT = fileURLToPath(new URL("../bin/motion-init.mjs", import.meta.url));
const SKILL = ".claude/skills/make-motion/SKILL.md";
const scratch: string[] = [];

function project(manifest: string | undefined): string {
  const dir = mkdtempSync(join(tmpdir(), "gerak-init-"));
  scratch.push(dir);
  if (manifest !== undefined) writeFileSync(join(dir, "package.json"), manifest);
  return dir;
}

function init(caller: string, args: string[] = []) {
  const before = process.env.INIT_CWD;
  process.env.INIT_CWD = caller;
  try {
    const run = spawnSync(process.execPath, [INIT, ...args], {
      cwd: tmpdir(),
      encoding: "utf8",
      env: process.env,
    });
    const result: { kind: string; files?: string[]; message?: string } = JSON.parse(
      run.stdout.trim().split(/\r?\n/).pop() ?? "{}",
    );
    return { code: run.status, result, err: run.stderr };
  } finally {
    if (before === undefined) delete process.env.INIT_CWD;
    else process.env.INIT_CWD = before;
  }
}

function snapshot(dir: string): string[] {
  const out: string[] = [];
  const visit = (path: string) => {
    for (const name of ["package.json", "AGENTS.md", ".claude", "pieces"]) {
      const full = join(path, name);
      if (existsSync(full)) out.push(full);
    }
  };
  visit(dir);
  return out;
}

afterEach(() => {
  for (const dir of scratch.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("gerak init", () => {
  it("writes the pages, the skill, AGENTS.md and the package.json entry, keeping the keys", () => {
    const dir = project('{ "name": "mine", "version": "1.0.0", "dependencies": { "a": "1" } }');
    const { code, result } = init(dir);
    expect(code).toBe(0);
    expect(result.kind).toBe("written");
    for (const name of Object.keys(pageFiles()))
      expect(readFileSync(join(dir, "pieces", name), "utf8")).toBe(pageFiles()[name]);
    expect(existsSync(join(dir, SKILL))).toBe(true);
    const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
    expect(agents).toContain("node_modules/@gerak/tools/guide/agent-motion.md");
    expect(agents).toContain("pieces");
    const text = readFileSync(join(dir, "package.json"), "utf8");
    expect(text.endsWith("}\n")).toBe(true);
    const parsed = JSON.parse(text);
    expect(Object.keys(parsed)).toEqual(["name", "version", "dependencies", "gerak"]);
    expect(parsed.gerak).toEqual({ pieces: "pieces" });
    expect(parsed.dependencies).toEqual({ a: "1" });
  });

  it("takes the folder from its argument, relative to where it was run", () => {
    const dir = project("{}");
    mkdirSync(join(dir, "web"));
    const { result } = init(join(dir, "web"), ["motion"]);
    expect(result.kind).toBe("written");
    expect(existsSync(join(dir, "web", "motion", "stage.ts"))).toBe(true);
    expect(JSON.parse(readFileSync(join(dir, "package.json"), "utf8")).gerak.pieces).toBe(
      "web/motion",
    );
  });

  it("refuses a second run, naming the files, and writes nothing", () => {
    const dir = project("{}");
    init(dir);
    const before = readFileSync(join(dir, "package.json"), "utf8");
    const { code, result } = init(dir);
    expect(code).toBe(1);
    expect(result.kind).toBe("refused");
    for (const name of ["pieces/stage.ts", SKILL, "AGENTS.md", "gerak.pieces"])
      expect(result.message, name).toContain(name);
    expect(readFileSync(join(dir, "package.json"), "utf8")).toBe(before);
  });

  it("refuses a project that already has an AGENTS.md and writes nothing", () => {
    const dir = project("{}");
    writeFileSync(join(dir, "AGENTS.md"), "mine\n");
    const { code, result } = init(dir);
    expect(code).toBe(1);
    expect(result.message).toContain("AGENTS.md");
    expect(readFileSync(join(dir, "AGENTS.md"), "utf8")).toBe("mine\n");
    expect(existsSync(join(dir, "pieces"))).toBe(false);
    expect(existsSync(join(dir, ".claude"))).toBe(false);
    expect(readFileSync(join(dir, "package.json"), "utf8")).toBe("{}");
  });

  it("refuses with no package.json", () => {
    const dir = project(undefined);
    const { code, result } = init(dir);
    expect(code).toBe(1);
    expect(result).toEqual({
      kind: "refused",
      message: "No package.json: run gerak init inside your project.",
    });
    expect(snapshot(dir)).toEqual([]);
  });

  it("rewrites only the page files with --refresh", () => {
    const dir = project("{}");
    init(dir);
    mkdirSync(join(dir, "pieces", "demo"), { recursive: true });
    writeFileSync(join(dir, "pieces", "demo", "brief.md"), "brief\n");
    writeFileSync(join(dir, "pieces", "stage.ts"), "changed\n");
    writeFileSync(join(dir, "AGENTS.md"), "edited\n");
    writeFileSync(join(dir, SKILL), "edited skill\n");
    const { code, result } = init(dir, ["--refresh"]);
    expect(code).toBe(0);
    expect(result.kind).toBe("written");
    expect(readFileSync(join(dir, "pieces", "stage.ts"), "utf8")).toBe(pageFiles()["stage.ts"]);
    expect(readFileSync(join(dir, "AGENTS.md"), "utf8")).toBe("edited\n");
    expect(readFileSync(join(dir, SKILL), "utf8")).toBe("edited skill\n");
    expect(readFileSync(join(dir, "pieces", "demo", "brief.md"), "utf8")).toBe("brief\n");
  });

  it("writes a skill whose links name files of the shipped guide", () => {
    const dir = project("{}");
    init(dir);
    const skill = readFileSync(join(dir, SKILL), "utf8");
    const links = [...skill.matchAll(/\]\(([^)\s]+)\)/g)].map((match) => match[1] ?? "");
    const guided = links.filter((link) => link.includes("@gerak/tools/guide/"));
    expect(guided.length).toBeGreaterThan(0);
    const prefix = "../../../node_modules/@gerak/tools/guide/";
    const names = Object.keys(guideFiles(REPO));
    for (const link of guided) {
      expect(link.startsWith(prefix), link).toBe(true);
      expect(names, link).toContain(link.slice(prefix.length).replace(/#.*$/, ""));
      expect(resolve(dirname(join(dir, SKILL)), link)).toBe(
        resolve(
          dir,
          "node_modules/@gerak/tools/guide",
          link.slice(prefix.length).replace(/#.*$/, ""),
        ),
      );
    }
  });
});
