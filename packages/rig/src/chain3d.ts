import { EXTERNAL_BASE, parseBody, type BodyError, type BodyStructure } from "./body";
import { readNumber, segmentExtent } from "./frame/frame";
import {
  IDENTITY_MATRIX3,
  ZERO_EULER,
  composeWorld3d,
  eulerFromMatrix3d,
  matrixFromEuler3d,
  matrixFromQuaternion,
  multiplyMatrix3,
  readPivotOffset3d,
  swingFrame3d,
  transposeMatrix3,
  type Euler3d,
  type Matrix3,
  type Quaternion,
  type Vec3,
  type WorldFrame3d,
} from "./frame/frame3d";
import { readInfluence } from "./ik/shared/goal";
import { UNBOUND_POLE3D, type Pole3d } from "./ik/solve3d/analytic";
import type { ChainMember3d } from "./ik/solve3d/chain";
import { FREE_JOINT3D, type JointLimit3d } from "./ik/solve3d/constraint";
import type { SolveResult3d } from "./ik/solve3d/result";
import { solveChain3d } from "./ik/solve3d/solve";
import { unreachable } from "./unreachable";

const EPSILON = 1e-9;

const ORIGIN_3D: WorldFrame3d = Object.freeze({
  x: 0,
  y: 0,
  z: 0,
  rotation: 0,
  rotationX: 0,
  rotationY: 0,
});

/** One 3D bone: length along local +x, rest Euler3d in degrees, and optional offset and limit. */
export type Bone3d = {
  readonly id: string;
  readonly parentId?: string;
  readonly length: number;
  readonly rotation?: number;
  readonly rotationX?: number;
  readonly rotationY?: number;
  readonly x?: number;
  readonly y?: number;
  readonly z?: number;
  readonly limit?: JointLimit3d;
};

/** A 3D translation and CSS Z-X-Y Euler turn in degrees, structurally compatible with Pose3d. */
export interface BonePose3d {
  readonly x?: number;
  readonly y?: number;
  readonly z?: number;
  readonly rotation?: number;
  readonly rotationX?: number;
  readonly rotationY?: number;
}

/** A 3D joint at its rest world position. */
export interface Joint3d<Id extends string = string> {
  readonly id: Id;
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

/** How a 3D chain is posed: each bone's local Euler3d against its parent, and where its root sits. */
export type ChainPose3d<Id extends string = string> = {
  readonly rotations?: Partial<Readonly<Record<Id, Partial<Euler3d>>>>;
  readonly base?: Partial<WorldFrame3d>;
};

/** Resolved rest pose of a 3D chain: its full base frame and per-bone local Euler triples. */
export interface RestPose3d<Id extends string = string> {
  readonly base: WorldFrame3d;
  readonly rotations: Readonly<Record<Id, Euler3d>>;
}

/** A checked 3D bone tree, built once and reused every frame; `order` lists ids parent first. */
export interface Chain3d<Id extends string = string> {
  readonly structure: BodyStructure;
  readonly bones: ReadonlyMap<string, Bone3d>;
  readonly order: readonly Id[];
  readonly base: WorldFrame3d;
  readonly rest: RestPose3d<Id>;
}

/** Where a 3D bone's tip should go, with optional orientation and compromise weights. */
export type Goal3d = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rotation?: number;
  readonly rotationX?: number;
  readonly rotationY?: number;
  readonly influence?: number;
  readonly orient?: number;
};

/** Where each joint of a model sits at rest, by name, as `motion:joints` writes it. */
export type JointTable3d = Readonly<
  Record<string, { readonly x: number; readonly y: number; readonly z: number }>
>;

/** Bone ids for a joint tuple: every joint except the final tip starts a bone. */
export type BoneIdsOf3d<Joints extends readonly Joint3d[]> = Joints extends readonly [
  ...infer Init extends readonly Joint3d[],
  Joint3d,
]
  ? Init[number]["id"]
  : Joints[number]["id"];

/** A 3D rigid body's world position and orientation quaternion. */
export interface RigidBodyLike3d {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rotation: Quaternion;
}

