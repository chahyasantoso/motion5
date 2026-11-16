import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { mix, type Pose2d } from "@gerak/core";
import { defineMove, QUALITIES } from "@gerak/moves";
import {
  collectRecords,
  parseCatalogArgs,
  promoteMove,
  query,
  runCatalog,
  type CatalogArgs,
  type MoveRecord,
} from "@gerak/tools/scene";

const roots: string[] = [];
afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const ENTER = (id: string, name: string, end = "") => `import { type Pose2d } from "@gerak/core";
import { defineMove } from "@gerak/moves";
export const ${name} = defineMove({
  id: "${id}",
  role: "enter",
  description: "Slides in from the left. Then it stops.",
  options: { distance: { kind: "number", min: 0, max: 500, default: 100, description: "Start offset, in px." } },
  example: { options: { distance: 100 } },
  moments: () => ({ arrive: 1 }),
  run: ({ distance }, { progress }): Pose2d => ({ x: -distance * (1 - progress) ** 0.3${end} }),
});
`;

/** A move from a package, written as plain JavaScript so it needs nothing resolved from the scratch root. */
const PLAIN = (
  id: string,
  name: string,
) => `const move = (options, time) => ({ x: -100 * (1 - time.progress) ** 0.3 });
export const ${name} = Object.assign(move, {
  id: "${id}",
  role: "enter",
  description: "Comes in from the left.",
  options: {},
  example: { options: {} },
  moments: () => ({}),
});
`;

function scratch(config?: object): string {
  const root = mkdtempSync(join(tmpdir(), "catalog-sources-"));
  roots.push(root);
  if (config !== undefined)
    writeFileSync(join(root, "package.json"), JSON.stringify({ gerak: config }));
  return root;
}

function folderMove(root: string, brief: string, file: string, text: string): void {
  mkdirSync(join(root, brief, "src", "moves"), { recursive: true });
  writeFileSync(join(root, brief, "src", "moves", file), text);
}

function packageMove(root: string, name: string, version: string, body: string): void {
  const dir = join(root, "node_modules", name);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify({ name, version, type: "module", main: "index.js" }),
  );
  writeFileSync(join(dir, "index.js"), body);
}

/** A root with one move from a package and one from each of two briefs, none sharing an id order with its source. */
function library(): string {
  const root = scratch({ moves: ["lib-moves", "./*/src/moves"] });
  packageMove(root, "lib-moves", "1.0.0", PLAIN("bounce-m", "bounceM"));
  folderMove(root, "reel", "z.ts", ENTER("bounce-z", "bounceZ"));
  folderMove(root, "title", "a.ts", ENTER("bounce-a", "bounceA"));
  return root;
}

function ok(argv: readonly string[]): Extract<CatalogArgs, { kind: "ok" }> {
  const args = parseCatalogArgs(argv);
  if (args.kind !== "ok") throw new Error(args.message);
  return args;
}

const idsOf = (lines: readonly string[]): readonly (string | undefined)[] =>
  lines.map((line) => line.split(" | ")[0]);

describe("the sources of moves", () => {
  it("reads the default list when the root declares none: the library and every brief's moves folder", async () => {
    const root = scratch();
    folderMove(root, "reel", "x.ts", ENTER("slide-x", "slideX"));
    const run = await runCatalog(ok(["--json"]), root);
    expect(JSON.parse(run.lines.join("\n"))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "drop", source: "@gerak/moves" }),
        expect.objectContaining({ id: "slide-x", source: "reel" }),
      ]),
    );
  });

  it("finds a package source and a folder source from the root's list and tags each", async () => {
    const root = library();
    const run = await runCatalog(ok(["--json"]), root);
    expect(JSON.parse(run.lines.join("\n"))).toMatchObject([
      { id: "bounce-a", source: "title" },
      { id: "bounce-m", source: "lib-moves" },
      { id: "bounce-z", source: "reel" },
    ]);
    expect(run.code).toBe(0);
  });

  it("leaves the library out when the list does not name it", async () => {
    const root = scratch({ moves: ["./*/src/moves"] });
    folderMove(root, "reel", "x.ts", ENTER("slide-x", "slideX"));
    const run = await runCatalog(ok(["--all"]), root);
    expect(idsOf(run.lines)).toEqual(["slide-x"]);
  });

  it("shows two sources that share an id as source/id, and asks which when the id is asked for", async () => {
    const root = library();
    folderMove(root, "reel", "m.ts", ENTER("bounce-m", "again"));
    const listed = await runCatalog(ok(["--all", "--find", "bounce-m"]), root);
    expect(idsOf(listed.lines)).toEqual(["lib-moves/bounce-m", "reel/bounce-m"]);
    const asked = await runCatalog(ok(["bounce-m"]), root);
    expect(asked.code).toBe(1);
    expect(asked.lines.join("\n")).toContain("lib-moves/bounce-m");
    expect(asked.lines.join("\n")).toContain("reel/bounce-m");
    const chosen = await runCatalog(ok(["reel/bounce-m"]), root);
    expect(chosen.code).toBe(0);
    expect(chosen.lines[0]).toContain("bounce-m");
  });
});

