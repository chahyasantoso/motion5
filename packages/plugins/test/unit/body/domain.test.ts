import { describe, expect, it } from "vitest";
import { bindBody, parseBody } from "../../../src/body/domain";
import { BODY_2D_FIELDS } from "../../../src/body/fields";
import { BODY_3D_FIELDS } from "../../../src/body3d/fields";

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

  it("binds a changed row set as an error", () => {
    const result = parse([{ id: "root", cells: { length: 10, rotation: 0 } }]);
    if (!result.ok) throw new Error(JSON.stringify(result.errors));
    expect(() => bindBody(result.value, [])).toThrow(/row set changed/);
  });
});