function describeBodyError(error: BodyError): string {
  switch (error.kind) {
    case "table-shape":
      return error.message;
    case "row-shape":
    case "row-id":
      return `bone ${error.index} has no id or a cell that is not a finite scalar`;
    case "row-id-duplicate":
      return `bone "${error.id}" appears twice`;
    case "parent-shape":
      return `bone "${error.id}" has a parentId that is not a string`;
    case "parent-unknown":
      return `bone "${error.id}" names unknown parent "${error.parentId}"`;
    case "parent-self":
      return `bone "${error.id}" is its own parent`;
    case "parent-cycle":
      return `bone "${error.id}" is in a parent cycle`;
    case "range-inverted":
      return `bone "${error.id}" has ${error.field} limits ${error.min} above ${error.max}`;
    default:
      return unreachable(error);
  }
}

function covers<Id extends string, V>(
  ids: readonly Id[],
  record: Readonly<Record<string, V>>,
): record is Readonly<Record<Id, V>> {
  return ids.every((id) => Object.hasOwn(record, id));
}

function byId<Id extends string, V>(
  ids: readonly Id[],
  record: Readonly<Record<string, V>>,
): Readonly<Record<Id, V>> {
  if (!covers(ids, record)) throw new TypeError("3D chain result misses a bone.");
  return record;
}

function boneOf3d(chain: Chain3d, id: string): Bone3d {
  const bone = chain.bones.get(id);
  if (bone === undefined) throw new TypeError(`3D chain has no bone "${id}".`);
  return bone;
}

function restEulerOf(bone: Bone3d): Euler3d {
  return {
    rotation: readNumber(bone.rotation),
    rotationX: readNumber(bone.rotationX),
    rotationY: readNumber(bone.rotationY),
  };
}

function localEulerOf(given: Partial<Euler3d> | undefined, bone: Bone3d): Euler3d {
  if (given === undefined) return restEulerOf(bone);
  return {
    rotation: readNumber(given.rotation ?? bone.rotation),
    rotationX: readNumber(given.rotationX ?? bone.rotationX),
    rotationY: readNumber(given.rotationY ?? bone.rotationY),
  };
}

function toWorldFrame3d(
  frame: Partial<WorldFrame3d> | undefined,
  fallback: WorldFrame3d,
): WorldFrame3d {
  if (frame === undefined) return fallback;
  return {
    x: readNumber(frame.x ?? fallback.x),
    y: readNumber(frame.y ?? fallback.y),
    z: readNumber(frame.z ?? fallback.z),
    rotation: readNumber(frame.rotation ?? fallback.rotation),
    rotationX: readNumber(frame.rotationX ?? fallback.rotationX),
    rotationY: readNumber(frame.rotationY ?? fallback.rotationY),
  };
}

function toBonePose3d(x: number, y: number, z: number, euler: Euler3d): BonePose3d {
  const pose: {
    x?: number;
    y?: number;
    z?: number;
    rotation?: number;
    rotationX?: number;
    rotationY?: number;
  } = {};
  if (Math.abs(x) >= EPSILON) pose.x = x + 0;
  if (Math.abs(y) >= EPSILON) pose.y = y + 0;
  if (Math.abs(z) >= EPSILON) pose.z = z + 0;
  if (Math.abs(euler.rotation) >= EPSILON) pose.rotation = euler.rotation + 0;
  if (Math.abs(euler.rotationX) >= EPSILON) pose.rotationX = euler.rotationX + 0;
  if (Math.abs(euler.rotationY) >= EPSILON) pose.rotationY = euler.rotationY + 0;
  return pose;
}

function isPole3d(value: Vec3 | Pole3d): value is Pole3d {
  return "kind" in value;
}

function readPole(pole: Vec3 | Pole3d | undefined): Pole3d {
  if (pole === undefined) return UNBOUND_POLE3D;
  return isPole3d(pole) ? pole : { kind: "point", point: pole };
}

function evaluateFrames3d<Id extends string>(
  chain: Chain3d<Id>,
  options: ChainPose3d<Id>,
): {
  readonly baseFrame: WorldFrame3d;
  readonly pivots: ReadonlyMap<string, WorldFrame3d>;
  readonly tips: ReadonlyMap<string, WorldFrame3d>;
} {
  const baseFrame = toWorldFrame3d(options.base, chain.base);
  const pivots = new Map<string, WorldFrame3d>();
  const tips = new Map<string, WorldFrame3d>();
  for (const id of chain.order) {
    const bone = boneOf3d(chain, id);
    const local = localEulerOf(options.rotations?.[id], bone);
    const parent = chain.structure.parentById.get(id);
    const parentFrame = parent === undefined ? baseFrame : tips.get(parent)!;
    const pivot = composeWorld3d(parentFrame, {
      ...readPivotOffset3d(bone),
      ...local,
    });
    const tip = composeWorld3d(pivot, {
      ...ZERO_EULER,
      x: segmentExtent(readNumber(bone.length)),
      y: 0,
      z: 0,
    });
    pivots.set(id, pivot);
    tips.set(id, tip);
  }
  return { baseFrame, pivots, tips };
}