describe("promoteTo", () => {
  const setup = () => {
    const base = mkdtempSync(join(tmpdir(), "catalog-promote-"));
    roots.push(base);
    const root = join(base, "app");
    mkdirSync(root);
    folderMove(root, "reel", "x.ts", ENTER("zig", "zig", " * 0.5"));
    mkdirSync(join(root, "title", "src"), { recursive: true });
    writeFileSync(
      join(root, "reel", "src", "one.ts"),
      `import { zig } from "./moves/x";\nexport const a = zig;\n`,
    );
    writeFileSync(
      join(root, "title", "src", "two.ts"),
      `import { zig } from "../../reel/src/moves/x";\nexport const b = zig;\n`,
    );
    const library = join(base, "moves");
    mkdirSync(library);
    cpSync(join(process.cwd(), "packages", "moves", "src"), join(library, "src"), {
      recursive: true,
    });
    return { root, library };
  };

  it("refuses, naming the setting, when the root declares no promoteTo", async () => {
    const { root, library } = setup();
    const run = await promoteMove("zig", root);
    expect(run.code).toBe(1);
    expect(run.lines.join(" ")).toContain("promoteTo");
    expect(existsSync(join(library, "src", "moves", "x.ts"))).toBe(false);
  });

  it("writes into the folder the root names", async () => {
    const { root, library } = setup();
    writeFileSync(
      join(root, "package.json"),
      JSON.stringify({ gerak: { promoteTo: "../moves/src/moves" } }),
    );
    const run = await promoteMove("zig", root);
    expect(run.lines[0]).toContain("moved ");
    expect(run.code).toBe(0);
    expect(existsSync(join(library, "src", "moves", "x.ts"))).toBe(true);
    expect(readFileSync(join(library, "src", "index.ts"), "utf8")).toContain("./moves/x");
  });
});

