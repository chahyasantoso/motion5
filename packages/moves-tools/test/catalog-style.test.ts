import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseCatalogArgs, runCatalog, type CatalogArgs } from "../src/index";

const roots: string[] = [];
afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function ok(argv: readonly string[]): Extract<CatalogArgs, { kind: "ok" }> {
  const args = parseCatalogArgs(argv);
  if (args.kind !== "ok") throw new Error(args.message);
  return args;
}

const move = (id: string) => `import { type Pose2d } from "@gerak/core";
import { defineMove } from "@gerak/moves";
export const ${id.replace(/-./g, (found) => found.slice(1).toUpperCase())} = defineMove({
  id: "${id}",
  role: "enter",
  description: "A scratch style move named ${id}.",
  options: { amount: { kind: "number", default: 1, description: "Unused." } },
  example: { options: { amount: 1 } },
  moments: () => ({}),
  run: (options, { progress }): Pose2d => ({ y: -100 * (1 - progress ** 3) }),
});
`;

const CARD = `import { defineStyle } from "@gerak/moves";
export const card = defineStyle({
  name: "reel",
  description: "A reel of heavy drops.",
  qualities: { arrive: { overshoot: [0.05, 0.3] } },
  lively: { y: [0.5, 1], x: [0.4, 1] },
  tokens: { "--ink": "black" },
  habits: ["Land heavy."],
});
`;

function scratch(files: Readonly<Record<string, string>>): string {
  const dir = mkdtempSync(join(tmpdir(), "catalog-style-"));
  roots.push(dir);
  for (const [name, text] of Object.entries(files)) {
    mkdirSync(join(dir, name, ".."), { recursive: true });
    writeFileSync(join(dir, name), text);
  }
  return dir;
}

const ids = (lines: readonly string[]): readonly string[] =>
  lines.filter((line) => line.includes(" | ")).map((line) => line.split(" | ")[0] ?? "");

describe("--style", () => {
  it("is usage without --anatomy or --design", () => {
    expect(parseCatalogArgs(["--style", "reel"]).kind).toBe("usage");
    expect(parseCatalogArgs(["--anatomy", "--style"]).kind).toBe("usage");
  });

  it("prints the card before the first field line with --anatomy", async () => {
    const root = scratch({ "reel/style.ts": CARD, "reel/src/moves/a.ts": move("scratch-a") });
    const run = await runCatalog(ok(["--anatomy", "--style", "reel"]), root);
    expect(run.code).toBe(0);
    expect(run.lines[0]).toBe("style reel: A reel of heavy drops.");
    const field = run.lines.findIndex((line) => line.startsWith("place |"));
    expect(field).toBeGreaterThan(0);
    const text = run.lines.slice(0, field).join("\n");
    expect(text).toContain("lively: y 0.5 to 1, x 0.4 to 1");
    expect(text).toContain("tokens: --ink black");
    expect(text).toContain("scratch-a");
    const json = await runCatalog(ok(["--anatomy", "--style", "reel", "--json"]), root);
    expect(JSON.parse(json.lines[0] ?? "{}")).toMatchObject({ style: { name: "reel" } });
  });

  it("is a usage message for a brief with no card", async () => {
    const root = scratch({ "reel/style.ts": CARD, "reel/src/moves/a.ts": move("scratch-a") });
    const run = await runCatalog(ok(["--anatomy", "--style", "nope"]), root);
    expect(run.code).toBe(1);
    expect(run.lines[0]).toContain("reel");
  });

  it("puts the style's moves first when two fit alike", async () => {
    const root = scratch({
      "reel/style.ts": CARD,
      "aaa/src/moves/a.ts": move("scratch-a"),
      "reel/src/moves/z.ts": move("scratch-z"),
      "reel/src/piece.ts":
        'export const style = "reel";\nexport const design = { title: { y: "heavy" } };\n',
      "aaa/src/piece.ts": 'export const design = { title: { y: "heavy" } };\n',
    });
    const plain = await runCatalog(
      ok(["--design", "aaa/src/piece.ts", "--target", "title", "--find", "scratch style"]),
      root,
    );
    expect(ids(plain.lines)).toEqual(["scratch-a", "scratch-z"]);
    const flagged = await runCatalog(
      ok([
        "--design",
        "aaa/src/piece.ts",
        "--target",
        "title",
        "--style",
        "reel",
        "--find",
        "scratch style",
      ]),
      root,
    );
    expect(ids(flagged.lines)).toEqual(["scratch-z", "scratch-a"]);
    const named = await runCatalog(
      ok(["--design", "reel/src/piece.ts", "--target", "title", "--find", "scratch style"]),
      root,
    );
    expect(ids(named.lines)).toEqual(["scratch-z", "scratch-a"]);
  });
});
