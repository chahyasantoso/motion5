import { describe, expect, it } from "vitest";
import type { PatchPayload } from "../../src/contract/v5-values";
import { outputOf, project, record, row, table, track } from "../support/v5-builders";

describe("v5 fixture builders", () => {
  it("builds authored tables and records without normalizing one into the other", () => {
    expect(table(row("point-a", { x: 1 }), row("point-b", { x: 2 }))).toEqual([
      { id: "point-a", cells: { x: 1 } },
      { id: "point-b", cells: { x: 2 } },
    ]);
    expect(
      record({
        dx: 10,
        dy: [
          { p: 0, v: 0 },
          { p: 1, v: 5 },
        ],
      }),
    ).toEqual({
      dx: 10,
      dy: [
        { p: 0, v: 0 },
        { p: 1, v: 5 },
      ],
    });
  });

  it("maps a plugin track's values, bindings and duration into input", () => {
    const built = track({
      id: "shifted",
      plugin: "translate",
      values: record({ dx: 10 }),
      requires: { data: "points" },
      duration: 500,
    });

    expect(built).toEqual({
      id: "shifted",
      plugin: "translate",
      input: {
        values: { dx: 10 },
        requires: { data: "points" },
      },
      duration: 500,
    });
  });

  it("maps a source schema, which only a no-plugin track may declare", () => {
    const built = track({
      id: "parameters",
      values: record({ dx: 10 }),
      schema: { kind: "record", fields: { dx: { kind: "number" } } },
    });

    expect(built).toEqual({
      id: "parameters",
      input: {
        values: { dx: 10 },
        schema: { kind: "record", fields: { dx: { kind: "number" } } },
      },
    });
  });

  it("omits input rather than writing an empty object", () => {
    expect(track({ id: "empty" })).toEqual({ id: "empty" });
  });

  it("wraps tracks in one manual motion", () => {
    const points = track({ id: "points", values: table(row("a", { x: 0 })) });
    expect(project([points])).toEqual({
      schemaVersion: 5,
      motions: [{ id: "demo", trigger: { type: "manual" }, tracks: [points] }],
    });
  });

  it("reads a named output from a ready patch and nothing from any other status", () => {
    const values = table(row("a", { x: 1 }));
    const ready: PatchPayload = { status: "ready", outputs: { values } };
    const blocked: PatchPayload = { status: "blocked", diagnostics: [] };

    expect(outputOf(ready, "values")).toBe(values);
    expect(outputOf(ready, "inspect")).toBeUndefined();
    expect(outputOf(blocked, "values")).toBeUndefined();
    expect(outputOf(undefined, "values")).toBeUndefined();
  });
});
