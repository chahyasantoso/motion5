import { describe, expect, it } from "vitest";
import type { AuthoredEntryRecord } from "../../../src/contract/v5";
import type { ResolvedPlugins } from "../../../src/domain/plugins";
import {
  PluginRegistry,
  type PluginDefinition,
  type RequirementInputs,
} from "../../../src/domain/plugins";
import {
  compileTrackExecutionPlan,
  type TrackExecutionPlan,
} from "../../../src/domain/execution-plan";
import { Track } from "../../../src/domain/track";
import { createPoseClassifyPlugin } from "@motion5/plugins/pose-classify";
import { transformPlugin } from "@motion5/plugins/transform";
import { transform3dPlugin } from "@motion5/plugins/transform3d";
import { rigPlugin } from "@motion5/plugins/rig";
import { fkPlugin } from "@motion5/plugins/fk";
import { ikPlugin } from "@motion5/plugins/ik";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";

/**
 * Slice C7: the one runner reproduces `Track.composeFrom` for every plugin still on the legacy
 * compose channel. Each case is the same fixture answered twice, by a Track with the compiled plan
 * (the executor's `legacy-compose` arm) and by a Track without one (the pre-switch loop). These
 * cases are deleted by the slice that migrates each plugin, so the list is the channel's inventory.
 *
 * Maintained fixtures checked while writing this suite: `packages/core/test/fixtures/
 * skeldata-fixtures.ts` and the joined-layout suites keep `point`/`root`/`join` on their own tracks
 * and never co-author a compose plugin there, so no maintained case mixes the two channels.
 */
/** Authored keyframes are an array of singleton maps, one entry per element. */
type AuthoredKeyframes = readonly AuthoredEntryRecord[];

interface ParityCase {
  readonly id: string;
  readonly plugins: readonly PluginDefinition[];
  readonly keyframes: AuthoredKeyframes;
  readonly seed: Readonly<Record<string, unknown>>;
  readonly inputs?: RequirementInputs;
}

const poseClassifyPlugin = createPoseClassifyPlugin({
  templates: [
    {
      label: "idle",
      pose: { wrist: { rotation: 0, rotationX: 0, rotationY: 0 } },
    },
  ],
  maxDistance: 10,
});

const CASES: readonly ParityCase[] = [
  {
    id: "transform",
    plugins: [transformPlugin],
    keyframes: [{ e: { plugin: "transform", values: { x: 10, y: 20, rotation: 30 } } }],
    seed: { x: 10, y: 20, rotation: 30 },
  },
  {
    id: "transform3d",
    plugins: [transform3dPlugin],
    keyframes: [
      {
        e: {
          plugin: "transform3d",
          values: { x: 1, y: 2, z: 3, rotation: 4, rotationX: 5, rotationY: 6 },
        },
      },
    ],
    seed: { x: 1, y: 2, z: 3, rotation: 4, rotationX: 5, rotationY: 6 },
  },
  {
    id: "rig",
    plugins: [rigPlugin],
    keyframes: [
      {
        e: {
          plugin: "rig",
          requires: { bones: { wrist: "bone" }, controls: { goal: "bone" } },
        },
      },
    ],
    seed: {},
    inputs: { rig: { bones: {}, controls: {} } },
  },
  {
    id: "pose-classify",
    plugins: [poseClassifyPlugin],
    keyframes: [{ e: { plugin: "pose-classify", requires: { rig: "rig" } } }],
    seed: {},
    inputs: {
      "pose-classify": { rig: { pose: { wrist: { rotation: 5, rotationX: 0, rotationY: 0 } } } },
    },
  },
  {
    id: "fk",
    plugins: [fkPlugin],
    keyframes: [{ e: { plugin: "fk", values: { length: 60, rotation: 20 } } }],
    seed: { length: 60, rotation: 20 },
    inputs: { fk: { base: { x: 10, y: 20, rotation: 5 } } },
  },
  {
    id: "ik",
    plugins: [ikPlugin],
    keyframes: [{ e: { plugin: "ik", values: { flip: 1 } } }],
    seed: { flip: 1 },
    inputs: {
      ik: {
        root: { x: 200, y: 300, rotation: 0 },
        target: { x: 320, y: 340, rotation: 0 },
        members: [
          { id: "upper", base: "shoulder", values: { length: 80 }, progress: 0 },
          { id: "fore", base: "upper", values: { length: 60 }, progress: 0 },
        ],
      },
    },
  },
  {
    id: "fk3d",
    plugins: [fk3dPlugin],
    keyframes: [{ e: { plugin: "fk3d", values: { length: 60, rotation: 20 } } }],
    seed: { length: 60, rotation: 20 },
  },
  {
    id: "ik3d",
    plugins: [ik3dPlugin],
    keyframes: [{ e: { plugin: "ik3d", values: { inspect: true } } }],
    seed: { inspect: true },
    inputs: {
      ik3d: {
        root: { x: 5, y: -3, z: 2, rotation: 25, rotationX: -15, rotationY: 20 },
        target: { x: 40, y: 10, z: 0 },
        members: [
          { id: "upper", base: "root", values: { length: 80 }, progress: 0 },
          { id: "fore", base: "upper", values: { length: 60 }, progress: 0 },
        ],
      },
    },
  },
];

