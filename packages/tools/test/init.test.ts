import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { initProject, pageFiles, shippedSkill, type InstalledPackage } from "@gerak/tools/scene";

const INIT = fileURLToPath(new URL("../bin/motion-init.mjs", import.meta.url));
const SKILL = ".claude/skills/make-motion/SKILL.md";
const scratch: string[] = [];

function project(manifest: string | undefined): string {
  const dir = mkdtempSync(join(tmpdir(), "gerak-init-"));
  scratch.push(dir);
  if (manifest !== undefined) writeFileSync(join(dir, "package.json"), manifest);
  return dir;
}

/** An installed package whose folder holds a docs index when `docs` is true. */
function package_(name: string, docs: boolean): InstalledPackage {
  const folder = mkdtempSync(join(tmpdir(), "gerak-pkg-"));
  scratch.push(folder);
  if (docs) {
    mkdirSync(join(folder, "docs"));
    writeFileSync(join(folder, "docs", "README.md"), "index\n");
  }
  return { name: `@gerak/${name}`, folder };
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
    for (const name of ["package.json", "AGENTS.md", "tsconfig.json", ".claude", "pieces"]) {
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
  it("writes the pages, the skill, AGENTS.md, tsconfig.json and the package.json entry, keeping the keys", () => {
    const dir = project('{ "name": "mine", "version": "1.0.0", "dependencies": { "a": "1" } }');
    const { code, result } = init(dir);
    expect(code).toBe(0);
    expect(result.kind).toBe("written");
    for (const name of Object.keys(pageFiles()))
      expect(readFileSync(join(dir, "pieces", name), "utf8")).toBe(pageFiles()[name]);
    expect(existsSync(join(dir, SKILL))).toBe(true);
    const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
    expect(agents).toContain("node_modules/@gerak/core/docs/core.md");
    expect(agents).toContain("node_modules/@gerak/stage/docs/stage.md");
    expect(agents).toContain("pieces");
    expect(JSON.parse(readFileSync(join(dir, "tsconfig.json"), "utf8"))).toEqual({
      compilerOptions: {
        target: "ES2022",
        module: "ESNext",
        moduleResolution: "Bundler",
        lib: ["ES2022", "DOM"],
        jsx: "react-jsx",
        strict: true,
        noEmit: true,
        skipLibCheck: true,
      },
      include: ["pieces/*/src"],
    });
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
    expect(JSON.parse(readFileSync(join(dir, "tsconfig.json"), "utf8")).include).toEqual([
      "web/motion/*/src",
    ]);
  });

  it("refuses a second run, naming the files, and writes nothing", () => {
    const dir = project("{}");
    init(dir);
    const before = readFileSync(join(dir, "package.json"), "utf8");
    const { code, result } = init(dir);
    expect(code).toBe(1);
    expect(result.kind).toBe("refused");
    for (const name of ["pieces/stage.ts", SKILL, "AGENTS.md", "tsconfig.json", "gerak.pieces"])
      expect(result.message, name).toContain(name);
    expect(readFileSync(join(dir, "package.json"), "utf8")).toBe(before);
  });

  it("refuses a project that already has an AGENTS.md or tsconfig.json and writes nothing", () => {
    for (const [file, content] of [
      ["AGENTS.md", "mine\n"],
      ["tsconfig.json", '{"compilerOptions":{}}\n'],
    ] as const) {
      const dir = project("{}");
      writeFileSync(join(dir, file), content);
      const { code, result } = init(dir);
      expect(code, file).toBe(1);
      expect(result.message, file).toContain(file);
      expect(readFileSync(join(dir, file), "utf8")).toBe(content);
      expect(existsSync(join(dir, "pieces"))).toBe(false);
      expect(existsSync(join(dir, ".claude"))).toBe(false);
      expect(readFileSync(join(dir, "package.json"), "utf8")).toBe("{}");
    }
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
    writeFileSync(join(dir, "tsconfig.json"), '{"edited":true}\n');
    writeFileSync(join(dir, SKILL), "edited skill\n");
    const { code, result } = init(dir, ["--refresh"]);
    expect(code).toBe(0);
    expect(result.kind).toBe("written");
    expect(readFileSync(join(dir, "pieces", "stage.ts"), "utf8")).toBe(pageFiles()["stage.ts"]);
    expect(readFileSync(join(dir, "AGENTS.md"), "utf8")).toBe("edited\n");
    expect(readFileSync(join(dir, "tsconfig.json"), "utf8")).toBe('{"edited":true}\n');
    expect(readFileSync(join(dir, SKILL), "utf8")).toBe("edited skill\n");
    expect(readFileSync(join(dir, "pieces", "demo", "brief.md"), "utf8")).toBe("brief\n");
  });

  it("writes a skill whose links name the read-whole pages under node_modules", () => {
    const dir = project("{}");
    init(dir);
    const skill = readFileSync(join(dir, SKILL), "utf8");
    const links = [...skill.matchAll(/\]\(([^)\s]+)\)/g)].map((match) => match[1] ?? "");
    expect(links).toEqual([
      "../../../node_modules/@gerak/core/docs/core.md",
      "../../../node_modules/@gerak/stage/docs/stage.md",
    ]);
  });

  it("names the two read-whole pages and nothing else with only the core packages installed", () => {
    const dir = project("{}");
    const installed = [package_("core", true), package_("stage", true), package_("tools", false)];
    const result = initProject(dir, "pieces", shippedSkill(), installed);
    expect(result.kind).toBe("written");
    const lines = readFileSync(join(dir, "AGENTS.md"), "utf8")
      .split("\n")
      .filter((line) => line.includes("node_modules"));
    expect(lines).toEqual([
      "- Read `node_modules/@gerak/core/docs/core.md` whole before making motion.",
      "- Read `node_modules/@gerak/stage/docs/stage.md` whole before making motion.",
    ]);
  });

  it("adds one line for each installed module or library package that has docs", () => {
    const dir = project("{}");
    const installed = [
      package_("core", true),
      package_("stage", true),
      package_("rig", true),
      package_("moves", true),
      package_("rapier", false),
    ];
    initProject(dir, "pieces", shippedSkill(), installed);
    const agents = readFileSync(join(dir, "AGENTS.md"), "utf8");
    expect(agents).toContain("`node_modules/@gerak/rig/docs/README.md`");
    expect(agents).toContain("`node_modules/@gerak/moves/docs/README.md`");
    expect(agents).not.toContain("rapier");
    expect(agents).not.toContain("core/docs/README.md");
  });

  it("refuses a gerak entry that is not an object, and a package.json that is not JSON, writing nothing", () => {
    for (const manifest of ['{ "gerak": ["q"] }', '{ "gerak": "x" }', "{bad"]) {
      const dir = project(manifest);
      const { code, result } = init(dir);
      expect(code, manifest).toBe(1);
      expect(result.kind).toBe("refused");
      expect(readFileSync(join(dir, "package.json"), "utf8")).toBe(manifest);
      expect(existsSync(join(dir, "AGENTS.md"))).toBe(false);
    }
  });

  it("takes a folder whose name starts with two dots, and refuses a folder that is a file", () => {
    const dots = project("{}");
    expect(init(dots, ["..motion"]).result.kind).toBe("written");
    expect(existsSync(join(dots, "..motion", "stage.html"))).toBe(true);
    const file = project("{}");
    writeFileSync(join(file, "pieces"), "");
    const { result } = init(file);
    expect(result.kind).toBe("refused");
    expect(existsSync(join(file, "AGENTS.md"))).toBe(false);
  });
});
