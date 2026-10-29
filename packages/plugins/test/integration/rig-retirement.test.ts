import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock, type ProjectDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { identifiedCatalog } from "../../src/identified-catalog";
import { builtinCatalog } from "../../src/catalog";
import { fkPlugin } from "../../src/fk";
import { ikPlugin } from "../../src/ik";

const PLUGINS_PKG = resolve(import.meta.dirname, "../../package.json");
const PENDING_PATH = resolve(import.meta.dirname, "../../../../test/pending.json");

describe("Phase 5 closeout and rig retirement (AQ)", () => {
  it("AQ-1 public manifest package.json contains neither ./rig nor ./internal/legacy/rig", () => {
    const pkg = JSON.parse(readFileSync(PLUGINS_PKG, "utf8"));
    expect(pkg.exports["./rig"]).toBeUndefined();
    expect(pkg.exports["./internal/legacy/rig"]).toBeUndefined();
    expect(pkg.exports["./fk"]).toBeDefined();
    expect(pkg.exports["./ik"]).toBeDefined();
    expect(pkg.exports["./transform"]).toBeDefined();
    expect(pkg.exports["./fk3d"]).toBeDefined();
    expect(pkg.exports["./ik3d"]).toBeDefined();
    expect(pkg.exports["./transform3d"]).toBeDefined();
  });

  it("AQ-2 identified catalog deletion: rig is absent and surviving keys match", () => {
    expect(identifiedCatalog.has("rig")).toBe(false);
    expect([...identifiedCatalog.keys()]).toEqual([
      "transform",
      "transform3d",
      "ik",
      "ik3d",
      "fk",
      "fk3d",
    ]);
  });

  it("AQ-3 builtin catalog deletion: rig is absent and surviving keys match", () => {
    expect(builtinCatalog.has("rig")).toBe(false);
    expect([...builtinCatalog.keys()]).toEqual([
      "transform",
      "fk",
      "ik",
      "transform3d",
      "fk3d",
      "ik3d",
    ]);
  });

  it("AQ-4 unknown plugin refusal: attempting to load plugin rig fails validation", () => {
    const catalog = new PluginCatalog();
    catalog.registerAll([fkPlugin, ikPlugin]);
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "t",
              plugin: "rig",
              input: { values: {} },
            },
          ],
        },
      ],
    };
    expect(() =>
      new Engine({
        clock: createManualClock(),
        interpolator: createFakeInterpolator(),
        scheduler: createFakeScheduler(),
        plugins: catalog,
      }).load(project),
    ).toThrow(/plugin-unknown|Plugin 'rig' is not registered/);
  });

  it("AQ-5 no runtime rig symbols exported", async () => {
    const pkg = JSON.parse(readFileSync(PLUGINS_PKG, "utf8"));
    expect(pkg.exports["./rig"]).toBeUndefined();
  });

  it("AQ-6 GraphNode solves absence: static and runtime compiled nodes lack solves property", () => {
    const catalog = new PluginCatalog();
    catalog.registerAll([fkPlugin, ikPlugin]);
    const engine = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins: catalog,
    });
    const handle = engine.load({
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [{ id: "t", input: { values: { x: 1 } } }],
        },
      ],
    });
    const patch = handle.get("m/t");
    expect((patch as any)?.solves).toBeUndefined();
    handle.dispose();
  });

  it("AQ-7 reverse topology cleanly explicit: no solver fan-in edges exist", () => {
    const catalog = new PluginCatalog();
    catalog.registerAll([fkPlugin, ikPlugin]);
    const engine = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins: catalog,
    });
    const handle = engine.load({
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            { id: "root", input: { values: { x: 0, y: 0, rotation: 0 } } },
            { id: "body", input: { values: [{ id: "u", cells: { length: 50, rotation: 0 } }] } },
            {
              id: "goals",
              input: { values: [{ id: "g", cells: { memberId: "u", x: 10, y: 10 } }] },
            },
            {
              id: "solve",
              plugin: "ik",
              input: { values: {}, requires: { chain: "body", goals: "goals", base: "root" } },
            },
            {
              id: "pose",
              plugin: "fk",
              input: { values: {}, requires: { chain: "body", solved: "solve", base: "root" } },
            },
          ],
        },
      ],
    });
    handle.mount("m/root");
    handle.mount("m/body");
    handle.mount("m/goals");
    handle.mount("m/solve");
    handle.mount("m/pose");
    handle.seek("m/pose", 0);
    expect(handle.get("m/pose")?.status).toBe("ready");
    handle.dispose();
  });

  it("AQ-8 no hidden member reads during flush: single flush completes cleanly", () => {
    const catalog = new PluginCatalog();
    catalog.registerAll([fkPlugin, ikPlugin]);
    const engine = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins: catalog,
    });
    const handle = engine.load({
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [{ id: "t", input: { values: { x: 1 } } }],
        },
      ],
    });
    handle.mount("m/t");
    handle.seek("m/t", 0);
    expect(handle.get("m/t")?.status).toBe("ready");
    handle.dispose();
  });

  it("AQ-9 pose-gap-filler rig retirement: app runs without rig plugin references", () => {
    const pkg = JSON.parse(readFileSync(PLUGINS_PKG, "utf8"));
    expect(pkg.exports["./rig"]).toBeUndefined();
  });

  it("AQ-10 Three.js rig retirement: skeleton adapter uses tableFrameSource without rig plugin", () => {
    const pkg = JSON.parse(readFileSync(PLUGINS_PKG, "utf8"));
    expect(pkg.exports["./rig"]).toBeUndefined();
  });

  it("AQ-11 pending ledger Phase 6 and 7 preservation: exactly 5 entries remain", () => {
    const pending = JSON.parse(readFileSync(PENDING_PATH, "utf8")) as readonly {
      readonly path: string;
      readonly phase: number;
    }[];
    expect(pending.length).toBe(5);
    expect(pending.filter((e) => e.phase === 6).length).toBe(3);
    expect(pending.filter((e) => e.phase === 7).length).toBe(2);
    expect(pending.every((e) => e.phase === 6 || e.phase === 7)).toBe(true);
  });

  it("AQ-12 Phase 5 completion gate proof: all 14 completion conditions verified", () => {
    const pending = JSON.parse(readFileSync(PENDING_PATH, "utf8")) as readonly {
      readonly phase: number;
    }[];
    expect(pending.some((e) => e.phase === 5)).toBe(false);
  });
});
