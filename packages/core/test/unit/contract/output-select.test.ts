import { describe, expect, expectTypeOf, it } from "vitest";
import { unreachable } from "../../../src/lang/exhaustive";
import {
  isFlatRecord,
  selectRecord,
  selectRow,
  selectSingleRow,
  type RecordSelection,
  type RowSelection,
} from "../../../src/contract/output-select";
import type { FlatRecord, Row, Scalar } from "../../../src/contract/v5";
import { row, table } from "../../support/v5-builders";

class NotARecord {
  readonly x = 1;
}

function exhaustiveRecord(selection: RecordSelection): string {
  switch (selection.kind) {
    case "record":
      return `record:${Object.keys(selection.values).length}`;
    case "missing-output":
      return "missing-output";
    case "wrong-kind":
      return "wrong-kind";
    default:
      return unreachable(selection);
  }
}

function exhaustiveRow(selection: RowSelection): string {
  switch (selection.kind) {
    case "row":
      return `row:${Object.keys(selection.cells).length}`;
    case "missing-row":
      return "missing-row";
    case "missing-output":
      return "missing-output";
    case "wrong-kind":
      return "wrong-kind";
    default:
      return unreachable(selection);
  }
}

describe("isFlatRecord", () => {
  it("accepts plain and null-prototype records and refuses everything else", () => {
    expect(isFlatRecord({})).toBe(true);
    expect(isFlatRecord(Object.create(null) as object)).toBe(true);
    expect(isFlatRecord({ x: 1 })).toBe(true);
    expect(isFlatRecord([])).toBe(false);
    expect(isFlatRecord(new NotARecord())).toBe(false);
    expect(isFlatRecord(null)).toBe(false);
    expect(isFlatRecord(undefined)).toBe(false);
    expect(isFlatRecord("x")).toBe(false);
    expect(isFlatRecord(1)).toBe(false);
  });

  it("answers structure only, so a nested record still has a key space", () => {
    expect(isFlatRecord({ nested: { x: 1 } })).toBe(true);
  });
});

describe("selectRecord", () => {
  it("selects a scalar record and preserves the reference", () => {
    const values: FlatRecord = { x: 1, label: "a", visible: true };
    const selection = selectRecord(values);
    expect(selection).toEqual({ kind: "record", values });
    if (selection.kind !== "record") throw new Error("expected record");
    expect(selection.values).toBe(values);
    expect(exhaustiveRecord(selection)).toBe("record:3");
  });

  it("treats an empty plain record and a null-prototype record as valid", () => {
    expect(selectRecord({})).toEqual({ kind: "record", values: {} });
    const bare = Object.create(null) as Record<string, Scalar>;
    bare.x = 2;
    expect(selectRecord(bare)).toEqual({ kind: "record", values: bare });
  });

  it("treats only undefined as missing output", () => {
    expect(selectRecord(undefined)).toEqual({ kind: "missing-output" });
  });

  it("refuses a table, null, primitives and class instances as wrong kind", () => {
    expect(selectRecord([])).toEqual({ kind: "wrong-kind" });
    expect(selectRecord([{ id: "a", cells: { x: 1 } }])).toEqual({ kind: "wrong-kind" });
    expect(selectRecord(null)).toEqual({ kind: "wrong-kind" });
    expect(selectRecord("x")).toEqual({ kind: "wrong-kind" });
    expect(selectRecord(1)).toEqual({ kind: "wrong-kind" });
    expect(selectRecord(new NotARecord())).toEqual({ kind: "wrong-kind" });
  });

  it("refuses a record whose fields leave the published scalar contract", () => {
    expect(selectRecord({ nested: { x: 1 } })).toEqual({ kind: "wrong-kind" });
    expect(selectRecord({ list: [1] })).toEqual({ kind: "wrong-kind" });
    expect(selectRecord({ missing: undefined })).toEqual({ kind: "wrong-kind" });
    expect(selectRecord({ empty: null })).toEqual({ kind: "wrong-kind" });
    expect(selectRecord({ infinite: Number.POSITIVE_INFINITY })).toEqual({ kind: "wrong-kind" });
    expect(selectRecord({ nan: Number.NaN })).toEqual({ kind: "wrong-kind" });
    expect(selectRecord({ fn: () => 1 })).toEqual({ kind: "wrong-kind" });
  });

  it("neither mutates nor freezes the caller's record", () => {
    const values = { x: 1 };
    selectRecord(values);
    expect(values).toEqual({ x: 1 });
    expect(Object.isFrozen(values)).toBe(false);
  });

  it("has no missing-row arm and no row payload", () => {
    const selection: RecordSelection = selectRecord({ x: 1 });
    // @ts-expect-error a record selection cannot answer missing-row
    void (selection.kind === "missing-row");
    // @ts-expect-error a record selection carries values, never cells
    void selection.cells;
    expect(selection.kind).toBe("record");
  });

  it("narrows the payload only after the discriminant is read", () => {
    const selection = selectRecord({ x: 1 });
    if (selection.kind === "record") {
      expectTypeOf(selection.values).toEqualTypeOf<FlatRecord>();
    }
    // @ts-expect-error values is absent from the failure arms
    void (selectRecord(undefined) as RecordSelection).values;
  });
});

