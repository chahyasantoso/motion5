import { BODY_2D_FIELDS, BODY_3D_FIELDS } from "../../../src/specs";
import { describe, expect, it } from "vitest";
import { parseBody } from "../../../src/body/domain";
import { rowAt } from "../../../src/table-lookup";

const parse = (value: unknown) => parseBody(value, BODY_2D_FIELDS);

describe("body domain", () => {
  it("orders roots before children and records leaf topology", () => {
    const result = parse([
      { id: "child", cells: { parentId: "root", length: 10, rotation: 0 } },
      { id: "root", cells: { length: 20, rotation: 0 } },
    ]);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    expect(result.value.ids).toEqual(["root", "child"]);
    expect(result.value.roots).toEqual(["root"]);
    expect(result.value.leaves).toEqual(["child"]);
    expect(result.value.parentById.get("child")).toBe("root");
  });

  it("refuses an unknown parent", () => {
    const result = parse([
      { id: "child", cells: { parentId: "missing", length: 10, rotation: 0 } },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]?.kind).toBe("parent-unknown");
  });

  it("refuses a parent cycle", () => {
    const result = parse([
      { id: "a", cells: { parentId: "b", length: 10, rotation: 0 } },
      { id: "b", cells: { parentId: "a", length: 10, rotation: 0 } },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]?.kind).toBe("parent-cycle");
  });

  it("refuses an inverted rotation range", () => {
    const result = parse([
      {
        id: "root",
        cells: { length: 10, rotation: 0, minRotation: 20, maxRotation: -20 },
      },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]?.kind).toBe("range-inverted");
  });

  it("refuses inverted 3D twist bounds", () => {
    const result = parseBody(
      [
        {
          id: "root",
          cells: { length: 10, minTwist: 20, maxTwist: -20 },
        },
      ],
      BODY_3D_FIELDS,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors[0]?.kind).toBe("range-inverted");
      expect(result.errors[0]).toMatchObject({ field: "twist" });
    }
  });

  it("records the table index for canonical row order", () => {
    const result = parse([
      { id: "child", cells: { parentId: "root", length: 10, rotation: 0 } },
      { id: "root", cells: { length: 20, rotation: 0 } },
    ]);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    expect(result.value.ids).toEqual(["root", "child"]);
    expect(result.value.tableIndex).toEqual([1, 0]);
  });

  it("row lookup refuses a table whose order drifted", () => {
    const result = parse([
      { id: "child", cells: { parentId: "root", length: 10, rotation: 0 } },
      { id: "root", cells: { length: 20, rotation: 0 } },
    ]);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    expect(() =>
      rowAt(
        [
          { id: "child", cells: { parentId: "root", length: 10, rotation: 0 } },
          { id: "other", cells: { length: 20, rotation: 0 } },
        ],
        result.value.tableIndex,
        0,
        "root",
      ),
    ).toThrow(/committed position/);
  });
});
