import type { PluginDefinition } from "../domain/plugins";
import type { ImmutableValue } from "../domain/values";

export function composeWorld(
  parent: { x: number; y: number; rotation: number },
  local: { x: number; y: number; rotation: number },
): { x: number; y: number; rotation: number } {
  const rad = (parent.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: parent.x + (local.x * cos - local.y * sin),
    y: parent.y + (local.x * sin + local.y * cos),
    rotation: parent.rotation + local.rotation,
  };
}

interface WorldFrame {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

function readNumber(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

/**
 * Reads the `base` slot as a world-space frame, defaulting every component to zero.
 *
 * The unbound case belongs to the plugin rather than to the schema: `fk.requires.base` is optional,
 * so a root bone authored with no binding composes against the origin instead of failing to load.
 */
function readBase(input: ImmutableValue | undefined): WorldFrame {
  if (input === null || typeof input !== "object" || Array.isArray(input))
    return { x: 0, y: 0, rotation: 0 };
  const record = input as Readonly<Record<string, unknown>>;
  return {
    x: readNumber(record.x),
    y: readNumber(record.y),
    rotation: readNumber(record.rotation),
  };
}

/**
 * Forward kinematics for one bone.
 *
 * The claimed keys are the natural `length` and `rotation`, not the `boneLength` and `boneRotation`
 * they replace. Those names existed only because `transformPlugin` already owned `rotation` in one
 * global key map and registration refused a second claimant. Ownership is per plugin now, and the
 * authored group names the owner, so a bone is authored `fk: { length, rotation }` and a root
 * `transform: { x, y, rotation }`. See ADR-043.
 *
 * The parent frame arrives through the plugin-owned `base` requirement rather than through three
 * flat `parentX`, `parentY`, and `parentRotation` inputs an author had to produce with a projection
 * map. The slot is scoped to this plugin, so the source keeps its natural `x`, `y`, and `rotation`
 * names and none of them can collide with this bone's own authored values. That is why `rotation`
 * can be both an authored local value and an observed parent value in one composition, without a
 * global input-collision guard and without either one being renamed. See ADR-044.
 *
 * `rotation` is claimed and produced. The authored value is this bone's rotation relative to its
 * parent, and the composed one is its rotation in world space, which is what a child observes and
 * what a renderer writes. Nothing downstream reads the local value, so it is replaced rather than
 * published beside its own result.
 *
 * An authored `x` and `y` offset this bone's pivot from its parent's frame. Both default to zero,
 * so a bone authored before slice A of issue #195 composes exactly the frame it always composed.
 * The offset is read in the parent's rotated space rather than in world space, because a pivot that
 * stopped following its parent when the parent turned would not be a pivot.
 *
 * Claiming them costs their flat spelling, which is stated rather than discovered: `transform`
 * claims `x` and `y` as well, so a flat `x` is `plugin-ambiguous-key` and an author names the owner
 * by authoring inside a group, exactly as a flat `rotation` already required. See ADR-043.
 */
export const fkPlugin: PluginDefinition = {
  name: "fk",
  keys: ["x", "y", "length", "rotation"],
  requirements: {
    base: { description: "the parent bone or root this bone hangs from" },
    solver: { description: "the IK solver providing solved rotation override" },
  },
  stage: "compose",
  outputs: ["x", "y", "rotation"],
  compose: (values, _progress, inputs, nodeId) => {
    let rotation = readNumber(values.rotation);
    if (
      inputs.solver !== null &&
      typeof inputs.solver === "object" &&
      !Array.isArray(inputs.solver)
    ) {
      const solverRecord = inputs.solver as Readonly<Record<string, unknown>>;
      const rotations = solverRecord.rotations;
      if (
        rotations !== null &&
        typeof rotations === "object" &&
        !Array.isArray(rotations) &&
        typeof (rotations as Record<string, unknown>)[nodeId] === "number"
      ) {
        rotation = (rotations as Record<string, unknown>)[nodeId] as number;
      }
    }
    // The pivot, then the extension. Two rotate-then-translates, and `composeWorld` owns both, so
    // the trigonometry lives in one place instead of being copied here beside an export nothing
    // called. The extension is purely along the bone's own direction, which is why its local frame
    // carries `length` on `x` and nothing on `y` or `rotation`.
    const pivot = composeWorld(readBase(inputs.base), {
      x: readNumber(values.x),
      y: readNumber(values.y),
      rotation,
    });
    return composeWorld(pivot, { x: readNumber(values.length), y: 0, rotation: 0 });
  },
};