describe("the index", () => {
  const counting = () => {
    const sampled: string[] = [];
    const sampler = (move: Parameters<typeof import("../src/scene/moves").descriptorsOf>[0]) => {
      sampled.push(move.id);
      return { fields: ["x"], primary: "x", descriptors: undefined, shapes: {}, shapesAt: [] };
    };
    return { sampled, sampler };
  };
  const index = (root: string) => join(root, "node_modules", ".cache", "gerak", "moves.json");

  it("samples each move once, and a second run samples nothing", async () => {
    const root = library();
    const { sampled, sampler } = counting();
    await runCatalog(ok([]), root, { sampler });
    expect(sampled.sort()).toEqual(["bounce-a", "bounce-m", "bounce-z"]);
    expect(existsSync(index(root))).toBe(true);
    sampled.length = 0;
    const again = await runCatalog(ok(["--all"]), root, { sampler });
    expect(sampled).toEqual([]);
    expect(idsOf(again.lines)).toEqual(["bounce-a", "bounce-m", "bounce-z"]);
  });

  it("samples again only the move whose file changed", async () => {
    const root = library();
    const { sampled, sampler } = counting();
    await runCatalog(ok([]), root, { sampler });
    sampled.length = 0;
    folderMove(root, "title", "a.ts", ENTER("bounce-a", "bounceA", " * 0.5"));
    await runCatalog(ok([]), root, { sampler });
    expect(sampled).toEqual(["bounce-a"]);
  });

  it("samples a package's moves again when its version changes", async () => {
    const root = library();
    const { sampled, sampler } = counting();
    await runCatalog(ok([]), root, { sampler });
    sampled.length = 0;
    packageMove(root, "lib-moves", "1.1.0", PLAIN("bounce-m", "bounceM"));
    await runCatalog(ok([]), root, { sampler });
    expect(sampled).toEqual(["bounce-m"]);
  });

  it("samples every move again when the code that measures moves changes", async () => {
    const root = library();
    const { sampled, sampler } = counting();
    await runCatalog(ok([]), root, { sampler, engine: "parts as they were" });
    sampled.length = 0;
    await runCatalog(ok([]), root, { sampler, engine: "parts as they were" });
    expect(sampled).toEqual([]);
    await runCatalog(ok([]), root, { sampler, engine: "a part changed" });
    expect(sampled.sort()).toEqual(["bounce-a", "bounce-m", "bounce-z"]);
  });

  it("samples a move again when a helper beside it changes", async () => {
    const root = library();
    const helper = join(root, "title", "src", "moves", "helper.ts");
    writeFileSync(helper, "export const lean = 2;\n");
    const { sampled, sampler } = counting();
    await runCatalog(ok([]), root, { sampler });
    sampled.length = 0;
    writeFileSync(helper, "export const lean = 3;\n");
    await runCatalog(ok([]), root, { sampler });
    expect(sampled).toEqual(["bounce-a"]);
  });

  it("rebuilds an index that is missing or unreadable", async () => {
    const root = library();
    const { sampled, sampler } = counting();
    await runCatalog(ok([]), root, { sampler });
    rmSync(index(root));
    sampled.length = 0;
    await runCatalog(ok([]), root, { sampler });
    expect(sampled).toHaveLength(3);
    expect(existsSync(index(root))).toBe(true);
    writeFileSync(index(root), "{ not json");
    sampled.length = 0;
    await runCatalog(ok([]), root, { sampler });
    expect(sampled).toHaveLength(3);
    expect(JSON.parse(readFileSync(index(root), "utf8"))).toBeTypeOf("object");
  });
});

describe("one search", () => {
  const allIds = ["bounce-a", "bounce-m", "bounce-z"];
  const flags: readonly (readonly string[])[] = [
    ["--role", "enter"],
    ["--find", "BOUNCE"],
    ["--fields", "x"],
    ["--like", "heavy"],
  ];

  it.each(flags)(
    "%s finds the library-like, own and other-brief moves, in id order",
    async (...argv) => {
      const run = await runCatalog(ok([...argv, "--in", "reel"]), library());
      expect(idsOf(run.lines)).toEqual(allIds);
    },
  );

  it("finds the others near, and the ones farthest from, a move, in id order", async () => {
    const root = library();
    expect(idsOf((await runCatalog(ok(["--near", "bounce-m"]), root)).lines)).toEqual([
      "bounce-a",
      "bounce-z",
    ]);
    expect(idsOf((await runCatalog(ok(["--far", "bounce-z"]), root)).lines)).toEqual([
      "bounce-a",
      "bounce-m",
    ]);
  });

  it("tags the brief named by --in as own, and gives an import that resolves from that brief", async () => {
    const root = library();
    const run = await runCatalog(ok(["--in", "reel", "--role", "enter"]), root);
    const row = (id: string) => run.lines.find((line) => line.startsWith(`${id} |`)) ?? "";
    expect(row("bounce-z")).toContain("| own |");
    expect(row("bounce-a")).toContain("| title |");
    expect(row("bounce-m")).toContain("| lib-moves |");
    expect(row("bounce-m")).toContain('import { bounceM } from "lib-moves"');
    expect(row("bounce-z")).toContain('import { bounceZ } from "./moves/z"');
    const other = /from "(\.\.[^"]+)"/.exec(row("bounce-a"))?.[1] ?? "";
    expect(other).toBe("../../title/src/moves/a");
    expect(existsSync(`${resolve(root, "reel", "src", other)}.ts`)).toBe(true);
    const own = /from "(\.[^"]+)"/.exec(row("bounce-z"))?.[1] ?? "";
    expect(existsSync(`${resolve(root, "reel", "src", own)}.ts`)).toBe(true);
  });

  it("prints id, source, role, fields moved, the first sentence and the import on a row", async () => {
    const run = await runCatalog(ok(["--role", "enter"]), library());
    expect(run.lines).toContain(
      'bounce-z | reel | enter | x | passes | Slides in from the left. | import { bounceZ } from "./reel/src/moves/z"',
    );
  });

  it("prints at most 20 lines with no query, naming the roles, sources and qualities", async () => {
    const run = await runCatalog(ok([]), library());
    expect(run.lines.length).toBeLessThanOrEqual(20);
    const text = run.lines.join("\n");
    for (const name of ["lib-moves", "reel", "title", ...Object.keys(QUALITIES)])
      expect(text).toContain(name);
    expect(run.code).toBe(0);
    const builtIns = await runCatalog(ok([]), scratch());
    expect(builtIns.lines.length).toBeLessThanOrEqual(20);
  });

  it("prints at most 10 lines for a query unless --all", async () => {
    const root = scratch();
    const few = await runCatalog(ok(["--near", "fade"]), root);
    expect(few.lines.length).toBeLessThanOrEqual(10);
    const every = await runCatalog(ok(["--near", "fade", "--all"]), root);
    expect(every.lines.length).toBeGreaterThan(10);
  });

  it("prints a move in full with its fields, descriptors, parts and the briefs that import it", async () => {
    const root = library();
    writeFileSync(
      join(root, "reel", "src", "use.ts"),
      `import { bounceZ } from "./moves/z";\nexport const a = bounceZ;\n`,
    );
    const full = (await runCatalog(ok(["bounce-z"]), root)).lines;
    expect(full).toContain("fields: x (primary x)");
    expect(full.some((line) => line.startsWith("descriptors: peak "))).toBe(true);
    expect(full).toContain("parts: none");
    expect(full).toContain("imported by: reel");
    expect(full).toContain('import: import { bounceZ } from "./reel/src/moves/z"');
  });

  it("refuses an unknown quality or move with what is known", async () => {
    const root = library();
    const quality = await runCatalog(ok(["--like", "fluffy"]), root);
    expect(quality.code).toBe(1);
    expect(quality.lines.join(" ")).toContain("heavy");
    const near = await runCatalog(ok(["--near", "nothing"]), root);
    expect(near.code).toBe(1);
  });
});

