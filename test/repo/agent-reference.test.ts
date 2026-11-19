import { readdirSync, readFileSync } from "node:fs";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { moveParts } from "@gerak/moves-tools";
import { COMMANDS as TOOLS_COMMANDS } from "../../packages/tools/bin/commands.mjs";
import { COMMANDS as LIBRARY_COMMANDS } from "../../packages/moves-tools/bin/commands.mjs";
import { PACKAGES } from "../../scripts/reference.mjs";

const ROOT = new URL("../../", import.meta.url);
const coreCommands = readFileSync(new URL("packages/tools/docs/commands.md", ROOT), "utf8");
const libraryCommands = readFileSync(
  new URL("packages/moves-tools/docs/commands.md", ROOT),
  "utf8",
);
const MAX_READ_WHOLE_BYTES = 20 * 1024;

/** A package's generated reference pages, joined. */
function referenceOf(dir: string): string {
  const folder = new URL(`packages/${dir}/docs/reference/`, ROOT);
  return readdirSync(folder)
    .map((name) => readFileSync(new URL(name, folder), "utf8"))
    .join("\n");
}

function entryLine(name: string): string {
  return `**\`${name}\`**`;
}

/** Every name a package's entry exports, read by the compiler as a caller sees them. */
function exportsOf(names: readonly string[]): ReadonlyMap<string, readonly string[]> {
  const files = names.map((name) =>
    new URL(`packages/${name}`, ROOT).pathname.replace(/^\/(\w:)/, "$1"),
  );
  const program = ts.createProgram(files, {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
    skipLibCheck: true,
    noEmit: true,
  });
  const checker = program.getTypeChecker();
  return new Map(
    names.map((name, index) => {
      const source = program.getSourceFile(files[index] ?? "");
      const module = source === undefined ? undefined : checker.getSymbolAtLocation(source);
      return [
        name,
        module === undefined
          ? []
          : checker.getExportsOfModule(module).map(({ name: exported }) => exported),
      ];
    }),
  );
}

