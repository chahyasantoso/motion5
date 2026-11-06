import { Spec, defineModel, ok, refused } from "@motion5/core/plugin-api";
import type { Model, Parsed, ValueSpec } from "@motion5/core/plugin-api";

function parseIds(
  value: unknown,
  minRows: number,
  message: string,
): Parsed<{ readonly ids: readonly string[] }> {
  if (!Array.isArray(value)) {
    return refused([{ path: "", message: "Expected a table." }]);
  }
  if (value.length < minRows) {
    return refused([{ path: "values", message }]);
  }
  return ok({ ids: value.map((r) => r.id) });
}

const ANCHORS_2D_SPEC: ValueSpec = Spec.table({
  x: Spec.number(),
  y: Spec.number(),
  inX: Spec.number({ optional: true }),
  inY: Spec.number({ optional: true }),
  outX: Spec.number({ optional: true }),
  outY: Spec.number({ optional: true }),
});

const CUBIC_PATH_2D_SPEC: ValueSpec = Spec.table({
  x0: Spec.number(),
  y0: Spec.number(),
  x1: Spec.number(),
  y1: Spec.number(),
  x2: Spec.number(),
  y2: Spec.number(),
  x3: Spec.number(),
  y3: Spec.number(),
});

const LOCAL_ANCHORS_2D_SPEC: ValueSpec = Spec.table({
  x: Spec.number({ optional: true }),
  y: Spec.number({ optional: true }),
  inX: Spec.number({ optional: true }),
  inY: Spec.number({ optional: true }),
  outX: Spec.number({ optional: true }),
  outY: Spec.number({ optional: true }),
});

export type Anchor2dCells = {
  readonly x: number;
  readonly y: number;
  readonly inX?: number;
  readonly inY?: number;
  readonly outX?: number;
  readonly outY?: number;
};

export type CubicPath2dCells = {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly x3: number;
  readonly y3: number;
};

export type LocalAnchor2dCells = {
  readonly x?: number;
  readonly y?: number;
  readonly inX?: number;
  readonly inY?: number;
  readonly outX?: number;
  readonly outY?: number;
};

export interface AnchorsStructure {
  readonly ids: readonly string[];
}

export interface CubicPathStructure {
  readonly ids: readonly string[];
}

export interface LocalAnchorsStructure {
  readonly ids: readonly string[];
}

/** 2D anchors model specifying positions and relative control handle offsets. */
export const Anchors2d: Model<Anchor2dCells, AnchorsStructure> = defineModel({
  id: "Anchors2d",
  spec: ANCHORS_2D_SPEC,
  parse: (value) => parseIds(value, 2, "A path needs at least 2 anchors."),
});

/** 2D cubic path model specifying absolute Bézier segment control points. */
export const CubicPath2d: Model<CubicPath2dCells, CubicPathStructure> = defineModel({
  id: "CubicPath2d",
  spec: CUBIC_PATH_2D_SPEC,
  parse: (value) => parseIds(value, 1, "A path needs at least 1 segment."),
});

/** 2D local anchors model specifying anchor offsets in bone local coordinate frames. */
export const LocalAnchors2d: Model<LocalAnchor2dCells, LocalAnchorsStructure> = defineModel({
  id: "LocalAnchors2d",
  spec: LOCAL_ANCHORS_2D_SPEC,
  parse: (value) => parseIds(value, 2, "A path needs at least 2 anchors."),
});
