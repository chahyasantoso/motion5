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

function readNumber(value: unknown): number {
  return typeof value === "number" ? value : 0;
}

/**
 * Reads the `base` slot as a world-space frame, defaulting every component to zero.
 *
 * The unbound case belongs to the plugin rather than to the schema: `fk.requires.base` is optional,
 * so a root bone authored with no binding composes against the origin instead of failing to load.
 */
function readBase(input: ImmutableValue | undefined): {
  x: number;
  y: number;
  rotation: number;
} {
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
 * can be both an authored local value and an observed parent value in the same composition. See
 * ADR-044.
 *
 * `rotation` is claimed and produced. The authored value is this bone's rotation relative to its
 * parent, and the composed one is its rotation in world space, which is what a child observes and
 * what a renderer writes. Nothing downstream reads the local value, so it is replaced rather than
 * published beside its own result.
 */
export const fkPlugin: PluginDefinition = {
  name: "fk",
  keys: ["length", "rotation"],
  requirements: {
    base: { description: "the parent bone or root this bone hangs from" },
  },
  stage: "compose",
  outputs: ["x", "y", "rotation"],
  compose: (values, progress, inputs) => {
    const base = readBase(inputs.base);
    const length = readNumber(values.length);
    const localRotation = readNumber(values.rotation);

    // Rotate-then-translate: the authored rotation controls THIS bone's direction from its parent.
    const worldRotation = base.rotation + localRotation;
    const rad = (worldRotation * Math.PI) / 180;

    return {
      x: base.x + length * Math.cos(rad),
      y: base.y + length * Math.sin(rad),
      rotation: worldRotation,
    };
  },
};