/** Builds a checked 3D bone tree from `Bone3d` rows, parent first; ids type every later answer. */
export function buildChain3d<const B extends readonly Bone3d[]>(
  bones: B,
  base: WorldFrame3d = ORIGIN_3D,
): Chain3d<B[number]["id"]> {
  const parsed = parseBody(
    bones.map(({ id, limit: _limit, ...cells }) => ({ id, cells })),
    {},
  );
  if (!parsed.ok) {
    throw new TypeError(`buildChain3d: ${parsed.errors.map(describeBodyError).join("; ")}.`);
  }
  const given = new Set<string>(bones.map((bone) => bone.id));
  const isId = (id: string): id is B[number]["id"] => given.has(id);
  const order = parsed.value.ids.filter(isId);
  const rotations: Record<string, Euler3d> = {};
  for (const bone of bones) {
    rotations[bone.id] = restEulerOf(bone);
  }
  return {
    structure: parsed.value,
    bones: new Map(bones.map((bone) => [bone.id, bone])),
    order,
    base,
    rest: { base, rotations: byId(order, rotations) },
  };
}

/** Builds a 3D chain through ordered joints: each bone from joint to next, with its rest pose. */
export function chainThrough3d<const Joints extends readonly Joint3d[]>(
  joints: Joints,
): {
  readonly chain: Chain3d<BoneIdsOf3d<Joints>>;
  readonly rest: RestPose3d<BoneIdsOf3d<Joints>>;
} {
  if (joints.length < 2) {
    throw new RangeError(`chainThrough3d: needs at least two joints, got ${joints.length}.`);
  }
  type Id = BoneIdsOf3d<Joints>;
  const bones: Bone3d[] = [];
  const rotations: Record<string, Euler3d> = {};
  let parentMatrix: Matrix3 = IDENTITY_MATRIX3;
  let parentId: string | undefined;

  joints.slice(0, -1).forEach((joint, index) => {
    const next = joints[index + 1];
    if (next === undefined) return;
    const dx = next.x - joint.x;
    const dy = next.y - joint.y;
    const dz = next.z - joint.z;
    const length = Math.hypot(dx, dy, dz);
    const worldMatrix = length > 0 ? swingFrame3d(parentMatrix, [dx, dy, dz]) : parentMatrix;
    const localMatrix = multiplyMatrix3(transposeMatrix3(parentMatrix), worldMatrix);
    const restEuler = eulerFromMatrix3d(localMatrix);
    parentMatrix = worldMatrix;
    rotations[joint.id] = restEuler;
    bones.push({
      id: joint.id,
      ...(parentId === undefined ? {} : { parentId }),
      length,
      ...restEuler,
    });
    parentId = joint.id;
  });

  const first = joints[0]!;
  const base: WorldFrame3d = {
    x: first.x,
    y: first.y,
    z: first.z,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
  };
  const built = buildChain3d(bones, base);
  const given = new Set<string>(bones.map((bone) => bone.id));
  const isId = (id: string): id is Id => given.has(id);
  const order = built.order.filter(isId);
  const rest: RestPose3d<Id> = { base, rotations: byId(order, rotations) };
  const chain: Chain3d<Id> = {
    structure: built.structure,
    bones: built.bones,
    order,
    base,
    rest,
  };
  return { chain, rest };
}

/** Each bone's tip as a 3D world frame `{ x, y, z, rotation, rotationX, rotationY }`. */
export function fk3d<Id extends string>(
  chain: Chain3d<Id>,
  options: ChainPose3d<Id> = {},
): Readonly<Record<Id, WorldFrame3d>> {
  const { tips } = evaluateFrames3d(chain, options);
  return byId(chain.order, Object.fromEntries(tips));
}