describe("agent reference", () => {
  it("names every export of every package a scene can use, so no agent reads source to find one", () => {
    const missing: string[] = [];
    const all = PACKAGES.flatMap(({ dir, entries }) =>
      entries.map((entry) => ({ dir, name: `${dir}/${entry}` })),
    );
    const exported = exportsOf(all.map(({ name }) => name));
    const references = new Map(PACKAGES.map(({ dir }) => [dir, referenceOf(dir)]));
    for (const { dir, name } of all) {
      const symbols = exported.get(name) ?? [];
      expect(symbols.length, `${name} exports nothing the compiler can see`).toBeGreaterThan(0);
      for (const symbol of symbols)
        if (!references.get(dir)?.includes(entryLine(symbol))) missing.push(`${name}: ${symbol}`);
    }
    expect(missing).toEqual([]);
  });

  it("writes every signature of a reference page in full: none cut short, no type left as a bare name", () => {
    const cut: string[] = [];
    for (const { dir } of PACKAGES) {
      for (const line of referenceOf(dir).split("\n")) {
        const written = /^- \*\*`([^`]+)`\*\* `([^`]*)`/.exec(line);
        if (written === null) continue;
        const [, name, signature = ""] = written;
        if (signature.endsWith("…") || new RegExp(`^type ${name}(?:<[^=>]*>)?$`).test(signature))
          cut.push(`${dir}: ${name}`);
      }
    }
    expect(cut).toEqual([]);
  });

  it("keeps type aliases named in signatures and own parameters on type heads", () => {
    const leakedHeads: string[] = [];
    for (const { dir } of PACKAGES) {
      for (const line of referenceOf(dir).split("\n")) {
        const written = /^- \*\*`([^`]+)`\*\* `([^`]*)`/.exec(line);
        if (written === null) continue;
        const [, name, signature = ""] = written;
        if (/^type \w+<[^>]*[<{\[]/.test(signature)) leakedHeads.push(`${dir}: ${name}`);
      }
    }
    expect(leakedHeads).toEqual([]);

    const core = referenceOf("core");
    expect(core).toContain(
      "**`lift2d`** `(pose: Pose2d, options: { readonly unitsPerPx: number; }): Pose3d`",
    );
    expect(core).toContain("**`UNTIMED`** `const UNTIMED: Clock`");
    expect(core).toContain("**`Point2d`** `type Point2d = { x: number; y: number }`");
    expect(core).toContain("**`Point3d`** `type Point3d = { x: number; y: number; z: number }`");
    expect(core).toContain("**`mixPoint`** `(from: Point2d, to: Point2d, share: number): Point2d`");
    expect(core).toContain(
      "**`mixPoint3d`** `(from: Point3d, to: Point3d, share: number): Point3d`",
    );
    expect(core).toContain("**`Lens3d`** `type Lens3d = Pose3d & { readonly fov: number; }`");
    expect(core).not.toContain("Point3`");
    const rigThree = referenceOf("rig-three");
    expect(rigThree).toContain("restPosition: Readonly<Vector3>");
    expect(rigThree).not.toContain("isVector3: true");

    const three = referenceOf("three");
    expect(three).toContain("**`applyPose2d`** `(object: Object3D, pose: Pose2d, rest?: Point2d");
    expect(three).toContain("**`applyPose3d`** `(object: Object3D, pose: Pose3d, rest?: Point3d");
    expect(referenceOf("dom")).toContain(
      "emit: (name: string, target?: string, point?: Point2d) => void",
    );
    expect(referenceOf("rig")).toContain(
      "posedJoints3d`** `<const Table extends JointTable3d>(table: Table, bones: Readonly<Partial<Record<string, BonePose3d>>>, root?: BonePose3d): Readonly<Record<keyof Table & string, Point3d>>`",
    );
    expect(referenceOf("physics")).toContain("readonly from: Point2d; readonly to: Point2d");

    const moves = referenceOf("moves");
    expect(moves).toContain("**`drop`** `(options, time)`:");
    expect(moves).toContain("**`fade`** `(options, time)`:");
    expect(moves).toContain("**`anticipate`** `(options, time, input: (time: Time) => Pose2d)`:");
    expect(moves).toContain(
      "**`rope`** `(options, time, input: { readonly points: readonly (Point2d & { readonly id?: string; })[]; })`:",
    );
  });

  it("names in its parts list only exports of @gerak/moves, each one named in its reference", () => {
    const exported = new Set(exportsOf(["moves/src/index.ts"]).get("moves/src/index.ts"));
    const reference = referenceOf("moves");
    const names = moveParts().map(({ name }) => name);
    expect(new Set(names).size).toBe(names.length);
    expect(names.filter((name) => !exported.has(name))).toEqual([]);
    expect(names.filter((name) => !reference.includes(entryLine(name)))).toEqual([]);
  });

  it("names every gerak command", () => {
    const missingCore = Object.keys(TOOLS_COMMANDS).filter(
      (name) => !coreCommands.includes(`\`gerak ${name}`),
    );
    const missingLibrary = Object.keys(LIBRARY_COMMANDS).filter(
      (name) => !libraryCommands.includes(`\`gerak ${name}`),
    );
    expect([...missingCore, ...missingLibrary]).toEqual([]);
  });

  it("lists every reference page of a package in that package's reference README", () => {
    for (const { dir } of PACKAGES) {
      const folder = new URL(`packages/${dir}/docs/reference/`, ROOT);
      const readme = readFileSync(new URL("README.md", folder), "utf8");
      const pages = readdirSync(folder).filter((name) => name !== "README.md");
      expect(pages.length, dir).toBeGreaterThan(0);
      for (const page of pages) expect(readme, `${dir}/${page}`).toContain(`(./${page})`);
    }
  });

  it("names core's groups in the order a reader needs them", () => {
    const readme = readFileSync(new URL("packages/core/docs/reference/README.md", ROOT), "utf8");
    const order = [...readme.matchAll(/\[(\w+)\]\(\.\//g)].map((match) => match[1]);
    expect(order).toEqual([
      "fields",
      "time",
      "blend",
      "ease",
      "envelope",
      "geometry",
      "path",
      "measure",
      "events",
      "utility",
      "principles",
      "state",
    ]);
  });

  it.each(["core", "stage"])(
    "%s.md is held to 20 KB and names every export of its package",
    (dir) => {
      const page = readFileSync(new URL(`packages/${dir}/docs/${dir}.md`, ROOT), "utf8");
      expect(Buffer.byteLength(page)).toBeLessThanOrEqual(MAX_READ_WHOLE_BYTES);
      const entry = `${dir}/src/index.ts`;
      const exported = exportsOf([entry]).get(entry) ?? [];
      expect(exported.length).toBeGreaterThan(0);
      expect(exported.filter((name) => !page.includes("`" + name + "`"))).toEqual([]);
    },
  );

  it("keeps core.md and stage.md compact without repeating per-export reference entries", () => {
    const core = readFileSync(new URL("packages/core/docs/core.md", ROOT), "utf8");
    expect(Buffer.byteLength(core)).toBeLessThanOrEqual(8 * 1024);
    expect(core).not.toMatch(/^- \*\*`[^`]+`\*\*/m);
    for (const page of readdirSync(new URL("packages/core/docs/reference/", ROOT))) {
      if (page !== "README.md") expect(core).toContain(`./reference/${page}`);
    }

    const stage = readFileSync(new URL("packages/stage/docs/stage.md", ROOT), "utf8");
    expect(Buffer.byteLength(stage)).toBeLessThanOrEqual(10_500);
    expect(stage).not.toMatch(/^- \*\*`[^`]+`\*\*/m);
    for (const page of readdirSync(new URL("packages/stage/docs/reference/", ROOT))) {
      if (page !== "README.md") expect(stage).toContain(`./reference/${page}`);
    }
    const domExports = exportsOf(["stage/src/dom/index.ts"]).get("stage/src/dom/index.ts") ?? [];
    expect(domExports.length).toBeGreaterThan(0);
    expect(domExports.filter((name) => !stage.includes("`" + name + "`"))).toEqual([]);
  });

  it("documents every type named in reference/author.md signatures in a stage reference page", () => {
    const builtins = new Set(["Readonly", "Record", "Extract", "Exclude", "NoInfer", "URL"]);
    const author = readFileSync(new URL("packages/stage/docs/reference/author.md", ROOT), "utf8");
    const stageRef = referenceOf("stage");
    const coreRef = referenceOf("core");
    const missing: string[] = [];
    for (const line of author.split("\n")) {
      const written = /^- \*\*`([^`]+)`\*\* `([^`]*)`/.exec(line);
      if (written === null) continue;
      const [, name, signature = ""] = written;
      for (const match of signature.matchAll(/\b([A-Z]\w+)\b/g)) {
        const type = match[1] ?? "";
        if (
          builtins.has(type) ||
          stageRef.includes(entryLine(type)) ||
          coreRef.includes(entryLine(type))
        )
          continue;
        missing.push(`${name}: ${type}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
