import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseCatalogArgs, runCatalog, type CatalogArgs } from "@gerak/tools/scene";
import { DEFAULT_ROOT } from "../src/page/page";

const roots: string[] = [];
afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function ok(argv: readonly string[]): Extract<CatalogArgs, { kind: "ok" }> {
  const args = parseCatalogArgs(argv);
  if (args.kind !== "ok") throw new Error(args.message);
  return args;
}

const ARCH = "40 * Math.sin(Math.PI * progress)";
const LANDING = "-100 * (1 - progress ** 3)";

const move = (
  id: string,
  pose: string,
  extra: { readonly imports?: string; readonly options?: string; readonly example?: string } = {},
) => `import { defineMove, ${extra.imports ?? ""} type Pose2d } from "@gerak/moves";
export const ${id.replace(/-./g, (found) => found.slice(1).toUpperCase())} = defineMove({
  id: "${id}",
  role: "enter",
  description: "A scratch design move named ${id}.",
  options: ${extra.options ?? `{ amount: { kind: "number", default: 1, description: "Unused." } }`},
  example: { options: ${extra.example ?? "{ amount: 1 }"} },
  moments: () => ({}),
  run: (options, { progress }): Pose2d => (${pose}),
});
`;

function scratch(files: Readonly<Record<string, string>>): string {
  const dir = mkdtempSync(join(tmpdir(), "catalog-design-"));
  roots.push(dir);
  mkdirSync(join(dir, "reel/src/moves"), { recursive: true });
  for (const [name, text] of Object.entries(files))
    writeFileSync(join(dir, "reel/src", name), text);
  return dir;
}

const ids = (lines: readonly string[]): readonly string[] =>
  lines.filter((line) => line.includes(" | ")).map((line) => line.split(" | ")[0] ?? "");

