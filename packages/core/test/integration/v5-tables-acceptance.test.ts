import { describe, expect, expectTypeOf, it } from "vitest";
import type { Patch, ProjectDefinition } from "../../src/contract/v5";
import type { RuleId } from "../../src/contract/rule-id";
import type {
  AuthoredCell,
  AuthoredRow,
  Outputs,
  PatchPayload,
  Scalar,
  TrackDefinition,
  TrackInput,
  ValueSpec,
} from "../../src/contract/v5-values";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import {
  outputOf,
  project,
  record,
  row,
  table,
  track,
  type BuilderProject,
} from "../support/v5-builders";

/**
 * Phase 1 acceptance suite for the identified-table contract.
 *
 * The type cases below are green now: they encode the settled direction. Every runtime case is
 * staged with `it.fails`, because the live engine still reads grouped `keyframes`; each starts
 * passing in Phase 2 or 3, at which point the `it.fails` marker must be removed. Test names state
 * the phase that owns the behavior instead of reporting staged coverage as done.
 */

function engine() {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  });
}

function load(definition: BuilderProject) {
  return engine().load(definition);
}

/** Load a deliberately malformed authored document, disposing it when the engine accepts it. */
function loadAndDispose(definition: unknown): void {
  const handle = engine().load(definition as ProjectDefinition);
  handle.dispose();
}

/**
 * Bridges today's live patch to the staged target payload.
 *
 * The live engine still publishes one `values` record, so a ready patch has no named outputs. The
 * target contract publishes `outputs`; Phase 2 moves the engine and this bridge collapses into the
 * status narrowing below. Reading a missing output as absent keeps a staged failure an assertion
 * rather than a crash.
 */
function staged(patch: Patch | undefined): PatchPayload | undefined {
  if (patch === undefined) return undefined;
  if (patch.status !== "ready") return patch;
  const outputs = (patch as unknown as { readonly outputs?: Outputs }).outputs ?? {};
  return { status: "ready", outputs };
}

/**
 * The payload one node publishes at one progress.
 *
 * Every track is mounted and sought at the same progress: a bound dependency contributes its own
 * scheduled result, so seeking only the consumer would leave the dependency unpublished.
 */
function patchAt(
  definition: BuilderProject,
  nodeId: string,
  progress: number,
): PatchPayload | undefined {
  const handle = load(definition);
  try {
    const trackIds = handle.motion("demo").trackIds;
    for (const id of trackIds) handle.mount(id);
    let patch: Patch | undefined;
    for (const id of trackIds) {
      const batch = handle.seek(id, progress);
      patch ??= batch.patches.find((candidate) => candidate.nodeId === nodeId);
    }
    return staged(patch);
  } finally {
    handle.dispose();
  }
}

/** A typed predicate for rule assertions, so a misspelled id fails `typecheck`. */
function rule(id: RuleId): RegExp {
  return new RegExp(id);
}

function malformed(trackDefinition: unknown): unknown {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "demo",
        trigger: { type: "manual" },
        tracks: [trackDefinition],
      },
    ],
  };
}

describe("v5 contract direction", () => {
  it("settles the authored track and input member sets", () => {
    expectTypeOf<keyof TrackDefinition>().toEqualTypeOf<"id" | "plugin" | "input" | "duration">();
    expectTypeOf<keyof TrackInput>().toEqualTypeOf<"values" | "requires" | "schema">();
  });

  it("refuses old grouped, flat-row, structured-cell and type-alias forms", () => {
    // Excess-property checking is the refusal here: structural assignability would accept the
    // extra key, and `keyof` above is what proves the target track has no slot for it.
    // @ts-expect-error grouped keyframes are not part of the target track
    const grouped: TrackDefinition = { id: "legacy", keyframes: {} };
    // @ts-expect-error observes is not part of the target track
    const observes: TrackDefinition = { id: "legacy", observes: [] };
    void grouped;
    void observes;
    expectTypeOf<{ x: number }>().not.toExtend<AuthoredRow>();
    expectTypeOf<{ literal: number }>().not.toExtend<AuthoredCell>();
    expectTypeOf<{ type: "record"; fields: Record<string, never> }>().not.toExtend<ValueSpec>();
    expectTypeOf<null>().not.toExtend<Scalar>();
  });
});

