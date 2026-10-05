import { describe, expect, it } from "vitest";
import { Engine, PluginRegistry, createManualClock, type TrackDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { builtinCatalog } from "../../src/catalog";
import { createPluginLoader, ensuredOrThrow } from "../../src/loader";

const fkTrack: TrackDefinition = {
  id: "bone",
  keyframes: {
    fk: { values: { length: 20, rotation: 0 }, requires: { base: "~/root" } },
  },
};

async function load() {
  const plugins = new PluginRegistry();
  const loader = createPluginLoader(builtinCatalog);
  const definition = {
    schemaVersion: 5 as const,
    motions: [],
    freeTracks: [{ id: "root", keyframes: { transform: { values: { x: 10, y: 15 } } } }],
  };
  ensuredOrThrow(await loader.ensure(plugins, { kind: "project", project: definition }));
  const project = new Engine({
    plugins,
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load(definition);
  project.mount("~/root");
  return { plugins, loader, project };
}

describe("ensure before synchronous live edits", () => {
  // E1: a failed add cannot grow the graph or load a plugin implicitly.
  it("refuses an unseen plugin without changing the registry or free track ids", async () => {
    const { plugins, project } = await load();
    try {
      const before = project.get("~/root");
      expect(plugins.size).toBe(1);
      expect(() => project.addTrack(fkTrack)).toThrow(/No registered plugin is named "fk"/);
      expect(project.freeTrackIds()).toEqual(["~/root"]);
      expect(project.get("~/root")).toBe(before);
      expect(plugins.has("fk")).toBe(false);
      expect(plugins.size).toBe(1);
    } finally {
      project.dispose();
    }
  });

  // E2: ensure adds to the registry the already-loaded Engine holds by reference.
  it("publishes a ready FK track after explicitly ensuring its demand", async () => {
    const { plugins, loader, project } = await load();
    try {
      expect(
        ensuredOrThrow(await loader.ensure(plugins, { kind: "tracks", tracks: [fkTrack] })),
      ).toEqual(["fk"]);
      project.addTrack(fkTrack);
      expect(project.freeTrackIds()).toEqual(["~/root", "~/bone"]);
      expect(project.get("~/bone")).toMatchObject({
        status: "ready",
        values: { x: 30, y: 15, rotation: 0 },
      });
      expect(plugins.size).toBe(2);
    } finally {
      project.dispose();
    }
  });

  // E3: the recipe stays synchronous; its preflight belongs outside the transaction.
  it("rolls back an unseen recipe and commits the same recipe after ensure", async () => {
    const { plugins, loader, project } = await load();
    try {
      const before = project.get("~/root");
      expect(() => project.edit((edit) => edit.addTrack(fkTrack))).toThrow(
        /No registered plugin is named "fk"/,
      );
      expect(project.freeTrackIds()).toEqual(["~/root"]);
      expect(project.get("~/root")).toBe(before);
      expect(plugins.has("fk")).toBe(false);
      ensuredOrThrow(await loader.ensure(plugins, { kind: "tracks", tracks: [fkTrack] }));
      project.edit((edit) => edit.addTrack(fkTrack));
      expect(project.freeTrackIds()).toEqual(["~/root", "~/bone"]);
      expect(project.get("~/bone")).toMatchObject({ status: "ready", values: { x: 30, y: 15 } });
    } finally {
      project.dispose();
    }
  });

  // E4: even a mixed known/unknown demand has no registry or graph side effects.
  it("refuses an unknown plugin before importing or editing the loaded project", async () => {
    const { plugins, loader, project } = await load();
    try {
      const before = project.get("~/root");
      const unknown: TrackDefinition = {
        id: "unknown",
        keyframes: { unapproved: { values: { value: 1 } } },
      };
      const result = await loader.ensure(plugins, {
        kind: "tracks",
        tracks: [fkTrack, unknown],
      });
      expect(result).toEqual({
        kind: "refused",
        failure: {
          kind: "unknown-plugin",
          name: "unapproved",
          path: "tracks[1].keyframes.unapproved",
        },
      });
      expect(plugins.size).toBe(1);
      expect(plugins.has("fk")).toBe(false);
      expect(project.freeTrackIds()).toEqual(["~/root"]);
      expect(project.get("~/root")).toBe(before);
    } finally {
      project.dispose();
    }
  });
});