describe("--move on today's moves", () => {
  it("puts a move with the quality first, drop among the heavy y and squish among the loose scaleY", async () => {
    const heavy = await runCatalog(ok(["--move", "y:heavy"]), DEFAULT_ROOT);
    expect(heavy.lines[0]).toContain("✓ y:heavy");
    expect(heavy.lines.find((line) => line.startsWith("drop |"))).toContain("✓ y:heavy");
    const loose = await runCatalog(ok(["--move", "scaleY:loose"]), DEFAULT_ROOT);
    expect(loose.lines[0]).toContain("✓ scaleY:loose");
    expect(loose.lines.find((line) => line.startsWith("squish |"))).toContain("✓ scaleY:loose");
  });

  it("marks each requested field with a tick or a cross and the value that decided it", async () => {
    const run = await runCatalog(ok(["--move", "y:heavy", "--move", "scaleY"]), DEFAULT_ROOT);
    const row = run.lines.find((line) => line.startsWith("drop |")) ?? "";
    expect(row).toMatch(/✓ y:heavy \(peak [\d.]+/);
    expect(row).toMatch(/✓ scaleY|✗ scaleY/);
  });
});

describe("fit", () => {
  it("ranks a move with the right field and the wrong quality below one with the right quality", async () => {
    const root = scratch({
      "moves/landing.ts": move("scratch-landing", `{ y: ${LANDING} }`),
      "moves/arch.ts": move("scratch-arch", `{ y: ${ARCH} }`),
    });
    const run = await runCatalog(ok(["--move", "y:heavy", "--find", "scratch design"]), root);
    expect(ids(run.lines)).toEqual(["scratch-landing", "scratch-arch"]);
    expect(run.lines[1]).toContain("✗ y:heavy");
  });

  it("finds a move that is heavy only at a non-example option set, naming the option", async () => {
    const options = `{ amount: { kind: "number", min: 0, max: 1, default: 0, description: "How landed." } }`;
    const root = scratch({
      "moves/shifty.ts": move(
        "scratch-shifty",
        `{ y: (1 - options.amount) * ${ARCH} + options.amount * ${LANDING} }`,
        { options, example: "{ amount: 0 }" },
      ),
    });
    const run = await runCatalog(ok(["--move", "y:heavy", "--find", "scratch design"]), root);
    const row = run.lines.find((line) => line.startsWith("scratch-shifty |")) ?? "";
    expect(row).toContain("✓ y:heavy");
    expect(row).toContain("at amount=1");
  });

  it("breaks a tie with the share of --uses names the move's file imports", async () => {
    const root = scratch({
      "moves/aaa.ts": move("scratch-aaa", `{ y: ${ARCH} }`),
      "moves/bbb.ts": move("scratch-bbb", `{ y: ${ARCH} + mix(0, 0, 0) }`, { imports: "mix," }),
    });
    const plain = await runCatalog(ok(["--move", "y", "--find", "scratch design"]), root);
    expect(ids(plain.lines)).toEqual(["scratch-aaa", "scratch-bbb"]);
    const uses = await runCatalog(
      ok(["--move", "y", "--uses", "blend", "--find", "scratch design"]),
      root,
    );
    expect(ids(uses.lines)).toEqual(["scratch-bbb", "scratch-aaa"]);
    expect(uses.lines[0]).toContain("✓ uses blend");
    expect(uses.lines[1]).toContain("✗ uses blend");
  });

  it("refuses an unknown quality, field or use, naming it", async () => {
    const quality = await runCatalog(ok(["--move", "y:fluffy"]), DEFAULT_ROOT);
    expect(quality.code).toBe(1);
    expect(quality.lines.join(" ")).toContain("fluffy");
    const field = await runCatalog(ok(["--move", "sideways"]), DEFAULT_ROOT);
    expect(field.lines.join(" ")).toContain("sideways");
    const use = await runCatalog(ok(["--uses", "wobbly"]), DEFAULT_ROOT);
    expect(use.lines.join(" ")).toContain("wobbly");
  });
});

describe("a design no move fits", () => {
  it("prints the answer, the design and the command that makes a new move", async () => {
    const argv = ["--move", "rotationX:heavy", "--move", "clipRadius:loose", "--uses", "ease"];
    const run = await runCatalog(ok(argv), DEFAULT_ROOT);
    expect(run.lines[0]).toBe("No move does this closely.");
    expect(run.lines.join("\n")).toContain("rotationX:heavy, clipRadius:loose");
    expect(run.lines.join("\n")).toContain("uses ease");
    expect(run.lines).toContain("or write one: npm run motion:new -- --move <id> --in <brief>");
    const named = await runCatalog(ok([...argv, "--in", "reel"]), DEFAULT_ROOT);
    expect(named.lines).toContain("or write one: npm run motion:new -- --move <id> --in reel");
  });

  it("names the move for each field alone, to combine in the scene, or says to write it", async () => {
    const run = await runCatalog(
      ok([
        "--move",
        "y:heavy",
        "--move",
        "scaleY:loose",
        "--move",
        "hue:playful",
        "--role",
        "enter",
      ]),
      DEFAULT_ROOT,
    );
    expect(run.lines[0]).toBe("No move does this closely.");
    expect(run.lines).toContainEqual(
      expect.stringMatching(
        /^combine in the scene: y:heavy by [\w/-]+; scaleY:loose by [\w/-]+; hue:playful by no move; write it$/,
      ),
    );
  });
});

describe("a quality's range", () => {
  it("scores every move inside the range alike, so rings 2 and rings 16 are both loose", async () => {
    const run = await runCatalog(ok(["--move", "scaleY:loose", "--all"]), DEFAULT_ROOT);
    const loose = run.lines.filter((line) => line.includes("✓ scaleY:loose"));
    expect(loose.map((line) => line.split(" | ")[0])).toEqual(
      expect.arrayContaining(["squish", "spring-settle", "hand-wave"]),
    );
    expect(run.lines.findIndex((line) => line.includes("✗ scaleY:loose"))).toBeGreaterThan(
      run.lines.findLastIndex((line) => line.includes("✓ scaleY:loose")),
    );
  });

  it("answers at the move's own example when it fits, naming no other options", async () => {
    const run = await runCatalog(ok(["--move", "scaleY:loose"]), DEFAULT_ROOT);
    const squish = run.lines.find((line) => line.startsWith("squish |")) ?? "";
    expect(squish).toContain("✓ scaleY:loose");
    expect(squish).not.toContain(" at ");
  });
});

describe("--design", () => {
  const piece = (design: string) => scratch({ "piece.ts": `export const design = ${design};\n` });

  it("asks what a piece's target says, a per-beat intent counting as its field", async () => {
    const root = piece(`{ title: { y: "heavy", opacity: { in: "calm" } }, other: { x: "quick" } }`);
    const file = join(root, "reel/src/piece.ts");
    const run = await runCatalog(ok(["--design", file, "--target", "title"]), DEFAULT_ROOT);
    expect(run.code).toBe(0);
    expect(["implode", "kick"]).toContain(ids(run.lines)[0]);
    expect(run.lines[0]).toContain("y:heavy");
    expect(run.lines[0]).toContain("opacity:calm");
    expect(run.lines.join("\n")).not.toContain("x:quick");
  });

  it("refuses an unknown target and an unknown quality, naming each", async () => {
    const unknown = await runCatalog(
      ok(["--design", "reel/src/piece.ts", "--target", "nowhere"]),
      piece(`{ title: { y: "heavy" } }`),
    );
    expect(unknown.code).toBe(1);
    expect(unknown.lines.join(" ")).toContain("nowhere");
    const quality = await runCatalog(
      ok(["--design", "reel/src/piece.ts", "--target", "title"]),
      piece(`{ title: { y: "fluffy" } }`),
    );
    expect(quality.code).toBe(1);
    expect(quality.lines.join(" ")).toContain("fluffy");
  });

  it("needs a target with a design", () => {
    expect(parseCatalogArgs(["--design", "a.ts"]).kind).toBe("usage");
    expect(parseCatalogArgs(["--target", "title"]).kind).toBe("usage");
  });
});

describe("motion:moves --design from the command line", () => {
  it("reads the design file from where the command runs, as the guide writes it", () => {
    const run = spawnSync(
      process.execPath,
      [
        "packages/tools/bin/motion-moves.mjs",
        "--design",
        "apps/pieces/delivered/src/delivered.ts",
        "--target",
        "parcel",
        "--in",
        "delivered",
      ],
      { encoding: "utf8", env: { ...process.env, INIT_CWD: process.cwd() } },
    );
    expect(run.stdout).toContain("drop");
    expect(run.status).toBe(0);
  }, 60000);
});

describe("a quality's name", () => {
  it("is refused when it is only an inherited property name", async () => {
    for (const name of ["toString", "constructor", "__proto__"]) {
      const like = await runCatalog(ok(["--like", name]), DEFAULT_ROOT);
      expect(like.code, name).toBe(1);
      expect(like.lines[0]).toContain("unknown quality");
    }
  });
});

describe("a fit", () => {
  it("is every requested field moved and inside its quality, so a row marked ✗ never answers", async () => {
    const run = await runCatalog(ok(["--move", "opacity:playful"]), DEFAULT_ROOT);
    expect(run.lines[0]).toBe("No move does this closely.");
    expect(run.lines).toContain("nearest, each missing something:");
    const near = run.lines.slice(run.lines.indexOf("nearest, each missing something:") + 1);
    expect(near.length).toBeGreaterThan(0);
    for (const line of near) expect(line).toContain("✗");
  });
});
