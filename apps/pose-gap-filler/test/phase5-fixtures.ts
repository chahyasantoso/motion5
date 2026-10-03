import type { PatchBatch, TrackHandle, ValueTransaction } from "@motion5/core";
import { LIMBS, jointRecord, type JointId } from "../src/filler/landmarks";
import { WORLD_SPACE } from "../src/filler/space";
import { add, type Vec } from "../src/filler/vec";
import { createGapFiller } from "../src/filler/gap-filler";
import { loadWorldRig } from "../src/rig/rig";
import { limbTracks, poseNodeId } from "../src/rig/tracks";
import { createWorldWriter, type ValueBatchPort } from "../src/rig/writer";
import { fakePorts } from "./engine";
import { frameOf, trustedOf } from "./frames";

/** Independent fixed-length FK fixture: two authored segment vectors, no Motion5 solve. */
export function bendPose(angle: number, shift: Vec = [0, 0, 0]): Record<JointId, Vec> {
  const points = jointRecord(() => [0, 0, 0] as Vec);
  for (const limb of LIMBS) {
    const sign = limb.id.startsWith("left") ? 1 : -1;
    const root = add(
      [sign * (limb.id.endsWith("arm") ? 200 : 120), limb.id.endsWith("arm") ? -400 : 0, 0],
      shift,
    );
    const upper = [sign * 60 * Math.cos(angle), 80, 60 * Math.sin(angle)];
    const lower = [-upper[0]!, 80, -upper[2]!];
    points[limb.root] = root;
    points[limb.middle] = add(root, upper);
    points[limb.tip] = add(points[limb.middle], lower);
  }
  return points;
}

export type StagedWrite = readonly [node: string, value: unknown];
const EMPTY: PatchBatch = { tick: 0, seeds: [], patches: [], diagnostics: [] };
export function recordingValues(delegate?: ValueBatchPort) {
  const batches: StagedWrite[][] = [];
  let fail = false;
  return {
    batches,
    setFail(value: boolean) {
      fail = value;
    },
    port: {
      values(recipe) {
        const writes: StagedWrite[] = [];
        recipe({
          setValues(node: string, values: object) {
            writes.push([node, values]);
            return EMPTY;
          },
          track(node: string) {
            return {
              setKeyframe(plugin: string, key: string, value: unknown) {
                writes.push([`${node}:${plugin}.${key}`, value]);
                return EMPTY;
              },
            } as unknown as TrackHandle;
          },
        } as unknown as ValueTransaction);
        batches.push(writes);
        if (fail) throw new Error("publication failed");
        return delegate === undefined ? EMPTY : delegate.values(recipe);
      },
    } satisfies ValueBatchPort,
  };
}

/** Full legacy evidence: write order/values, outcomes, failure/retry and all publication bytes. */
export function legacyTrace(factory: typeof createWorldWriter = createWorldWriter) {
  const project = loadWorldRig(fakePorts());
  const recorded = recordingValues(project);
  const writer = factory(recorded.port);
  const filler = createGapFiller({ kind: "hold" });
  const trace: unknown[] = [];
  const lengths = { length: () => 100 };
  const frames = [
    { t: 0, angle: 0, gaps: [] },
    { t: 20, angle: 0.3, gaps: ["left-elbow", "right-knee"] },
    { t: 40, angle: Math.PI, gaps: [], fail: true },
    { t: 40, angle: Math.PI, gaps: [] },
    { t: 60, angle: Math.PI, gaps: ["left-elbow", "right-elbow", "left-knee", "right-knee"] },
    { t: 600, angle: 0, gaps: ["left-shoulder", "left-wrist", "right-hip", "right-ankle"] },
    { t: 700, angle: 0, gaps: [] },
  ];
  try {
    for (const fixture of frames) {
      const trusted = trustedOf(
        frameOf(
          bendPose(fixture.angle, [fixture.t / 10, 0, fixture.t / 20]),
          fixture.t,
          WORLD_SPACE,
        ),
        fixture.gaps as JointId[],
      );
      const filled = filler.fill(trusted, lengths);
      recorded.setFail(fixture.fail ?? false);
      let outcome: unknown;
      try {
        outcome = writer.write(filled, trusted, lengths);
      } catch (error) {
        outcome = String(error);
      }
      trace.push({
        tMs: fixture.t,
        writes: recorded.batches.at(-1),
        outcome,
        patches: LIMBS.flatMap((limb) =>
          Object.values(limbTracks(limb.id)).map((id) => project.get(poseNodeId(id))),
        ),
      });
    }
    const missing = trustedOf(frameOf({}, 800, WORLD_SPACE));
    const before = recorded.batches.length;
    const outcome = writer.write(createGapFiller({ kind: "raw" }).fill(missing), missing, lengths);
    trace.push({ outcome, addedBatches: recorded.batches.length - before });
    const unknown = trustedOf(frameOf(bendPose(0), 900, WORLD_SPACE));
    trace.push({
      outcome: writer.write(createGapFiller({ kind: "raw" }).fill(unknown), unknown, {
        length: () => undefined,
      }),
    });
    // Match the JSON representation of undefined patch fields in the stored baseline fixture.
    return JSON.parse(JSON.stringify(trace)) as unknown;
  } finally {
    project.dispose();
  }
}
