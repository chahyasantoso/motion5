import { describe, expect, it } from "vitest";
import { VALUE_FIELDS } from "@gerak/moves";
import {
  FIELD_GROUPS,
  QUALITIES,
  moveParts,
  parseCatalogArgs,
  runCatalog,
  type CatalogArgs,
} from "@gerak/tools/scene";
import { DEFAULT_ROOT } from "../src/page/page";

function ok(argv: readonly string[]): Extract<CatalogArgs, { kind: "ok" }> {
  const args = parseCatalogArgs(argv);
  if (args.kind !== "ok") throw new Error(args.message);
  return args;
}

const word = (name: string) => new RegExp(`(?<![\\w.])${name}(?![\\w])`);

describe("motion:moves --anatomy", () => {
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
    const run = await runCatalog(ok(["--anatomy"]), DEFAULT_ROOT);
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
    const run = await runCatalog(ok(["--anatomy"]), DEFAULT_ROOT);
    const line = (field: string) => run.lines.find((text) => word(field).test(text)) ?? "";
    expect(line("hue")).toContain("dom");
    expect(line("hue")).not.toContain("three");
    expect(line("rotationX")).toContain("three 3d");
    expect(line("rotationX")).not.toContain("dom");
  });

  it("shows taper with its label and its values at progress 0, 0.5 and 1", async () => {
    const run = await runCatalog(ok(["--anatomy"]), DEFAULT_ROOT);
    const line = run.lines.find((text) => text.includes("taper(p, 2)")) ?? "";
    expect(line).toContain("1, 0.25, 0");
  });

  it("prints the same names as one JSON object under --json", async () => {
    const text = await runCatalog(ok(["--anatomy"]), DEFAULT_ROOT);
    const run = await runCatalog(ok(["--anatomy", "--json"]), DEFAULT_ROOT);
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
