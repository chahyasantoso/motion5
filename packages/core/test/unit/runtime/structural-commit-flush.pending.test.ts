import { describe, expect, it } from "vitest";
import type {
  MotionDefinition,
  PluginDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";
import { record, track } from "../../support/v5-builders";

const MOTION_ID = "hero";
const ARM_ID = "hero/arm";
const LEG_ID = "hero/leg";
const HAND_ID = "hero/hand";
const CURSOR_ID = "~/cursor";
const DEMO: PluginDefinition = {
  id: "demo",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      chain: {
        outputs: { values: { kind: "table", schema: { row: { fields: {} } } } },
        optional: true,
      },
    },
  },
  outputs: { values: { kind: "table", schema: { row: { fields: {} } } } },
  transform() {
    return { values: [] };
  },
};
const CATALOG = new PluginCatalog();
CATALOG.register(DEMO);
const MOTION: MotionDefinition = {
  id: MOTION_ID,
  trigger: { type: "manual" },
  tracks: [track({ id: "arm" }), track({ id: "leg" })],
};
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [MOTION],
  freeTracks: [track({ id: "cursor" })],
};
/** Reads a node the graph accepted and nothing mounted, so its source publishes nothing. */
const PENDING_TRACK: TrackDefinition = track({
  id: "hand",
  plugin: "demo",
  values: record({}),
  requires: { chain: CURSOR_ID },
});
const compose = (node: { id: string }) => () => ({
  outputs: { values: { [node.id]: 1 } },
  sourceProgress: 0,
  sourceRevisions: {},
});

function create(): ProjectRuntime {
  return new ProjectRuntime(PROJECT, {
    clock: createManualClock(),
    compose,
    capabilities: CATALOG,
    isPluginRegistered: (pluginId) => CATALOG.isPluginAdmitted(pluginId),
  });
}

describe("a structural commit ends at one flush", () => {
  it("RA-9 lands a new node on blocked when its source has published nothing", () => {
    const runtime = create();
    try {
      const registry = runtime.graph.registry;

      runtime.addTrack(PENDING_TRACK, { motionId: MOTION_ID });

      // The blast radius, stated as evidence rather than as a footnote: this node previously
      // published nothing at all, and a pending upstream is what it publishes instead.
      const patch = registry.get(HAND_ID);
      expect(patch?.status).toBe("blocked");
      if (patch?.status !== "blocked")
        throw new Error(`${HAND_ID} is ${patch?.status ?? "absent"}, not blocked.`);
      expect(patch.diagnostics[0]?.ruleId).toBe("source-pending");
      // And the diagnostic reaches the one inspection surface, by identity, so a structural commit
      // cannot flush a diagnosis into nowhere.
      expect(runtime.diagnostics.entries).toHaveLength(1);
      expect(runtime.diagnostics.entries[0]).toBe(patch.diagnostics[0]);
    } finally {
      runtime.dispose();
    }
  });

  it("RA-11 seeds exactly one flush per structural commit, and none for a no-op", () => {
    const runtime = create();
    try {
      runtime.mount(ARM_ID);
      const before = runtime.graph.sequence;

      runtime.addTrack(track({ id: "hand", plugin: "demo", values: record({}) }), {
        motionId: MOTION_ID,
      });
      expect(runtime.graph.sequence).toBe(before + 1);

      runtime
        .track(HAND_ID)
        .replace(track({ id: "hand", plugin: "demo", values: record({}), duration: 250 }));
      expect(runtime.graph.sequence).toBe(before + 2);

      // A binding edit is one replacement, so it is one flush rather than two.
      runtime.track(HAND_ID).input.requires.set("chain", CURSOR_ID);
      expect(runtime.graph.sequence).toBe(before + 3);

      // Binding the source it already reads is a no-op, so it seeds nothing.
      runtime.track(HAND_ID).input.requires.set("chain", CURSOR_ID);
      expect(runtime.graph.sequence).toBe(before + 3);
    } finally {
      runtime.dispose();
    }
  });
});