function interpolatorFor(base: Readonly<Record<string, unknown>>) {
  return {
    create: () => {
      let current = 0;
      const state: Record<string, unknown> = { ...base };
      const apply = () => {
        for (const [key, value] of Object.entries(base))
          if (typeof value === "number") state[key] = value + current * 10;
      };
      apply();
      return {
        duration: 1,
        state,
        progress(value?: number) {
          if (value === undefined) return current;
          current = value;
          apply();
          return current;
        },
        kill() {},
      };
    },
  };
}

function compileCase(testCase: ParityCase): {
  readonly plan: TrackExecutionPlan;
  readonly resolved: ResolvedPlugins;
} {
  const registry = new PluginRegistry();
  registry.registerAll([...testCase.plugins]);
  const plan = compileTrackExecutionPlan({
    keyframes: testCase.keyframes,
    registry,
    trackId: "~/parity",
  });
  expect(plan.diagnostics.filter(({ severity }) => severity === "error")).toEqual([]);
  const resolved = registry.resolveForKeyframes(testCase.keyframes, "~/parity.keyframes", {
    id: "parity",
  });
  return { plan, resolved };
}

function trackFor(
  resolved: ResolvedPlugins,
  plan: TrackExecutionPlan | undefined,
  seed: Readonly<Record<string, unknown>>,
): Track {
  return new Track({
    interpolator: interpolatorFor(seed),
    plugins: resolved,
    nodeId: "~/parity",
    ...(plan === undefined ? {} : { plan }),
  });
}

describe("Slice C7: legacy-compose parity with the pre-switch Track.compose", () => {
  it.each(CASES)("C7-P-$id publishes the same record through the executor", (testCase) => {
    const { plan, resolved } = compileCase(testCase);
    expect(plan.entries).toHaveLength(1);
    expect(plan.entries.every((entry) => entry.execution.kind === "legacy-compose")).toBe(true);

    for (const progress of [0, 0.5, 1]) {
      const throughExecutor = trackFor(resolved, plan, testCase.seed);
      const preSwitch = trackFor(resolved, undefined, testCase.seed);
      throughExecutor.setProgress(progress);
      preSwitch.setProgress(progress);
      const inputs = testCase.inputs ?? {};
      const published = throughExecutor.compose(inputs);
      expect(published).toEqual(preSwitch.compose(inputs));
      // Both paths publish through the one filter, so parity alone cannot catch a filter
      // regression. These two invariants are the independent half of the case.
      expect(Object.isFrozen(published.values)).toBe(true);
      for (const key of Object.keys(published.values)) {
        expect(key.includes(":")).toBe(false);
        expect(resolved.internalKeys.includes(key)).toBe(false);
      }
    }
  });

  it("C7-P-chain lets a later compose replace an earlier record", () => {
    const testCase: ParityCase = {
      id: "transform+rig",
      plugins: [transformPlugin, rigPlugin],
      keyframes: [
        { t: { plugin: "transform", values: { x: 1, y: 2, rotation: 3 } } },
        {
          r: {
            plugin: "rig",
            requires: { bones: { wrist: "bone" }, controls: { goal: "bone" } },
          },
        },
      ],
      seed: { x: 1, y: 2, rotation: 3 },
      inputs: { rig: { bones: {}, controls: {} } },
    };
    const { plan, resolved } = compileCase(testCase);
    expect(plan.entries).toHaveLength(2);

    const throughExecutor = trackFor(resolved, plan, testCase.seed).compose(testCase.inputs!);
    const preSwitch = trackFor(resolved, undefined, testCase.seed).compose(testCase.inputs!);

    expect(throughExecutor).toEqual(preSwitch);
    expect(throughExecutor.values).toEqual({ pose: {}, controls: {} });
    expect(throughExecutor.values).not.toHaveProperty("x");
  });
});