/** Solves a 3D chain towards per-bone goals within limits and returns its solved pose and quality. */
export function ik3d<Id extends string>(
  chain: Chain3d<Id>,
  goals: Readonly<Partial<Record<Id, Goal3d>>>,
  options: { readonly base?: Partial<WorldFrame3d>; readonly pole?: Vec3 | Pole3d } = {},
): SolveResult3d & ChainPose3d<Id> & { readonly rotations: Readonly<Record<Id, Euler3d>> } {
  const baseFrame = toWorldFrame3d(options.base, chain.base);
  const members: ChainMember3d[] = chain.order.map((id) => {
    const bone = boneOf3d(chain, id);
    const goal = goals[id];
    const influence = goal === undefined ? undefined : readInfluence(goal);
    const orient =
      goal !== undefined && typeof goal.orient === "number" && Number.isFinite(goal.orient)
        ? goal.orient
        : undefined;
    return {
      id,
      base: chain.structure.parentById.get(id) ?? EXTERNAL_BASE,
      length: readNumber(bone.length),
      offset: readPivotOffset3d(bone),
      rest: restEulerOf(bone),
      ...(bone.limit !== undefined && bone.limit.kind !== FREE_JOINT3D.kind
        ? { limit: bone.limit }
        : {}),
      ...(influence === undefined ? {} : { influence }),
      ...(orient === undefined ? {} : { orient }),
      ...(goal === undefined
        ? {}
        : {
            goal: {
              x: readNumber(goal.x),
              y: readNumber(goal.y),
              z: readNumber(goal.z),
              rotation: readNumber(goal.rotation),
              rotationX: readNumber(goal.rotationX),
              rotationY: readNumber(goal.rotationY),
            },
          }),
    };
  });
  const solved = solveChain3d(
    baseFrame,
    members,
    readPole(options.pole ?? restBend(chain, baseFrame)),
  );
  const rotations = untwisted(chain, goals, baseFrame, byId(chain.order, solved.rotations3d));
  return {
    ...solved,
    rotations3d: rotations,
    base: baseFrame,
    rotations,
  };
}

/** Where the first bone's tip sits at rest, carried by the base: the plane a two-bone chain bends in when no pole is given. */
function restBend<Id extends string>(chain: Chain3d<Id>, base: WorldFrame3d): Vec3 | undefined {
  const [first] = chain.order;
  if (first === undefined || chain.order.length < 2) return undefined;
  const tip = evaluateFrames3d(chain, { base, rotations: chain.rest.rotations }).tips.get(first)!;
  return [tip.x, tip.y, tip.z];
}

function untwistable<Id extends string>(chain: Chain3d<Id>): boolean {
  return chain.order.every((id) => {
    const bone = boneOf3d(chain, id);
    const offset = readPivotOffset3d(bone);
    const limited = bone.limit !== undefined && bone.limit.kind !== FREE_JOINT3D.kind;
    return !limited && offset.x === 0 && offset.y === 0 && offset.z === 0;
  });
}

/** Each bone turned from its rest by the least swing that points it where the solve did, so no bone twists about
 * its own length: a goal at rest answers the rest. Bones with an `orient` goal keep the solved turn. */
function untwisted<Id extends string>(
  chain: Chain3d<Id>,
  goals: Readonly<Partial<Record<Id, Goal3d>>>,
  baseFrame: WorldFrame3d,
  solved: Readonly<Record<Id, Euler3d>>,
): Readonly<Record<Id, Euler3d>> {
  if (!untwistable(chain)) return solved;
  const frames = evaluateFrames3d(chain, { base: baseFrame, rotations: solved });
  const worlds = new Map<string, Matrix3>();
  const rotations: Record<string, Euler3d> = {};
  for (const id of chain.order) {
    const parent = chain.structure.parentById.get(id);
    const parentWorld = parent === undefined ? matrixFromEuler3d(baseFrame) : worlds.get(parent)!;
    const pivot = frames.pivots.get(id)!;
    const tip = frames.tips.get(id)!;
    const orient = goals[id]?.orient;
    const world =
      typeof orient === "number" && orient > 0
        ? matrixFromEuler3d(pivot)
        : swingFrame3d(
            multiplyMatrix3(parentWorld, matrixFromEuler3d(restEulerOf(boneOf3d(chain, id)))),
            [tip.x - pivot.x, tip.y - pivot.y, tip.z - pivot.z],
          );
    worlds.set(id, world);
    rotations[id] = eulerFromMatrix3d(multiplyMatrix3(transposeMatrix3(parentWorld), world));
  }
  return byId(chain.order, rotations);
}

