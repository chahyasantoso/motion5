import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parseCatalogArgs, runCatalog, type CatalogArgs } from "../src/index";

const roots: string[] = [];
afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const move = (id: string, pose: string) => `import { type Pose2d } from "@gerak/core";
import { defineMove } from "@gerak/moves";
export const ${id.replace("-", "")} = defineMove({
  id: "${id}",
  role: "emphasis",
  description: "A scratch move for ${id}.",
  options: { amount: { kind: "number", min: 0, max: 2, default: 1, description: "Unused." } },
  example: { options: { amount: 1 } },
  moments: () => ({}),
  run: (_options, { progress }): Pose2d => (${pose}),
});
`;

/** A root with a good mover, a mover of x and scale, a mover of hue, and a move that ends away from rest. */
function scratch(): string {
  const dir = mkdtempSync(join(tmpdir(), "catalog-tested-"));
  roots.push(dir);
  mkdirSync(join(dir, "reel/src/moves"), { recursive: true });
  const put = (file: string, text: string) =>
    writeFileSync(join(dir, "reel/src/moves", file), text);
  put(
    "slide.ts",
    move(
      "slide-xs",
      "{ x: 40 * Math.sin(Math.PI * progress), scale: 1 + 0.2 * Math.sin(Math.PI * progress) }",
    ),
  );
  put("tint.ts", move("tint-hue", "{ hue: 30 * Math.sin(Math.PI * progress) }"));
  put("broken.ts", move("broken-end", "{ x: 40 * Math.sin(Math.PI * progress) + 9 * progress }"));
  return dir;
}

function ok(argv: readonly string[]): Extract<CatalogArgs, { kind: "ok" }> {
  const args = parseCatalogArgs(argv);
  if (args.kind !== "ok") throw new Error(args.message);
  return args;
}

const ids = (lines: readonly string[]): readonly string[] =>
  lines.filter((line) => line.includes(" | ")).map((line) => line.split(" | ")[0] ?? "");

describe("tested moves", () => {
  it("leaves out a move with a gate finding and says how many, and shows it with --all", async () => {
    const root = scratch();
    const run = await runCatalog(ok(["--role", "emphasis", "--fields", "x"]), root);
    expect(ids(run.lines)).toContain("slide-xs");
    expect(ids(run.lines)).not.toContain("broken-end");
    expect(run.lines.join("\n")).toMatch(/1 move with findings left out; --all lists/);
    const every = await runCatalog(ok(["--role", "emphasis", "--fields", "x", "--all"]), root);
    const broken = every.lines.find((line) => line.startsWith("broken-end |")) ?? "";
    expect(broken).toMatch(/\| [1-9]\d* findings \|/);
    const good = every.lines.find((line) => line.startsWith("slide-xs |")) ?? "";
    expect(good).toContain("| passes |");
  });

  it("states the count of moves with findings in the summary, and still checks them under --check", async () => {
    const root = scratch();
    const summary = await runCatalog(ok([]), root);
    expect(summary.lines.join("\n")).toMatch(/1 move with findings/);
    const check = await runCatalog(ok(["--check", "--role", "emphasis"]), root);
    expect(check.code).toBe(1);
    expect(check.lines.some((line) => line.startsWith("broken-end:"))).toBe(true);
  });

  it("records the number of findings in the JSON record", async () => {
    const run = await runCatalog(ok(["--json", "--all"]), scratch());
    const records: unknown = JSON.parse(run.lines.join("\n"));
    const found = Array.isArray(records)
      ? records.map((record: unknown) => [
          Reflect.get(Object(record), "id"),
          Reflect.get(Object(record), "findings"),
        ])
      : [];
    expect(found).toContainEqual(["slide-xs", 0]);
    expect(found).toContainEqual(["broken-end", expect.any(Number)]);
  });
});

describe("--renderer", () => {
  it("keeps a move whose every field the renderer writes, and leaves out the rest", async () => {
    const root = scratch();
    const three = await runCatalog(ok(["--renderer", "three", "--role", "emphasis"]), root);
    expect(ids(three.lines)).toContain("slide-xs");
    expect(ids(three.lines)).not.toContain("tint-hue");
    const dom = await runCatalog(ok(["--renderer", "dom", "--role", "emphasis"]), root);
    expect(ids(dom.lines)).toEqual(expect.arrayContaining(["slide-xs", "tint-hue"]));
  });

  it("refuses an unknown renderer naming the known ones", () => {
    const usage = parseCatalogArgs(["--renderer", "canvas"]);
    expect(usage.kind).toBe("usage");
    if (usage.kind === "usage") expect(usage.message).toMatch(/dom.*three/);
  });

  it("prints, in the full entry, the fields each renderer leaves unwritten and why", async () => {
    const full = await runCatalog(ok(["tint-hue"]), scratch());
    const line = full.lines.find((text) => text.startsWith("unwritten by three 2d:")) ?? "";
    expect(line).toContain("hue");
    expect(line).toContain("no place");
    expect(full.lines).toContain("unwritten by dom: none");
  });
});
