import {
  BODY_2D_FIELDS,
  GOALS_2D_FIELDS,
  POINT_2D_FIELDS,
  BODY_3D_FIELDS,
  GOALS_3D_FIELDS,
  POINT_3D_FIELDS,
  SOLVED_2D_FIELDS,
  SOLVED_3D_FIELDS,
} from "../../../src/models/specs";
import { describe, expect, expectTypeOf, it } from "vitest";
import { definePlugin, ok, optional, type Model, type TableOf } from "@motion5/core/plugin-api";
import {
  Body2d,
  Body3d,
  Goals2d,
  Goals3d,
  Point2d,
  Point3d,
  Solved2d,
  Solved3d,
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
} from "../../../src/models/index";
import type { BodyStructure } from "../../../src/models/body/domain";
import type { GoalsStructure } from "../../../src/models/goals/domain";
import type { SolvedStructure } from "../../../src/models/solved/domain";
import { fkPlugin } from "../../../src/fk/fk";
import { fk3dPlugin } from "../../../src/fk/fk3d";
import { ikPlugin } from "../../../src/ik/ik";
import { ik3dPlugin } from "../../../src/ik/ik3d";
import { defineModel } from "@motion5/core/plugin-api";

type RowsOf<M> = M extends Model<infer Cells, infer _Structure> ? TableOf<Cells> : never;
type KeysOf<T extends object> = keyof T;
type TransformInput<P> = P extends { transform(input: infer I, ...rest: never[]): unknown }
  ? I
  : never;

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
    expectTypeOf<KeysOf<Point2dCells>>().toEqualTypeOf<keyof typeof POINT_2D_FIELDS>();
    expectTypeOf<KeysOf<Point3dCells>>().toEqualTypeOf<keyof typeof POINT_3D_FIELDS>();
    expectTypeOf<KeysOf<Points2dCells>>().toEqualTypeOf<keyof typeof POINT_2D_FIELDS>();
    expectTypeOf<KeysOf<Points3dCells>>().toEqualTypeOf<keyof typeof POINT_3D_FIELDS>();
    expectTypeOf<KeysOf<Solved2dCells>>().toEqualTypeOf<keyof typeof SOLVED_2D_FIELDS>();
    expectTypeOf<KeysOf<Solved3dCells>>().toEqualTypeOf<keyof typeof SOLVED_3D_FIELDS>();
  });

  it("derives requires, structures and state in definePlugin without hand-written input types", () => {
    const plugin = definePlugin({
      id: "motion5/test-derived",
      inputs: {
        requires: {
          chain: Body2d,
          base: Point2d,
          solved: optional(Solved2d),
        },
      },
      outputs: { values: Solved2d },
      prepare({ structures }) {
        expectTypeOf(structures.chain).toEqualTypeOf<BodyStructure>();
        expectTypeOf(structures.solved).toEqualTypeOf<SolvedStructure | undefined>();
        return ok({ count: structures.chain.ids.length });
      },
      transform({ requires, structures, state }) {
        expectTypeOf(requires.chain).toEqualTypeOf<TableOf<Body2dCells>>();
        expectTypeOf(requires.base).toEqualTypeOf<Point2dCells>();
        expectTypeOf(requires.solved).toEqualTypeOf<TableOf<Solved2dCells> | undefined>();
        expectTypeOf(structures.chain).toEqualTypeOf<BodyStructure>();
        expectTypeOf(structures.solved).toEqualTypeOf<SolvedStructure | undefined>();
        expectTypeOf(state).toEqualTypeOf<{ count: number }>();
        // @ts-expect-error unknown slot name in requires fails typecheck
        const unknownSlot: unknown = requires.unknownSlot;
        void unknownSlot;
        return { values: [] };
      },
    });

    expect(plugin.id).toBe("motion5/test-derived");
    expectTypeOf<TransformInput<typeof fkPlugin>["requires"]>().toEqualTypeOf<{
      readonly chain: TableOf<Body2dCells>;
      readonly base: Point2dCells;
      readonly solved?: TableOf<Solved2dCells> | undefined;
    }>();
    expectTypeOf<TransformInput<typeof fk3dPlugin>["requires"]>().toEqualTypeOf<{
      readonly chain: TableOf<Body3dCells>;
      readonly base: Point3dCells;
      readonly solved?: TableOf<Solved3dCells> | undefined;
    }>();
    expectTypeOf<TransformInput<typeof ikPlugin>["requires"]>().toEqualTypeOf<{
      readonly chain: TableOf<Body2dCells>;
      readonly base: Point2dCells;
      readonly goals: TableOf<Goals2dCells>;
    }>();
    expectTypeOf<TransformInput<typeof ik3dPlugin>["structures"]>().toEqualTypeOf<{
      readonly chain: BodyStructure;
      readonly goals: GoalsStructure;
    }>();
    expect(typeof fkPlugin.transform).toBe("function");
    expect(typeof fk3dPlugin.transform).toBe("function");
    expect(typeof ikPlugin.transform).toBe("function");
    expect(typeof ik3dPlugin.transform).toBe("function");
    void Body3d;
    void Goals2d;
    void Goals3d;
    void Point3d;
    void Solved3d;
  });
});
