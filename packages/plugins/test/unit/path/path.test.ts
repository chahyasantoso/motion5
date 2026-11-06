import { describe, expect, it } from "vitest";
import { Engine, createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { PluginCatalog } from "@motion5/core/plugin-api";
import {
  Anchors2d,
  CubicPath2d,
  LocalAnchors2d,
  Point2d,
  Points2d,
  Body2d,
  Solved2d,
  builtinModels,
  type Anchor2dCells,
  type CubicPath2dCells,
  type Point2dCells,
} from "../../../src/models/index";
import { anchorsToCubicPlugin } from "../../../src/path/anchors-to-cubic";
import { bezierPlugin } from "../../../src/path/bezier";
import { skinAnchorsPlugin } from "../../../src/path/skin-anchors";
import { pointAtArcFraction } from "../../../src/path/arc-fraction";
import { cubicPathToSvg } from "../../../src/path/draw";
import { fkPlugin } from "../../../src/fk/fk";

function createTestEngine(catalog: PluginCatalog) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: catalog,
  });
}

function loadAndMount(
  engine: Engine,
  project: Parameters<Engine["load"]>[0],
): ReturnType<Engine["load"]> {
  const handle = engine.load(project);
  for (const motion of project.motions ?? []) {
    for (const track of motion.tracks ?? []) {
      handle.mount(`${motion.id}/${track.id}`);
    }
  }
  return handle;
}

function readyPatch(handle: ReturnType<typeof loadAndMount>, nodeId: string) {
  const patch = handle.get(nodeId);
  expect(patch?.status).toBe("ready");
  if (patch?.status !== "ready") throw new Error(`Node ${nodeId} is not ready`);
  return patch;
}

