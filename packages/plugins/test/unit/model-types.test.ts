import { describe, expect, expectTypeOf, it } from "vitest";
import type { Model, TableOf } from "@motion5/core/plugin-api";
import {
  Body2d,
  type Body2dCells,
  type Body3dCells,
  type Goals2dCells,
  type Goals3dCells,
  type Point2dCells,
  type Point3dCells,
  type Points2dCells,
  type Points3dCells,
  type Solved2dCells,
  type Solved3dCells,
} from "../../src/models";
import { BODY_2D_FIELDS, GOALS_2D_FIELDS, ROOT_2D_FIELDS } from "../../src/body/fields";
import { BODY_3D_FIELDS } from "../../src/body3d/fields";
import { GOALS_3D_FIELDS } from "../../src/goals3d/fields";
import { ROOT_3D_FIELDS } from "../../src/root3d/fields";
import { SOLVED_2D_FIELDS } from "../../src/solved/fields";
import { SOLVED_3D_FIELDS } from "../../src/solved3d/fields";

type RowsOf<M> = M extends Model<infer Cells, infer _Structure> ? TableOf<Cells> : never;
type KeysOf<T extends object> = keyof T;

describe("model cell types", () => {
  it("carries a model's cell type through to its row type", () => {
    expectTypeOf<RowsOf<typeof Body2d>>().toEqualTypeOf<TableOf<Body2dCells>>();
  });

  it("distinguishes models whose cell types differ", () => {
    type A = Model<{ readonly a: number }, undefined>;
    type B = Model<{ readonly b: number }, undefined>;
    // @ts-expect-error cell types differ
    const wrong: A = null as unknown as B;
    expect(wrong).toBeNull();
  });

  it("matches every model's cell keys to its declared spec", () => {
    expectTypeOf<KeysOf<Body2dCells>>().toEqualTypeOf<keyof typeof BODY_2D_FIELDS>();
    expectTypeOf<KeysOf<Body3dCells>>().toEqualTypeOf<keyof typeof BODY_3D_FIELDS>();
    expectTypeOf<KeysOf<Goals2dCells>>().toEqualTypeOf<keyof typeof GOALS_2D_FIELDS>();
    expectTypeOf<KeysOf<Goals3dCells>>().toEqualTypeOf<keyof typeof GOALS_3D_FIELDS>();
    expectTypeOf<KeysOf<Point2dCells>>().toEqualTypeOf<keyof typeof ROOT_2D_FIELDS>();
    expectTypeOf<KeysOf<Point3dCells>>().toEqualTypeOf<keyof typeof ROOT_3D_FIELDS>();
    expectTypeOf<KeysOf<Points2dCells>>().toEqualTypeOf<keyof typeof ROOT_2D_FIELDS>();
    expectTypeOf<KeysOf<Points3dCells>>().toEqualTypeOf<keyof typeof ROOT_3D_FIELDS>();
    expectTypeOf<KeysOf<Solved2dCells>>().toEqualTypeOf<keyof typeof SOLVED_2D_FIELDS>();
    expectTypeOf<KeysOf<Solved3dCells>>().toEqualTypeOf<keyof typeof SOLVED_3D_FIELDS>();
  });
});
