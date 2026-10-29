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
          track(node: string) {
            return {
              input: {
                values: {
                  setField(address: { readonly field: string }, value: unknown) {
                    writes.push([`${node}.${address.field}`, value]);
                    return EMPTY;
                  },
                  set(values: unknown) {
                    writes.push([node, values]);
                    return EMPTY;
                  },
                },
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

function legacyFrame(values: Record<string, unknown>, nodeId: string): Record<string, unknown> {
  const result = { ...values };
  delete result.memberId;
  delete result.goalId;
  if (nodeId.endsWith("-goal")) delete result.memberId;
  if (nodeId.endsWith("-goal")) delete result.goalId;
  if (nodeId.endsWith("-goal")) {
    result.rotation ??= 0;
    result.rotationX ??= 0;
    result.rotationY ??= 0;
  }
  return result;
}

function legacyPatch(patch: unknown): unknown {
  if (patch === undefined || patch === null || typeof patch !== "object") return patch;
  const current = patch as Record<string, unknown>;
  const nodeId = String(current.nodeId);
  const outputs = current.outputs;
  if (outputs === null || typeof outputs !== "object") return patch;
  const rawValues = (outputs as Record<string, unknown>).values;
  let values: unknown = rawValues;
  if (Array.isArray(rawValues)) {
    const rows = rawValues.filter(
      (row): row is { id: string; cells: Record<string, unknown> } =>
        row !== null &&
        typeof row === "object" &&
        typeof (row as { id?: unknown }).id === "string" &&
        (row as { cells?: unknown }).cells !== null &&
        typeof (row as { cells?: unknown }).cells === "object",
    );
    if (nodeId.endsWith("-solve")) {
      const rotations: Record<string, unknown> = {};
      for (const row of rows)
        rotations[`pose/${row.id}`] = {
          rotation: row.cells.rotation,
          rotationX: row.cells.rotationX,
          rotationY: row.cells.rotationY,
        };
      values = { rotations3d: rotations };
    } else {
      const row = rows[0];
      values = row === undefined ? {} : legacyFrame(row.cells, nodeId);
    }
  } else if (rawValues !== null && typeof rawValues === "object") {
    values = legacyFrame(rawValues as Record<string, unknown>, nodeId);
  }
  const sourceRevisions = current.sourceRevisions;
  const normalizedSources =
    sourceRevisions === null || typeof sourceRevisions !== "object"
      ? sourceRevisions
      : Object.fromEntries(
          Object.entries(sourceRevisions as Record<string, unknown>)
            .filter(([id]) => !id.endsWith("-member") && !id.endsWith("-body"))
            .map(([id, revision]) => [id, revision]),
        );
  return { ...current, values, sourceRevisions: normalizedSources, outputs: undefined };
}

function legacyWrite(write: StagedWrite): readonly StagedWrite[] {
  const [node, value] = write;
  if (node.endsWith("-body") && Array.isArray(value)) {
    return value.map((row) => [
      poseNodeId(row.id),
      { length: (row.cells as { length: number }).length },
    ]);
  }
  if (node.endsWith("-goal") && Array.isArray(value)) {
    const row = value[0] as { cells?: Record<string, unknown> } | undefined;
    const cells = row?.cells ?? {};
    return [
      [
        node,
        Object.fromEntries(Object.entries(cells).filter(([key]) => ["x", "y", "z"].includes(key))),
      ],
    ];
  }
  const values = value as Record<string, unknown>;
  if (node.endsWith("-root") || node.endsWith("-pole"))
    return [
      [
        node,
        Object.fromEntries(Object.entries(values).filter(([key]) => ["x", "y", "z"].includes(key))),
      ],
    ];
  return [write];
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
        writes: recorded.batches.at(-1)?.flatMap(legacyWrite),
        outcome,
        patches: LIMBS.flatMap((limb) => {
          const ids = limbTracks(limb.id);
          const rootPatch = project.get(poseNodeId(ids.root));
          const goalPatch = project.get(poseNodeId(ids.goal));
          const polePatch = project.get(poseNodeId(ids.pole));
          const solvePatch = project.get(poseNodeId(ids.solve));
          const posePatch = project.get(poseNodeId(ids.pose));

          const solveRev = solvePatch?.revision;
          const rootRev = rootPatch?.revision;

          const solveClean = legacyPatch(solvePatch);
          if (solveClean && typeof solveClean === "object" && "sourceRevisions" in solveClean) {
            const sr = (solveClean as { sourceRevisions?: Record<string, unknown> })
              .sourceRevisions;
            if (sr) {
              (solveClean as any).sourceRevisions = Object.fromEntries(
                Object.entries(sr).filter(([k]) => !k.endsWith("-body")),
              );
            }
          }

          const poseValues =
            posePatch?.status === "ready" && Array.isArray(posePatch.outputs.values)
              ? posePatch.outputs.values
              : [];
          const upperRow = poseValues.find((r: any) => r.id === ids.upper);
          const lowerRow = poseValues.find((r: any) => r.id === ids.lower);

          const upperPatch = upperRow
            ? {
                nodeId: poseNodeId(ids.upper),
                status: posePatch?.status,
                revision: posePatch?.revision,
                sourceProgress:
                  posePatch?.status === "ready" ? posePatch.sourceProgress : undefined,
                sourceRevisions: {
                  [poseNodeId(ids.root)]: rootRev,
                  [poseNodeId(ids.solve)]: solveRev,
                },
                diagnostics: posePatch?.diagnostics,
                values: upperRow.cells,
              }
            : undefined;

          const lowerPatch = lowerRow
            ? {
                nodeId: poseNodeId(ids.lower),
                status: posePatch?.status,
                revision: posePatch?.revision,
                sourceProgress:
                  posePatch?.status === "ready" ? posePatch.sourceProgress : undefined,
                sourceRevisions: {
                  [poseNodeId(ids.solve)]: solveRev,
                  [poseNodeId(ids.upper)]: solveRev,
                },
                diagnostics: posePatch?.diagnostics,
                values: lowerRow.cells,
              }
            : undefined;

          return [
            legacyPatch(rootPatch),
            legacyPatch(goalPatch),
            legacyPatch(polePatch),
            solveClean,
            legacyPatch(upperPatch),
            legacyPatch(lowerPatch),
          ];
        }),
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