/** Each bone's turn from its rest, for `applyBones`: turns only, `{}` at rest; the base is the bone's parent, so a moved base moves nothing here. */
export function bonesOf3d<Id extends string>(
  chain: Chain3d<Id>,
  now: ChainPose3d<Id> = {},
): Readonly<Record<Id, BonePose3d>> {
  const restEval = evaluateFrames3d(chain, chain.rest);
  const nowEval = evaluateFrames3d(chain, now);
  const poses: Record<string, BonePose3d> = {};

  for (const id of chain.order) {
    const parent = chain.structure.parentById.get(id);
    const parentDelta =
      parent === undefined
        ? multiplyMatrix3(
            matrixFromEuler3d(nowEval.baseFrame),
            transposeMatrix3(matrixFromEuler3d(restEval.baseFrame)),
          )
        : multiplyMatrix3(
            matrixFromEuler3d(nowEval.pivots.get(parent)!),
            transposeMatrix3(matrixFromEuler3d(restEval.pivots.get(parent)!)),
          );
    const ownDelta = multiplyMatrix3(
      matrixFromEuler3d(nowEval.pivots.get(id)!),
      transposeMatrix3(matrixFromEuler3d(restEval.pivots.get(id)!)),
    );
    const localTurn = multiplyMatrix3(transposeMatrix3(parentDelta), ownDelta);
    poses[id] = toBonePose3d(0, 0, 0, eulerFromMatrix3d(localTurn));
  }
  return byId(chain.order, poses);
}

/** The base for a chain hung from bone `id`'s tip when `chain` is posed `now`: that tip, turned as the bone turned from rest. */
export function childBase3d<Id extends string>(
  chain: Chain3d<Id>,
  now: ChainPose3d<Id>,
  id: Id,
): WorldFrame3d {
  const restTip = evaluateFrames3d(chain, chain.rest).tips.get(id);
  const nowTip = evaluateFrames3d(chain, now).tips.get(id);
  if (restTip === undefined || nowTip === undefined) {
    throw new RangeError(`childBase3d: no bone "${id}".`);
  }
  const turn = multiplyMatrix3(
    matrixFromEuler3d(nowTip),
    transposeMatrix3(matrixFromEuler3d(restTip)),
  );
  return { x: nowTip.x, y: nowTip.y, z: nowTip.z, ...eulerFromMatrix3d(turn) };
}

/** Each bone's world pose against the chain at rest, for a rigid part bound with `useTarget3d`; `{}` at rest. */
export function chainFromRest3d<Id extends string>(
  chain: Chain3d<Id>,
  rest: ChainPose3d<Id>,
  now: ChainPose3d<Id>,
): Readonly<Record<Id, BonePose3d>> {
  const before = evaluateFrames3d(chain, rest).pivots;
  const after = evaluateFrames3d(chain, now).pivots;
  const poses: Record<string, BonePose3d> = {};

  for (const id of chain.order) {
    const pivotBefore = before.get(id)!;
    const pivotAfter = after.get(id)!;
    const worldTurn = multiplyMatrix3(
      matrixFromEuler3d(pivotAfter),
      transposeMatrix3(matrixFromEuler3d(pivotBefore)),
    );
    const euler = eulerFromMatrix3d(worldTurn);
    poses[id] = toBonePose3d(
      pivotAfter.x - pivotBefore.x,
      pivotAfter.y - pivotBefore.y,
      pivotAfter.z - pivotBefore.z,
      euler,
    );
  }
  return byId(chain.order, poses);
}

/** The joint `name` from a joint table, typed by its name; throws a RangeError naming a joint the table lacks. */
export function jointOf<const Name extends string>(
  joints: JointTable3d,
  name: Name,
): Joint3d<Name> {
  const joint = Object.hasOwn(joints, name) ? joints[name] : undefined;
  if (joint === undefined) throw new RangeError(`jointOf: no joint "${name}".`);
  return Object.freeze({ id: name, x: joint.x, y: joint.y, z: joint.z });
}

/** Converts a 3D physics body's position and quaternion into a Pose3d-compatible object. */
export function bodyPose3d(state: RigidBodyLike3d | undefined): BonePose3d {
  if (state === undefined) return {};
  const euler = eulerFromMatrix3d(matrixFromQuaternion(state.rotation));
  return toBonePose3d(state.x, state.y, state.z, euler);
}
