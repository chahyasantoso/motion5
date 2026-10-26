import { isRecord, readFrame3d, type WorldFrame3d } from "../frame3d";

export type RigPose = Readonly<Record<string, WorldFrame3d>>;
export type RigControls = Readonly<Record<string, Readonly<{ x: number; y: number; z: number }>>>;
export type RigValues = Readonly<{ pose: RigPose; controls: RigControls }>;

export function readMembers<T>(
  input: unknown,
  read: (member: unknown) => T,
): Readonly<Record<string, T>> {
  if (!isRecord(input)) return {};
  // fromEntries preserves even "__proto__" as an own data property, not a prototype setter.
  return Object.fromEntries(
    Object.keys(input)
      .sort()
      .map((key) => [key, read(input[key])]),
  );
}

export function readPoint(member: unknown): Readonly<{ x: number; y: number; z: number }> {
  const { x, y, z } = readFrame3d(member);
  return { x, y, z };
}

/** The one decoder of a legacy rig's grouped values. */
export function readRigValues(values: unknown): RigValues {
  const record = isRecord(values) ? values : {};
  return {
    pose: readMembers(record.pose, readFrame3d),
    controls: readMembers(record.controls, readPoint),
  };
}
