import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { VALUE_FIELDS, QUALITIES } from "@gerak/moves";
import {
  FIELD_GROUPS,
  moveParts,
  parseCatalogArgs,
  runCatalog,
  type CatalogArgs,
} from "@gerak/tools/scene";
import { callerPiecesRoot } from "../src/page/root";

const PIECES_ROOT = callerPiecesRoot();

function ok(argv: readonly string[]): Extract<CatalogArgs, { kind: "ok" }> {
  const args = parseCatalogArgs(argv);
  if (args.kind !== "ok") throw new Error(args.message);
  return args;
}

const word = (name: string) => new RegExp(`(?<![\\w.])${name}(?![\\w])`);

describe("gerak moves --anatomy", () => {
  it("puts every field in exactly one group", () => {
    const named = Object.values(FIELD_GROUPS).flat();
    for (const field of Object.keys(VALUE_FIELDS))
      expect(
        named.filter((name) => name === field),
        field,
      ).toHaveLength(1);
    for (const name of named) expect(Object.keys(VALUE_FIELDS), name).toContain(name);
  });

  it("prints every field and every part in at most 90 lines", async () => {
    const run = await runCatalog(ok(["--anatomy"]), PIECES_ROOT);
    expect(run.code).toBe(0);
    expect(run.lines.length).toBeLessThanOrEqual(90);
    const text = run.lines.join("\n");
    for (const field of Object.keys(VALUE_FIELDS)) expect(text, field).toMatch(word(field));
    for (const { name } of moveParts()) expect(text, name).toMatch(word(name));
    for (const quality of Object.keys(QUALITIES)) expect(text, quality).toContain(quality);
    for (const shape of ["peak", "overshoot", "rings", "windup", "settle"])
      expect(text, shape).toContain(shape);
  });

  it("names the renderers that write a field", async () => {
    const run = await runCatalog(ok(["--anatomy"]), PIECES_ROOT);
    const line = (field: string) => run.lines.find((text) => word(field).test(text)) ?? "";
    expect(line("hue")).toContain("dom");
    expect(line("hue")).not.toContain("three");
    expect(line("rotationX")).toContain("three 3d");
    expect(line("rotationX")).not.toContain("dom");
  });

  it("shows taper with its label and its values at progress 0, 0.5 and 1", async () => {
    const run = await runCatalog(ok(["--anatomy"]), PIECES_ROOT);
    const line = run.lines.find((text) => text.includes("taper(p, 2)")) ?? "";
    expect(line).toContain("1, 0.25, 0");
  });

  it("prints the same names as one JSON object under --json", async () => {
    const text = await runCatalog(ok(["--anatomy"]), PIECES_ROOT);
    const run = await runCatalog(ok(["--anatomy", "--json"]), PIECES_ROOT);
    expect(run.lines).toHaveLength(1);
    const data: unknown = JSON.parse(run.lines.join("\n"));
    if (typeof data !== "object" || data === null) throw new Error("not an object");
    expect(Object.keys(data)).toEqual(["fields", "parts", "shapes", "qualities"]);
    const names = (key: string): readonly string[] => {
      const list: unknown = Reflect.get(data, key);
      return Array.isArray(list)
        ? list.map((entry: unknown) => String(Reflect.get(Object(entry), "name")))
        : [];
    };
    expect(names("fields")).toEqual(expect.arrayContaining(Object.keys(VALUE_FIELDS)));
    expect(names("parts")).toEqual(moveParts().map(({ name }) => name));
    expect(names("shapes")).toEqual(["peak", "overshoot", "rings", "windup", "settle"]);
    expect(names("qualities")).toEqual(Object.keys(QUALITIES));
    expect(text.lines.join("\n")).toContain("taper");
  });
});

describe("gerak moves --anatomy with local parts", () => {
  const PART = `import { definePart } from "@gerak/moves";
/** A scratch envelope. */
export const hump = definePart(
  { kind: "envelope", samples: [{ run: (p: number) => 1 - p * p, at0: 1, at1: 0, label: "hump(p)" }] },
  (p: number) => 1 - p * p,
);
`;
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });
  function root(): string {
    const dir = mkdtempSync(join(tmpdir(), "anatomy-local-"));
    dirs.push(dir);
    mkdirSync(join(dir, "reel", "src", "parts", "envelope"), { recursive: true });
    writeFileSync(join(dir, "reel", "src", "parts", "envelope", "hump.ts"), PART);
    return dir;
  }

  it("lists them after the library's parts under a heading naming the source", async () => {
    const run = await runCatalog(ok(["--anatomy"]), root());
    const at = run.lines.indexOf("parts of reel:");
    expect(at).toBeGreaterThan(run.lines.findIndex((line) => line.includes("taper")));
    expect(run.lines[at + 1]).toContain("hump");
  });

  it("gives each part a source under --json", async () => {
    const run = await runCatalog(ok(["--anatomy", "--json"]), root());
    const data: unknown = JSON.parse(run.lines.join("\n"));
    const parts: unknown = Reflect.get(Object(data), "parts");
    const source = (name: string): unknown =>
      Array.isArray(parts)
        ? Reflect.get(
            Object(parts.find((part: unknown) => Reflect.get(Object(part), "name") === name)),
            "source",
          )
        : undefined;
    expect(source("hump")).toBe("reel");
    expect(source("taper")).toBe("@gerak/moves");
  });
});
