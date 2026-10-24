import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { StaleTrackHandleError } from "../../src/contract/track-handle";
import type { PluginDefinition, ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { record } from "../support/v5-builders";

function ramp(from: number, to: number) {
  return [
    { p: 0, v: from },
    { p: 1, v: to },
  ];
}
const LINK: PluginDefinition = {
  id: "link",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      parent: {
        outputs: { values: { kind: "record", fields: { x: { kind: "number" } } } },
      },
    },
  },
  outputs: { values: { kind: "record", fields: { x: { kind: "number" } } } },
  transform() {
    return { values: [] };
  },
};
function catalog(): PluginCatalog {
  const plugins = new PluginCatalog();
  plugins.register(LINK);
  return plugins;
}
function track(id: string, from: number, to: number, parent?: string): TrackDefinition {
  if (parent === undefined) return { id, input: { values: record({ x: ramp(from, to) }) } };
  return {
    id,
    plugin: LINK.id,
    input: { values: record({}), requires: { parent } },
  };
}
function makeHandle(project: ProjectDefinition = { schemaVersion: 5, motions: [] }) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: catalog(),
  }).load(project);
}

describe("unified runtime mutation surface (W5)", () => {
  it("ingests authored tracks into the removable store without auto-mounting", () => {
    const handle = makeHandle({
      schemaVersion: 5,
      motions: [{ id: "scene", trigger: { type: "manual" }, tracks: [track("arm", 0, 100)] }],
      freeTracks: [track("free", 0, 50)],
    });
    expect(handle.get("scene/arm")).toBeUndefined();
    expect(() => handle.destroyMotion("scene")).toThrow(/still has/);
    const authored = handle.track("scene/arm");
    const free = handle.track("~/free");
    expect(authored.definition.id).toBe("arm");
    expect(free.definition.id).toBe("free");
    expect(() => handle.mount("scene/arm")).not.toThrow();
    expect(() => handle.mount("~/free")).not.toThrow();
    authored.remove();
    free.remove();
    expect(() => handle.destroyMotion("scene")).not.toThrow();
    handle.dispose();
  });
  it("returns a capability handle and refuses stale ABA handles", () => {
    const handle = makeHandle();
    const first = handle.addTrack(track("arm", 0, 100));
    first.remove();
    const second = handle.addTrack(track("arm", 0, 200));
    // Migrated with ADR-056. This case used to call `first.remove()` a second time and rely on the
    // silent no-op; the guarantee it was really about is unchanged -- a stale handle cannot reach
    // the node that reused its id -- but the handle now says so instead of pretending it worked.
    expect(first.live).toBe(false);
    expect(() => first.remove()).toThrow(StaleTrackHandleError);
    handle.seek(second.id, 1);
    const idPatch = handle.get(second.id);
    if (idPatch?.status !== "ready")
      throw new Error(`idPatch is ${idPatch?.status ?? "absent"}, not ready.`);
    expect(idPatch.outputs.values).toEqual({ x: 200 });
    expect(second.live).toBe(true);
    second.remove();
    handle.dispose();
  });
  it("replaces a track non-destructively and preserves subscriber identity", () => {
    const handle = makeHandle();
    const handleForTrack = handle.addTrack(track("arm", 0, 100));
    const seen: string[] = [];
    handle.subscribeNode(handleForTrack.id, (patch) => seen.push(patch.status));
    handle.seek(handleForTrack.id, 1);
    const beforeRevision = handle.get(handleForTrack.id)?.revision ?? 0;
    handleForTrack.replace(track("arm", 0, 250));
    handle.seek(handleForTrack.id, 1);
    const idPatch2 = handle.get(handleForTrack.id);
    if (idPatch2?.status !== "ready")
      throw new Error(`idPatch2 is ${idPatch2?.status ?? "absent"}, not ready.`);
    expect(idPatch2.outputs.values).toEqual({ x: 250 });
    expect(handle.get(handleForTrack.id)?.revision).toBeGreaterThan(beforeRevision);
    expect(seen).not.toContain("destroyed");
    handleForTrack.remove();
    handle.dispose();
  });
  it("reads dependants from the committed graph and rejects source removal", () => {
    const handle = makeHandle();
    const root = handle.addTrack(track("root", 0, 100));
    const child = handle.addTrack(track("child", 0, 50, root.id));
    expect(handle.dependantsOf(root.id)).toEqual([child.id]);
    expect(() => root.remove()).toThrow(/edge-unknown-source|depend/);
    expect(handle.dependantsOf(root.id)).toEqual([child.id]);
    child.remove();
    root.remove();
    handle.dispose();
  });
});
