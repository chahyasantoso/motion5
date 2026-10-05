import type { PluginDefinition } from "@motion5/core/plugin-api";
import { isRecord, readFrame3d, type WorldFrame3d } from "./frame3d";

export type RigPose = Readonly<Record<string, WorldFrame3d>>;
export type RigControls = Readonly<Record<string, Readonly<{ x: number; y: number; z: number }>>>;
export type RigValues = Readonly<{ pose: RigPose; controls: RigControls }>;

function readMembers<T>(input: unknown, read: (member: unknown) => T): Readonly<Record<string, T>> {
  if (!isRecord(input)) return {};
  // fromEntries preserves even "__proto__" as an own data property, not a prototype setter.
  return Object.fromEntries(
    Object.keys(input)
      .sort()
      .map((key) => [key, read(input[key])]),
  );
}

function readPoint(member: unknown): Readonly<{ x: number; y: number; z: number }> {
  const { x, y, z } = readFrame3d(member);
  return { x, y, z };
}

/**
 * The one decoder of a rig's published values. Absent dictionaries decode to empty records;
 * present bones with absent frame keys use readFrame3d's zero defaults.
 */
export function readRigValues(values: unknown): RigValues {
  const record = isRecord(values) ? values : {};
  return {
    pose: readMembers(record.pose, readFrame3d),
    controls: readMembers(record.controls, readPoint),
  };
}

/**
 * Aggregates only bound world frames and points. No solver, limits or rendering serializer:
 * consumers observe this data track through their declared `requires.rig` graph edge (ADR-138).
 * An entirely unbound group is not selected by the registry and publishes no pose key.
 */
export const rigPlugin: PluginDefinition = {
  name: "rig",
  keys: [],
  stage: "compose",
  outputs: ["pose", "controls"],
  requirements: {
    bones: { description: "rig bone key to a track publishing its world frame", dict: true },
    controls: { description: "rig control key to a track publishing a 3D point", dict: true },
  },
  compose: (_values, _progress, inputs) => ({
    pose: readMembers(inputs.bones, readFrame3d),
    controls: readMembers(inputs.controls, readPoint),
  }),
};