describe("v5 source evaluation", () => {
  it.fails(
    "[staged Phase 2] publishes an inferred table source row-per-point at progress 0.5",
    () => {
      const points = track({
        id: "points",
        values: table(
          row("point-a", {
            x: [
              { p: 0, v: 0 },
              { p: 1, v: 100 },
            ],
            y: 20,
          }),
          row("point-b", { x: 200, y: 40 }),
        ),
      });

      const patch = patchAt(project([points]), "demo/points", 0.5);

      expect(patch?.status).toBe("ready");
      expect(outputOf(patch, "values")).toEqual(
        table(row("point-a", { x: 50, y: 20 }), row("point-b", { x: 200, y: 40 })),
      );
    },
  );

  it.fails("[staged Phase 2] publishes a record source as a flat record", () => {
    const parameters = track({
      id: "parameters",
      values: record({
        dx: 10,
        dy: [
          { p: 0, v: 0 },
          { p: 1, v: 10 },
        ],
      }),
    });

    const patch = patchAt(project([parameters]), "demo/parameters", 0.5);

    expect(patch?.status).toBe("ready");
    expect(outputOf(patch, "values")).toEqual({ dx: 10, dy: 5 });
  });
});

describe("v5 explicit plugin slice", () => {
  it.fails(
    "[staged Phase 3] points -> translate preserves source ids and publishes only values",
    () => {
      const points = track({
        id: "points",
        values: table(
          row("point-a", {
            x: [
              { p: 0, v: 0 },
              { p: 1, v: 100 },
            ],
            y: 20,
          }),
          row("point-b", { x: 200, y: 40 }),
        ),
      });
      const shifted = track({
        id: "shifted-points",
        plugin: "translate",
        values: record({ dx: 10, dy: 5 }),
        requires: { data: "points" },
      });

      const patch = patchAt(project([points, shifted]), "demo/shifted-points", 0.5);
      const values = outputOf(patch, "values");

      expect(patch?.status).toBe("ready");
      expect(values).toEqual(
        table(row("point-a", { x: 60, y: 25 }), row("point-b", { x: 210, y: 45 })),
      );
      expect(values).not.toHaveProperty("dx");
      expect(values).not.toHaveProperty("dy");
    },
  );
});

describe("v5 authored refusals", () => {
  it.fails(
    "[staged Phase 2] refuses grouped keyframes and observes under track-legacy-field",
    () => {
      expect(() =>
        loadAndDispose(malformed({ id: "legacy", keyframes: { transform: { values: { x: 0 } } } })),
      ).toThrow(rule("track-legacy-field"));
      expect(() =>
        loadAndDispose(malformed({ id: "legacy", observes: [{ source: "points" }] })),
      ).toThrow(rule("track-legacy-field"));
    },
  );

  it.fails("[staged Phase 2] refuses a flat row without the id/cells envelope", () => {
    expect(() =>
      loadAndDispose(
        malformed({ id: "points", input: { values: [{ point: "point-a", x: 0, y: 0 }] } }),
      ),
    ).toThrow(rule("row-id-invalid"));
  });

  it.fails("[staged Phase 2] refuses a structured cell", () => {
    expect(() =>
      loadAndDispose(
        malformed({
          id: "points",
          input: { values: [{ id: "point-a", cells: { x: { literal: 1 } } }] },
        }),
      ),
    ).toThrow(rule("cell-form-invalid"));
  });

  it.fails("[staged Phase 2] refuses a type descriptor in place of kind", () => {
    expect(() =>
      loadAndDispose(
        malformed({
          id: "parameters",
          input: {
            values: { dx: 10 },
            schema: { type: "record", fields: { dx: { kind: "number" } } },
          },
        }),
      ),
    ).toThrow(rule("spec-field-unknown"));
  });

  it.fails(
    "[staged Phase 2] refuses a table authored where the declared schema is a record",
    () => {
      expect(() =>
        loadAndDispose(
          malformed(
            track({
              id: "parameters",
              values: table(row("point-a", { dx: 10, dy: 5 })),
              schema: {
                kind: "record",
                fields: { dx: { kind: "number" }, dy: { kind: "number" } },
              },
            }),
          ),
        ),
      ).toThrow(rule("values-shape-invalid"));
    },
  );

  it.fails("[staged Phase 2] refuses stops in a static declared field", () => {
    expect(() =>
      loadAndDispose(
        malformed({
          id: "parameters",
          input: {
            values: {
              dx: [
                { p: 0, v: 10 },
                { p: 1, v: 20 },
              ],
            },
            schema: { kind: "record", fields: { dx: { kind: "number", static: true } } },
          },
        }),
      ),
    ).toThrow(rule("static-field-stops"));
  });
});