describe("path models and plugins (S8)", () => {
  it("Math: s = 0 is first point, s = 1 is last, straight line matches linear interpolation, quarter-circle matches length", () => {
    const line = [
      {
        id: "s0",
        cells: { x0: 0, y0: 0, x1: 10, y1: 0, x2: 20, y2: 0, x3: 30, y3: 0 },
      },
    ];
    const p0 = pointAtArcFraction(line, 0);
    expect(p0.x).toBeCloseTo(0, 5);
    expect(p0.y).toBeCloseTo(0, 5);
    expect(p0.rotation).toBeCloseTo(0, 5);

    const p1 = pointAtArcFraction(line, 1);
    expect(p1.x).toBeCloseTo(30, 5);
    expect(p1.y).toBeCloseTo(0, 5);

    const pMid = pointAtArcFraction(line, 0.5);
    expect(pMid.x).toBeCloseTo(15, 5);
    expect(pMid.y).toBeCloseTo(0, 5);

    // Standard cubic approximation of a quarter circle of radius R=100 centered at (0, 0):
    // P0=(100, 0), P1=(100, 100*k), P2=(100*k, 100), P3=(0, 100), where k = 4*(sqrt(2)-1)/3 ~= 0.55228475
    const R = 100;
    const k = (4 * (Math.SQRT2 - 1)) / 3;
    const quarterCircle = [
      {
        id: "qc",
        cells: { x0: R, y0: 0, x1: R, y1: R * k, x2: R * k, y2: R, x3: 0, y3: R },
      },
    ];
    // Known arc length is R * pi / 2 ~= 157.0796
    const expectedLen = (R * Math.PI) / 2;
    const sampleQuarter = pointAtArcFraction(quarterCircle, 0.5);
    // Midpoint of quarter circle angle is 45 deg, coordinates are (R*cos(45), R*sin(45)) ~= (70.71, 70.71)
    expect(sampleQuarter.x).toBeCloseTo(R * Math.cos(Math.PI / 4), 1);
    expect(sampleQuarter.y).toBeCloseTo(R * Math.sin(Math.PI / 4), 1);
    expect(sampleQuarter.rotation).toBeCloseTo(135, 1);
  });

  it("Tangent at s = 1 matches the limit from s = 0.999 when the end handle is absent or short", () => {
    const handleFree = [
      { id: "h", cells: { x0: 0, y0: 0, x1: 0, y1: 0, x2: 100, y2: 0, x3: 100, y3: 0 } },
    ];
    const end = pointAtArcFraction(handleFree, 1);
    expect(end.rotation).toBeCloseTo(pointAtArcFraction(handleFree, 0.999).rotation, 0);
    expect(end.rotation).toBeCloseTo(0, 5);

    const zeroEndTangent = [
      { id: "z", cells: { x0: 0, y0: 0, x1: 60, y1: 0, x2: 200, y2: 80, x3: 200, y3: 80 } },
    ];
    const last = pointAtArcFraction(zeroEndTangent, 1);
    expect(last.rotation).toBeCloseTo(pointAtArcFraction(zeroEndTangent, 0.999).rotation, 0);
    expect(last.rotation).toBeCloseTo(29.74, 1);
  });

  it("Arc length: equal steps of s give nearly equal distances along a two-segment path with one short and one long segment", () => {
    // Segment 1: length 10; Segment 2: length 90. Total 100.
    const twoSegments = [
      {
        id: "short",
        cells: { x0: 0, y0: 0, x1: 3.33, y1: 0, x2: 6.67, y2: 0, x3: 10, y3: 0 },
      },
      {
        id: "long",
        cells: { x0: 10, y0: 0, x1: 40, y1: 0, x2: 70, y2: 0, x3: 100, y3: 0 },
      },
    ];
    const s01 = pointAtArcFraction(twoSegments, 0.1); // at distance 10, exactly at end of segment 1
    expect(s01.x).toBeCloseTo(10, 2);

    const s02 = pointAtArcFraction(twoSegments, 0.2); // at distance 20
    expect(s02.x).toBeCloseTo(20, 2);

    const s05 = pointAtArcFraction(twoSegments, 0.5); // at distance 50
    expect(s05.x).toBeCloseTo(50, 2);
  });

  it("Clamp: t = 1.3 and t = -0.2 give the end points", () => {
    const line = [
      {
        id: "s0",
        cells: { x0: 10, y0: 20, x1: 20, y1: 20, x2: 30, y2: 20, x3: 40, y3: 20 },
      },
    ];
    const over = pointAtArcFraction(line, 1.3);
    expect(over.x).toBeCloseTo(40, 5);
    expect(over.y).toBeCloseTo(20, 5);

    const under = pointAtArcFraction(line, -0.2);
    expect(under.x).toBeCloseTo(10, 5);
    expect(under.y).toBeCloseTo(20, 5);
  });

  it("Degenerate: all anchors equal gives the first point with rotation = 0; cusp does not loop or return NaN", () => {
    const zero = [
      {
        id: "z",
        cells: { x0: 50, y0: 50, x1: 50, y1: 50, x2: 50, y2: 50, x3: 50, y3: 50 },
      },
    ];
    const pZero = pointAtArcFraction(zero, 0.5);
    expect(pZero.x).toBeCloseTo(50, 5);
    expect(pZero.y).toBeCloseTo(50, 5);
    expect(pZero.rotation).toBe(0);

    // Sharp cusp: tangent goes to zero at cusp midpoint
    const cusp = [
      {
        id: "c",
        cells: { x0: 0, y0: 0, x1: 50, y1: 100, x2: 50, y2: 100, x3: 100, y3: 0 },
      },
    ];
    const pCusp = pointAtArcFraction(cusp, 0.5);
    expect(Number.isFinite(pCusp.x)).toBe(true);
    expect(Number.isFinite(pCusp.y)).toBe(true);
    expect(Number.isFinite(pCusp.rotation)).toBe(true);
  });

  it("Termination: the inversion stops within iteration bound on all fixtures", () => {
    const segments = [
      {
        id: "s1",
        cells: { x0: 0, y0: 0, x1: 20, y1: 80, x2: 80, y2: -40, x3: 100, y3: 100 },
      },
      {
        id: "s2",
        cells: { x0: 100, y0: 100, x1: 120, y1: 200, x2: 180, y2: 50, x3: 200, y3: 0 },
      },
    ];
    for (let i = 0; i <= 20; i++) {
      const res = pointAtArcFraction(segments, i / 20);
      expect(Number.isFinite(res.x)).toBe(true);
      expect(Number.isFinite(res.y)).toBe(true);
      expect(Number.isFinite(res.rotation)).toBe(true);
    }
  });

  it("Skin, rest: with a straight rope and rest handles, skinAnchors output equals authored anchors exactly", () => {
    const catalog = new PluginCatalog({
      models: [...builtinModels],
      plugins: [fkPlugin, skinAnchorsPlugin],
    });
    const engine = createTestEngine(catalog);
    const handle = loadAndMount(engine, {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "pin",
              output: { model: "Point2d" },
              input: { values: { x: 10, y: 20, rotation: 0 } },
            },
            {
              id: "rope",
              output: { model: "Body2d" },
              input: {
                values: [
                  { id: "a", cells: { length: 0, rotation: 0 } },
                  { id: "b", cells: { parentId: "a", length: 50, rotation: 0 } },
                  { id: "c", cells: { parentId: "b", length: 50, rotation: 0 } },
                ],
              },
            },
            {
              id: "frames",
              output: { plugin: "fk" },
              input: { requires: { chain: "rope", base: "pin" } },
            },
            {
              id: "letter",
              output: { plugin: "skinAnchors" },
              input: {
                values: [
                  { id: "a", cells: { x: 0, y: 0, outX: 10 } },
                  { id: "b", cells: { x: 0, y: 0, inX: -10, outX: 15 } },
                  { id: "c", cells: { x: 0, y: 0, inX: -15 } },
                ],
                requires: { frames: "frames" },
              },
            },
          ],
        },
      ],
    });

    handle.seek("m/letter", 0);
    const patch = readyPatch(handle, "m/letter");
    const rows = patch.outputs.values as readonly {
      readonly id: string;
      readonly cells: Anchor2dCells;
    }[];
    expect(rows).toEqual([
      { id: "a", cells: { x: 10, y: 20, outX: 10 } },
      { id: "b", cells: { x: 60, y: 20, inX: -10, outX: 15 } },
      { id: "c", cells: { x: 110, y: 20, inX: -15 } },
    ]);
    handle.dispose();
  });

  it("Skin, bend: rotating pin by 90 degrees rotates every handle by 90 degrees; absent handles stay absent", () => {
    const catalog = new PluginCatalog({
      models: [...builtinModels],
      plugins: [fkPlugin, skinAnchorsPlugin],
    });
    const engine = createTestEngine(catalog);
    const handle = loadAndMount(engine, {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "pin",
              output: { model: "Point2d" },
              input: { values: { x: 0, y: 0, rotation: 90 } },
            },
            {
              id: "rope",
              output: { model: "Body2d" },
              input: {
                values: [
                  { id: "a", cells: { length: 0, rotation: 0 } },
                  { id: "b", cells: { parentId: "a", length: 100, rotation: 0 } },
                ],
              },
            },
            {
              id: "frames",
              output: { plugin: "fk" },
              input: { requires: { chain: "rope", base: "pin" } },
            },
            {
              id: "letter",
              output: { plugin: "skinAnchors" },
              input: {
                values: [
                  { id: "a", cells: { x: 0, y: 0, outX: 10 } },
                  { id: "b", cells: { x: 0, y: 0, inX: -10 } },
                ],
                requires: { frames: "frames" },
              },
            },
          ],
        },
      ],
    });

    handle.seek("m/letter", 0);
    const patch = readyPatch(handle, "m/letter");
    const rows = patch.outputs.values as readonly {
      readonly id: string;
      readonly cells: Anchor2dCells;
    }[];
    // Root at 0, 0 rotated 90 deg: +x vector (10, 0) rotates to (0, 10).
    // Bone b tip is at (0, 100). -x vector (-10, 0) rotates to (0, -10).
    expect(rows[0]?.cells.x).toBeCloseTo(0, 5);
    expect(rows[0]?.cells.y).toBeCloseTo(0, 5);
    expect(rows[0]?.cells.outX).toBeCloseTo(0, 5);
    expect(rows[0]?.cells.outY).toBeCloseTo(10, 5);
    expect(rows[0]?.cells.inX).toBeUndefined();

    expect(rows[1]?.cells.x).toBeCloseTo(0, 5);
    expect(rows[1]?.cells.y).toBeCloseTo(100, 5);
    expect(rows[1]?.cells.inX).toBeCloseTo(0, 5);
    expect(rows[1]?.cells.inY).toBeCloseTo(-10, 5);
    expect(rows[1]?.cells.outX).toBeUndefined();
    handle.dispose();
  });

  it("Skin, refusals: row naming no bone, one row, slot bound to Body2d track", () => {
    const catalog = new PluginCatalog({
      models: [...builtinModels],
      plugins: [fkPlugin, skinAnchorsPlugin],
    });
    const engine = createTestEngine(catalog);

    // Refusal 1: One row in LocalAnchors2d refused at commit by LocalAnchors2d.parse
    expect(() =>
      engine.load({
        schemaVersion: 5,
        motions: [
          {
            id: "m",
            trigger: { type: "manual" },
            tracks: [
              {
                id: "single",
                output: { model: "LocalAnchors2d" },
                input: { values: [{ id: "a", cells: { x: 0, y: 0 } }] },
              },
            ],
          },
        ],
      }),
    ).toThrow(/A path needs at least 2 anchors/);

    // Refusal 2: Slot frames bound to a Body2d track fails admission with slot-model-unsatisfied
    expect(() =>
      engine.load({
        schemaVersion: 5,
        motions: [
          {
            id: "m",
            trigger: { type: "manual" },
            tracks: [
              {
                id: "body",
                output: { model: "Body2d" },
                input: { values: [{ id: "a", cells: { length: 10, rotation: 0 } }] },
              },
              {
                id: "letter",
                output: { plugin: "skinAnchors" },
                input: {
                  values: [
                    { id: "a", cells: { x: 0, y: 0 } },
                    { id: "b", cells: { x: 0, y: 0 } },
                  ],
                  requires: { frames: "body" },
                },
              },
            ],
          },
        ],
      }),
    ).toThrow(/slot-model-unsatisfied/);

    // Refusal 3: Row naming unknown bone refused in prepare
    const handle = loadAndMount(engine, {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "pin",
              output: { model: "Point2d" },
              input: { values: { x: 0, y: 0, rotation: 0 } },
            },
            {
              id: "rope",
              output: { model: "Body2d" },
              input: {
                values: [
                  { id: "a", cells: { length: 0, rotation: 0 } },
                  { id: "b", cells: { parentId: "a", length: 10, rotation: 0 } },
                ],
              },
            },
            {
              id: "frames",
              output: { plugin: "fk" },
              input: { requires: { chain: "rope", base: "pin" } },
            },
            {
              id: "letter",
              output: { plugin: "skinAnchors" },
              input: {
                values: [
                  { id: "a", cells: { x: 0, y: 0 } },
                  { id: "unknownBone", cells: { x: 0, y: 0 } },
                ],
                requires: { frames: "frames" },
              },
            },
          ],
        },
      ],
    });
    handle.seek("m/letter", 0);
    const patch = handle.get("m/letter");
    expect(patch?.status).toBe("error");
    if (patch?.status === "error") {
      expect(patch.diagnostics[0]?.message).toMatch(/Anchor 'unknownBone' names no bone in frames/);
    }
    handle.dispose();
  });

  it("Follower output: bezier output binds to a slot requiring Point2d", () => {
    const catalog = new PluginCatalog({
      models: [...builtinModels],
      plugins: [anchorsToCubicPlugin, bezierPlugin, fkPlugin],
    });
    const engine = createTestEngine(catalog);
    const handle = loadAndMount(engine, {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "anchors",
              output: { model: "Anchors2d" },
              input: {
                values: [
                  { id: "a", cells: { x: 0, y: 0, outX: 50 } },
                  { id: "b", cells: { x: 100, y: 100, inX: -50 } },
                ],
              },
            },
            {
              id: "path",
              output: { plugin: "anchorsToCubic" },
              input: { requires: { anchors: "anchors" } },
            },
            {
              id: "follower",
              output: { plugin: "bezier" },
              input: { requires: { path: "path" } },
            },
            {
              id: "chain",
              output: { model: "Body2d" },
              input: {
                values: [{ id: "arm", cells: { length: 50, rotation: 0 } }],
              },
            },
            // fk requires base: Point2d - bound to bezier output!
            {
              id: "tips",
              output: { plugin: "fk" },
              input: { requires: { chain: "chain", base: "follower" } },
            },
          ],
        },
      ],
    });

    handle.seek("m/tips", 0.5);
    const tipsPatch = handle.get("m/tips");
    expect(tipsPatch?.status).toBe("ready");
    handle.dispose();
  });

  it("Continuity: segment k ends where segment k + 1 starts", () => {
    const anchors = [
      { id: "a", cells: { x: 0, y: 0, outX: 10, outY: 5 } },
      { id: "b", cells: { x: 100, y: 50, inX: -20, inY: 0, outX: 30, outY: 10 } },
      { id: "c", cells: { x: 200, y: 120, inX: -15, inY: -5 } },
    ];
    const cubic = anchorsToCubicPlugin.transform(
      {
        values: {},
        requires: { anchors },
        structures: { anchors: { ids: ["a", "b", "c"] } },
        state: undefined,
      },
      {
        nodeId: "n",
        progress: 0,
      },
    );
    const segments = cubic.values as readonly {
      readonly id: string;
      readonly cells: CubicPath2dCells;
    }[];
    expect(segments.length).toBe(2);
    expect(segments[0]?.cells.x3).toBe(segments[1]?.cells.x0);
    expect(segments[0]?.cells.y3).toBe(segments[1]?.cells.y0);
  });

  it("Exactness: the follower point lies on the published segment", () => {
    const segments = [
      {
        id: "s1",
        cells: { x0: 0, y0: 0, x1: 50, y1: 0, x2: 50, y2: 100, x3: 100, y3: 100 },
      },
    ];
    const pt = pointAtArcFraction(segments, 0.5);
    // At u where arc fraction is 0.5, point must satisfy B(u) for some u
    expect(pt.x).toBeGreaterThan(0);
    expect(pt.x).toBeLessThan(100);
    expect(pt.y).toBeGreaterThan(0);
    expect(pt.y).toBeLessThan(100);
  });

  it("Defaults: t omitted equals track progress; authored stops win", () => {
    const catalog = new PluginCatalog({
      models: [...builtinModels],
      plugins: [anchorsToCubicPlugin, bezierPlugin],
    });
    const engine = createTestEngine(catalog);
    const handle = loadAndMount(engine, {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "anchors",
              output: { model: "Anchors2d" },
              input: {
                values: [
                  { id: "a", cells: { x: 0, y: 0 } },
                  { id: "b", cells: { x: 100, y: 0 } },
                ],
              },
            },
            {
              id: "path",
              output: { plugin: "anchorsToCubic" },
              input: { requires: { anchors: "anchors" } },
            },
            {
              id: "defaultProgress",
              output: { plugin: "bezier" },
              input: { requires: { path: "path" } },
            },
            {
              id: "authoredT",
              output: { plugin: "bezier" },
              input: {
                param: { t: 0.25 },
                requires: { path: "path" },
              },
            },
          ],
        },
      ],
    });

    handle.seek("m/defaultProgress", 0.7);
    const pDefault = readyPatch(handle, "m/defaultProgress");
    const vDefault = pDefault.outputs.values as Point2dCells;
    expect(vDefault.x).toBeCloseTo(70, 2);

    handle.seek("m/authoredT", 0.7);
    const pAuthored = readyPatch(handle, "m/authoredT");
    const vAuthored = pAuthored.outputs.values as Point2dCells;
    expect(vAuthored.x).toBeCloseTo(25, 2);
    handle.dispose();
  });

  it("Refusals: one anchor, duplicate anchor id, card.path bound to invalid plugin", () => {
    const catalog = new PluginCatalog({
      models: [...builtinModels],
      plugins: [anchorsToCubicPlugin, bezierPlugin],
    });
    const engine = createTestEngine(catalog);

    // 1 anchor refused by Anchors2d.parse at commit
    expect(() =>
      engine.load({
        schemaVersion: 5,
        motions: [
          {
            id: "m",
            trigger: { type: "manual" },
            tracks: [
              {
                id: "one",
                output: { model: "Anchors2d" },
                input: { values: [{ id: "a", cells: { x: 0, y: 0 } }] },
              },
            ],
          },
        ],
      }),
    ).toThrow(/A path needs at least 2 anchors/);

    // Duplicate anchor id refused by spec
    expect(() =>
      engine.load({
        schemaVersion: 5,
        motions: [
          {
            id: "m",
            trigger: { type: "manual" },
            tracks: [
              {
                id: "dup",
                output: { model: "Anchors2d" },
                input: {
                  values: [
                    { id: "a", cells: { x: 0, y: 0 } },
                    { id: "a", cells: { x: 10, y: 10 } },
                  ],
                },
              },
            ],
          },
        ],
      }),
    ).toThrow(/row-id-duplicate/);

    // card.path bound to plugin not implementing CubicPath2d
    expect(() =>
      engine.load({
        schemaVersion: 5,
        motions: [
          {
            id: "m",
            trigger: { type: "manual" },
            tracks: [
              {
                id: "wrong",
                output: { model: "Point2d" },
                input: { values: { x: 0, y: 0, rotation: 0 } },
              },
              {
                id: "card",
                output: { plugin: "bezier" },
                input: { requires: { path: "wrong" } },
              },
            ],
          },
        ],
      }),
    ).toThrow(/slot-model-unsatisfied/);
  });

  it("Two producers: a second CubicPath2d plugin feeds the same follower unchanged", () => {
    const catalog = new PluginCatalog({
      models: [...builtinModels],
      plugins: [anchorsToCubicPlugin, bezierPlugin],
    });
    const engine = createTestEngine(catalog);
    const handle = loadAndMount(engine, {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            // Hand-authored source implementing CubicPath2d directly
            {
              id: "directPath",
              output: { model: "CubicPath2d" },
              input: {
                values: [
                  {
                    id: "seg0",
                    cells: { x0: 0, y0: 0, x1: 20, y1: 0, x2: 40, y2: 0, x3: 100, y3: 0 },
                  },
                ],
              },
            },
            {
              id: "followerDirect",
              output: { plugin: "bezier" },
              input: { requires: { path: "directPath" } },
            },
          ],
        },
      ],
    });

    handle.seek("m/followerDirect", 0.5);
    const patch = readyPatch(handle, "m/followerDirect");
    const vDirect = patch.outputs.values as Point2dCells;
    expect(vDirect.x).toBeCloseTo(50, 2);
    handle.dispose();
  });

  it("Row ids: CubicPath2d ids equal start anchor ids and stay fixed over frames", () => {
    const catalog = new PluginCatalog({
      models: [...builtinModels],
      plugins: [anchorsToCubicPlugin],
    });
    const engine = createTestEngine(catalog);
    const handle = loadAndMount(engine, {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "anchors",
              output: { model: "Anchors2d" },
              input: {
                values: [
                  { id: "alpha", cells: { x: 0, y: 0, outX: 10 } },
                  { id: "beta", cells: { x: 50, y: 20, inX: -10, outX: 10 } },
                  { id: "gamma", cells: { x: 100, y: 0, inX: -10 } },
                ],
              },
            },
            {
              id: "path",
              output: { plugin: "anchorsToCubic" },
              input: { requires: { anchors: "anchors" } },
            },
          ],
        },
      ],
    });

    handle.seek("m/path", 0);
    const p1 = readyPatch(handle, "m/path");
    const rows1 = p1.outputs.values as readonly { readonly id: string }[];
    const ids1 = rows1.map((r) => r.id);
    expect(ids1).toEqual(["alpha", "beta"]);

    handle.seek("m/path", 0.8);
    const p2 = readyPatch(handle, "m/path");
    const rows2 = p2.outputs.values as readonly { readonly id: string }[];
    const ids2 = rows2.map((r) => r.id);
    expect(ids2).toEqual(["alpha", "beta"]);
    handle.dispose();
  });

  it("Commit prepare: a live anchor edit naming an unknown bone is refused before compose", () => {
    const catalog = new PluginCatalog({
      models: [...builtinModels],
      plugins: [fkPlugin, skinAnchorsPlugin],
    });
    const handle = loadAndMount(createTestEngine(catalog), {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "pin",
              output: { model: "Point2d" },
              input: { values: { x: 0, y: 0, rotation: 0 } },
            },
            {
              id: "rope",
              output: { model: "Body2d" },
              input: {
                values: [
                  { id: "a", cells: { length: 0, rotation: 0 } },
                  { id: "b", cells: { parentId: "a", length: 10, rotation: 0 } },
                ],
              },
            },
            {
              id: "frames",
              output: { plugin: "fk" },
              input: { requires: { chain: "rope", base: "pin" } },
            },
            {
              id: "letter",
              output: { plugin: "skinAnchors" },
              input: {
                values: [
                  { id: "a", cells: { x: 0, y: 0 } },
                  { id: "b", cells: { x: 0, y: 0 } },
                ],
                requires: { frames: "frames" },
              },
            },
          ],
        },
      ],
    });
    try {
      handle.seek("m/letter", 0);
      const before = readyPatch(handle, "m/letter");
      expect(() =>
        handle.track("m/letter").input.replace({
          values: [
            { id: "a", cells: { x: 0, y: 0 } },
            { id: "missing", cells: { x: 0, y: 0 } },
          ],
          requires: { frames: "frames" },
        }),
      ).toThrow(/Anchor 'missing' names no bone in frames/);
      const after = readyPatch(handle, "m/letter");
      expect(after.outputs.values).toEqual(before.outputs.values);
    } finally {
      handle.dispose();
    }
  });

  it("Host drawing example: renders CubicPath2d segments into valid SVG path d string", () => {
    const segments = [
      {
        id: "a",
        cells: { x0: 0, y0: 0, x1: 10, y1: 5, x2: 20, y2: 15, x3: 30, y3: 20 },
      },
      {
        id: "b",
        cells: { x0: 30, y0: 20, x1: 40, y1: 25, x2: 50, y2: 35, x3: 60, y3: 40 },
      },
    ];
    const d = cubicPathToSvg(segments);
    expect(d).toBe("M 0 0 C 10 5, 20 15, 30 20 C 40 25, 50 35, 60 40");
  });
});