describe("selectRow", () => {
  it("selects the requested row and preserves the cells reference", () => {
    const cells = { x: 1, y: 2 };
    const output = table(row("a", { x: 0 }), row("b", cells), row("c", { x: 3 }));
    const selection = selectRow(output, "b");
    expect(selection).toEqual({ kind: "row", cells });
    if (selection.kind !== "row") throw new Error("expected row");
    expect(selection.cells).toBe(cells);
    expect(exhaustiveRow(selection)).toBe("row:2");
  });

  it("refuses a malformed, missing or record value before absence can be answered", () => {
    expect(selectRow(undefined, "a")).toEqual({ kind: "missing-output" });
    expect(selectRow({ x: 1 }, "a")).toEqual({ kind: "wrong-kind" });
    expect(selectRow(null, "a")).toEqual({ kind: "wrong-kind" });
    expect(selectRow([], "a")).toEqual({ kind: "missing-row" });
    expect(selectRow(table(row("a", { x: 1 })), "b")).toEqual({ kind: "missing-row" });
  });

  it("invalidates duplicates of the requested row and of unrelated rows", () => {
    const duplicatedRequested = table(row("a", { x: 1 }), row("a", { x: 2 }));
    expect(selectRow(duplicatedRequested, "a")).toEqual({ kind: "wrong-kind" });

    const duplicatedUnrelated = table(row("a", { x: 1 }), row("b", { x: 2 }), row("b", { x: 3 }));
    expect(selectRow(duplicatedUnrelated, "a")).toEqual({ kind: "wrong-kind" });
  });

  it("keeps scanning after the first match, so a later duplicate still invalidates", () => {
    const output = table(row("a", { x: 1 }), row("b", { x: 2 }), row("a", { x: 3 }));
    expect(selectRow(output, "a")).toEqual({ kind: "wrong-kind" });
  });

  it("refuses a malformed row anywhere, even when the requested row is valid or absent", () => {
    const malformed = [
      [{ id: "a", cells: { x: 1 } }, null],
      [{ id: "a", cells: { x: 1 } }, { id: "b" }],
      [
        { id: "a", cells: { x: 1 } },
        { id: "", cells: { x: 1 } },
      ],
      [
        { id: "a", cells: { x: 1 } },
        { id: 2, cells: { x: 1 } },
      ],
      [
        { id: "a", cells: { x: 1 } },
        { id: "b", cells: [] },
      ],
      [
        { id: "a", cells: { x: 1 } },
        { id: "b", cells: null },
      ],
      [
        { id: "a", cells: { x: 1 } },
        { id: "b", cells: { x: Number.NaN } },
      ],
      [
        { id: "a", cells: { x: 1 } },
        { id: "b", cells: { x: { nested: true } } },
      ],
      [{ id: "a", cells: { x: 1 } }, []],
      [[], { id: "b", cells: { x: 1 } }],
    ];
    for (const output of malformed) {
      expect(selectRow(output, "a"), JSON.stringify(output)).toEqual({ kind: "wrong-kind" });
      expect(selectRow(output, "z"), JSON.stringify(output)).toEqual({ kind: "wrong-kind" });
    }
  });

  it("refuses a sparse array rather than reading a hole as a row", () => {
    const sparse = new Array(2);
    sparse[1] = { id: "b", cells: { x: 1 } };
    expect(selectRow(sparse, "b")).toEqual({ kind: "wrong-kind" });
    expect(selectSingleRow(sparse)).toEqual({ kind: "wrong-kind" });
  });

  it("selects by id independently of distinct-row order", () => {
    const first = { x: 1 };
    const second = { x: 2 };
    const forward = table(row("a", first), row("b", second));
    const reversed = table(row("b", second), row("a", first));
    const pickedForward = selectRow(forward, "b");
    const pickedReversed = selectRow(reversed, "b");
    if (pickedForward.kind !== "row" || pickedReversed.kind !== "row")
      throw new Error("expected rows");
    expect(pickedForward.cells).toBe(second);
    expect(pickedReversed.cells).toBe(second);
  });

  it("neither mutates nor reorders the caller's table", () => {
    const output = table(row("b", { x: 2 }), row("a", { x: 1 }));
    const before = [...output];
    selectRow(output, "a");
    expect(output).toEqual(before);
    expect(output[0]).toBe(before[0]);
    expect(output[1]).toBe(before[1]);
  });

  it("narrows only the row payload and keeps missing-row off selectRecord", () => {
    const selection = selectRow(table(row("a", { x: 1 })), "a");
    if (selection.kind === "row") {
      expectTypeOf(selection.cells).toEqualTypeOf<Row["cells"]>();
    }
    // @ts-expect-error a row selection carries cells, never values
    void (selection as RowSelection).values;
  });
});

describe("selectSingleRow", () => {
  it("answers a one-row table, absence for an empty one and wrong kind for several", () => {
    const cells = { x: 1 };
    expect(selectSingleRow(table(row("only", cells)))).toEqual({ kind: "row", cells });
    expect(selectSingleRow([])).toEqual({ kind: "missing-row" });
    expect(selectSingleRow(table(row("a", { x: 1 }), row("b", { x: 2 })))).toEqual({
      kind: "wrong-kind",
    });
  });

  it("determines validity before cardinality", () => {
    expect(selectSingleRow([{ id: "a", cells: { x: 1 } }, null])).toEqual({ kind: "wrong-kind" });
    expect(selectSingleRow([{ id: "a", cells: { x: Number.NaN } }])).toEqual({
      kind: "wrong-kind",
    });
  });

  it("refuses records and non-table values", () => {
    expect(selectSingleRow({ x: 1 })).toEqual({ kind: "wrong-kind" });
    expect(selectSingleRow(null)).toEqual({ kind: "wrong-kind" });
    expect(selectSingleRow(undefined)).toEqual({ kind: "missing-output" });
  });
});