describe("query", () => {
  const move = (id: string, description: string, x: (progress: number) => number) =>
    defineMove({
      id,
      role: "enter",
      description,
      options: { tilt: { kind: "number", default: 1, description: "A lean." } },
      example: { options: {} },
      moments: () => ({}),
      run: (_options, { progress }): Pose2d => ({ x: x(progress) }),
    });
  const calm = move("settle-calm", "Eases in with no bounce.", (p) =>
    mix(-100, 0, p * p * (3 - 2 * p)),
  );
  const ringing = move(
    "rattle",
    "Rattles in on a Spring.",
    (p) => -100 * (1 - p) * Math.cos(10 * p),
  );
  const records: readonly MoveRecord[] = collectRecords(
    [{ module: { calm, ringing }, source: "kit", version: "1" }],
    {},
  ).map(({ record }) => record);
  const ids = (found: ReturnType<typeof query>) =>
    found.kind === "rows" ? found.rows.map(({ record }) => record.id) : found.message;

  it("keeps only the moves inside a quality's ranges, and the qualities are ranges of descriptors", () => {
    expect(ids(query(records, { like: "calm" }))).toEqual(["settle-calm"]);
    expect(ids(query(records, { like: "loose" }))).toEqual(["rattle"]);
    for (const ranges of Object.values(QUALITIES))
      for (const [low = 0, high = 0] of Object.values(ranges))
        expect(low).toBeLessThanOrEqual(high);
  });

  it("ranks near and far by distance and leaves the move itself out", () => {
    expect(ids(query(records, { near: "rattle" }))).toEqual(["settle-calm"]);
    expect(ids(query(records, { far: "settle-calm" }))).toEqual(["rattle"]);
  });

  it("finds a move whose id, description or option names hold every word, in any case", () => {
    expect(ids(query(records, { find: ["SPRING"] }))).toEqual(["rattle"]);
    expect(ids(query(records, { find: ["rattles", "spring"] }))).toEqual(["rattle"]);
    expect(ids(query(records, { find: ["tilt"] }))).toEqual(["rattle", "settle-calm"]);
    expect(ids(query(records, { find: ["spring", "bounce"] }))).toEqual([]);
  });

  it("keeps the moves that move every named field", () => {
    expect(ids(query(records, { fields: ["x"] }))).toEqual(["rattle", "settle-calm"]);
    expect(ids(query(records, { fields: ["x", "scale"] }))).toEqual([]);
  });
});
