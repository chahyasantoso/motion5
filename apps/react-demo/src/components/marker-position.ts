import type { LivePatch, PatchDerivation, PatchSource, PatchValues } from "@motion5/react";

/** A published frame's position, with an absent key read as `0` as every frame reader does. */
export function point(values: PatchValues): { x: number; y: number } {
  return { x: Number(values.x ?? 0), y: Number(values.y ?? 0) };
}

/** The position-only projection keeps marker children, including labels, in their own frame. */
export const nodePosition: PatchDerivation = ([node = {}]) => point(node);

function isFlatRecord(value: unknown): value is PatchValues {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function selectRowValues(output: unknown, rowId: string): PatchValues | undefined {
  if (isFlatRecord(output)) return output;
  if (!Array.isArray(output)) return undefined;
  const row = output.find((candidate) => candidate.id === rowId);
  return row === undefined || !isFlatRecord(row.cells) ? undefined : row.cells;
}

export function createRowPatchSource(
  source: PatchSource,
  poseNodeId: string,
  armsPoseNodeId?: string,
): PatchSource {
  const resolvePoseId = (boneId: string): string => {
    if (["armL_upper", "armL_lower", "armR_upper", "armR_lower"].includes(boneId)) {
      return armsPoseNodeId ?? "walk/arms-pose";
    }
    return poseNodeId;
  };

  const transformPatch = (patch: LivePatch | undefined, boneId: string): LivePatch | undefined => {
    if (!patch) return undefined;
    if (patch.status !== "ready") {
      return patch as LivePatch;
    }
    const rowCells = selectRowValues(patch.outputs.values, boneId);
    if (!rowCells) {
      return { ...patch, status: "blocked" };
    }
    return {
      ...patch,
      nodeId: `walk/${boneId}`,
      outputs: { values: rowCells as Readonly<Record<string, number | string | boolean>> },
    };
  };

  return {
    get(nodeId: string) {
      if (nodeId === "walk/pelvis" || source.get(nodeId) !== undefined) {
        return source.get(nodeId);
      }
      if (nodeId.startsWith("walk/")) {
        const boneId = nodeId.slice(5);
        const poseId = resolvePoseId(boneId);
        const posePatch = source.get(poseId);
        return transformPatch(posePatch, boneId);
      }
      return source.get(nodeId);
    },
    subscribeNode(nodeId: string, listener) {
      if (nodeId === "walk/pelvis" || source.get(nodeId) !== undefined) {
        return source.subscribeNode(nodeId, listener);
      }
      if (nodeId.startsWith("walk/")) {
        const boneId = nodeId.slice(5);
        const poseId = resolvePoseId(boneId);
        return source.subscribeNode(poseId, (patch) => {
          const next = transformPatch(patch as LivePatch, boneId);
          if (next) listener(next);
        });
      }
      return source.subscribeNode(nodeId, listener);
    },
  };
}
