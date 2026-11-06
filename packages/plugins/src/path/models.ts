import { defineModel, ok, refused } from "@motion5/core/plugin-api";
import type { Model, ValueSpec } from "@motion5/core/plugin-api";

const ANCHORS_2D_SPEC: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        x: { kind: "number" },
        y: { kind: "number" },
        inX: { kind: "number", optional: true },
        inY: { kind: "number", optional: true },
        outX: { kind: "number", optional: true },
        outY: { kind: "number", optional: true },
      },
    },
  },
};

const CUBIC_PATH_2D_SPEC: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        x0: { kind: "number" },
        y0: { kind: "number" },
        x1: { kind: "number" },
        y1: { kind: "number" },
        x2: { kind: "number" },
        y2: { kind: "number" },
        x3: { kind: "number" },
        y3: { kind: "number" },
      },
    },
  },
};

const LOCAL_ANCHORS_2D_SPEC: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        x: { kind: "number", optional: true },
        y: { kind: "number", optional: true },
        inX: { kind: "number", optional: true },
        inY: { kind: "number", optional: true },
        outX: { kind: "number", optional: true },
        outY: { kind: "number", optional: true },
      },
    },
  },
};

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
  parse(value) {
    if (!Array.isArray(value)) {
      return refused([{ path: "", message: "Expected a table." }]);
    }
    if (value.length < 2) {
      return refused([{ path: "values", message: "A path needs at least 2 anchors." }]);
    }
    return ok({ ids: value.map((r) => r.id) });
  },
});

/** 2D cubic path model specifying absolute Bézier segment control points. */
export const CubicPath2d: Model<CubicPath2dCells, CubicPathStructure> = defineModel({
  id: "CubicPath2d",
  spec: CUBIC_PATH_2D_SPEC,
  parse(value) {
    if (!Array.isArray(value)) {
      return refused([{ path: "", message: "Expected a table." }]);
    }
    if (value.length < 1) {
      return refused([{ path: "values", message: "A path needs at least 1 segment." }]);
    }
    return ok({ ids: value.map((r) => r.id) });
  },
});

/** 2D local anchors model specifying anchor offsets in bone local coordinate frames. */
export const LocalAnchors2d: Model<LocalAnchor2dCells, LocalAnchorsStructure> = defineModel({
  id: "LocalAnchors2d",
  spec: LOCAL_ANCHORS_2D_SPEC,
  parse(value) {
    if (!Array.isArray(value)) {
      return refused([{ path: "", message: "Expected a table." }]);
    }
    if (value.length < 2) {
      return refused([{ path: "values", message: "A path needs at least 2 anchors." }]);
    }
    return ok({ ids: value.map((r) => r.id) });
  },
});
