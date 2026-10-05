import type { PluginDefinition } from "@motion5/core/plugin-api";
import {
  isRecord,
  matrixFromEuler3d,
  multiplyMatrix3,
  transposeMatrix3,
  type Euler3d,
  type Matrix3,
} from "./frame3d";
import { readRigValues } from "./rig";

export interface PoseTemplate {
  readonly label: string;
  readonly pose: Readonly<Record<string, Readonly<Euler3d>>>;
}

export interface PoseClassifyOptions {
  /** Defaults to "pose-classify"; must equal the application's catalog key. */
  readonly name?: string;
  readonly templates: readonly PoseTemplate[];
  /** Inclusive maximum mean geodesic angle in degrees; finite and greater than zero. */
  readonly maxDistance: number;
  readonly unknownLabel?: string;
}

interface PreparedBone {
  readonly key: string;
  readonly inverse: Matrix3;
}

interface PreparedTemplate {
  readonly label: string;
  readonly bones: readonly PreparedBone[];
}

function nonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`Pose classifier ${field} must be a non-empty string.`);
  }
  return value;
}

function finiteAngle(value: unknown, bone: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`Pose classifier bone "${bone}" must declare finite angles.`);
  }
  return value;
}

function prepareTemplate(
  input: unknown,
  unknownLabel: string,
  labels: Set<string>,
): PreparedTemplate {
  if (!isRecord(input)) throw new TypeError("Pose classifier template must be a record.");
  const label = nonEmptyString(input.label, "template label");
  if (labels.has(label)) throw new TypeError(`Pose classifier duplicates label "${label}".`);
  if (label === unknownLabel) {
    throw new TypeError("Pose classifier template label must differ from unknownLabel.");
  }
  const pose = input.pose;
  if (!isRecord(pose) || Object.keys(pose).length === 0) {
    throw new TypeError("Pose classifier template must declare at least one bone.");
  }
  const bones = Object.keys(pose)
    .sort()
    .map((key): PreparedBone => {
      const angles = pose[key];
      if (!isRecord(angles)) {
        throw new TypeError(`Pose classifier bone "${key}" must declare finite angles.`);
      }
      const rotation = finiteAngle(angles.rotation, key);
      const rotationX = finiteAngle(angles.rotationX, key);
      const rotationY = finiteAngle(angles.rotationY, key);
      return Object.freeze({
        key,
        inverse: Object.freeze(
          transposeMatrix3(matrixFromEuler3d({ rotation, rotationX, rotationY })),
        ),
      });
    });
  labels.add(label);
  return Object.freeze({ label, bones: Object.freeze(bones) });
}

function distance(template: PreparedTemplate, actual: ReadonlyMap<string, Matrix3>): number {
  let total = 0;
  for (const bone of template.bones) {
    const matrix = actual.get(bone.key);
    if (matrix === undefined) return Infinity;
    const relative = multiplyMatrix3(bone.inverse, matrix);
    const cosine = (relative[0] + relative[4] + relative[8] - 1) / 2;
    total += (Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI;
  }
  return total / template.bones.length;
}

/**
 * Pure frame-local classification over a required rig, never a stateful estimator or a renderer.
 * Admission copies and freezes template matrices, and precomputes their inverses once. Compose
 * reuses each actual bone matrix across templates; absent bones score Infinity, ties keep the
 * first template. Coordinate conventions and decoding remain with frame3d and readRigValues.
 *
 * This factory is deliberately absent from builtinCatalog: an app's descriptor may fetch weights
 * or templates inside its async load before returning this definition (ADR-138).
 */
export function createPoseClassifyPlugin(options: PoseClassifyOptions): PluginDefinition {
  if (!isRecord(options)) throw new TypeError("Pose classifier options must be a record.");
  const name = nonEmptyString(options.name === undefined ? "pose-classify" : options.name, "name");
  if (!name.trim()) throw new TypeError("Pose classifier name must be a non-empty string.");
  const unknownLabel = nonEmptyString(
    options.unknownLabel === undefined ? "unknown" : options.unknownLabel,
    "unknownLabel",
  );
  const maxDistance = options.maxDistance;
  if (!Number.isFinite(maxDistance) || maxDistance <= 0) {
    throw new TypeError("Pose classifier maxDistance must be finite and greater than zero.");
  }
  if (!Array.isArray(options.templates) || options.templates.length === 0) {
    throw new TypeError("Pose classifier templates must be a non-empty array.");
  }
  const labels = new Set<string>();
  const templates = Object.freeze(
    Array.from(options.templates, (template) => prepareTemplate(template, unknownLabel, labels)),
  );
  const referenced = Object.freeze([
    ...new Set(templates.flatMap((template) => template.bones.map((bone) => bone.key))),
  ]);
  return {
    name,
    keys: [],
    stage: "compose",
    requirements: { rig: { description: "rig data track publishing the world-frame pose" } },
    outputs: ["label", "confidence"],
    compose: (_values, _progress, inputs) => {
      const pose = readRigValues(inputs.rig).pose;
      // Only template-referenced bones are converted; a full humanoid pose stays cheap.
      const actual = new Map<string, Matrix3>();
      for (const key of referenced) {
        const frame = Object.hasOwn(pose, key) ? pose[key] : undefined;
        if (frame !== undefined) actual.set(key, matrixFromEuler3d(frame));
      }
      let best = Infinity;
      let label = unknownLabel;
      for (const template of templates) {
        const candidate = distance(template, actual);
        if (candidate < best) {
          best = candidate;
          label = template.label;
        }
      }
      return {
        label: best <= maxDistance ? label : unknownLabel,
        confidence: Number.isFinite(best) ? Math.max(0, 1 - best / maxDistance) : 0,
      };
    },
  };
}
