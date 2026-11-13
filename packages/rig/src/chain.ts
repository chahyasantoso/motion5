import { parseBody, EXTERNAL_BASE, type BodyError, type BodyStructure } from "./body";
import {
  ORIGIN,
  composeWorld,
  readFrame,
  readNumber,
  readPivotOffset,
  segmentExtent,
  type PivotOffset,
  type WorldFrame,
} from "./frame/frame";
import { readJointLimit } from "./ik/shared/constraint";
import { readInfluence } from "./ik/shared/goal";
import type { SolveMember } from "./ik/shared/member";
import type { SolveResult } from "./ik/shared/result";
import { solveChain } from "./ik/solve2d/solve";
import { unreachable } from "./unreachable";

/** One 2D bone: its length along its own x axis, a rest rotation in degrees, and an optional pivot offset. */
export type Bone2d = {
  readonly id: string;
  readonly parentId?: string;
  readonly length: number;
  readonly rotation?: number;
  readonly x?: number;
  readonly y?: number;
  readonly minRotation?: number;
  readonly maxRotation?: number;
};

/** A checked bone tree, built once and reused every frame; `order` lists its bone ids parent first. */
export interface Chain2d<Id extends string = string> {
  readonly structure: BodyStructure;
  readonly bones: ReadonlyMap<string, Bone2d>;
  readonly order: readonly Id[];
}

/** A bone's pose for an element laid out from the chain's base pointing right, turning on its left end. */
export type BonePose = {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly anchor: "left";
};

/** An offset from the chain's base, for an element centred on the base, such as a hand on a tip. */
export type TipPose = { readonly x: number; readonly y: number };

/** Where a bone's tip should go, with an optional weight against other goals. */
export type Goal2d = {
  readonly x: number;
  readonly y: number;
  readonly rotation?: number;
  readonly influence?: number;
};

/** What composes one link: its length, its rotation against its parent, and its pivot offset. */
export interface Link2d {
  readonly length: number;
  readonly rotation: number;
  readonly pivot: PivotOffset;
}

function describe(error: BodyError): string {
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
  if (!covers(ids, record)) throw new TypeError("Chain result misses a bone.");
  return record;
}

/** A checked bone tree from `Bone2d` rows `{ id, parentId?, length, rotation?, minRotation?,
 * maxRotation? }`, parent first; ids type every later answer. Throws on a bad list. */
export function buildChain<const B extends readonly Bone2d[]>(bones: B): Chain2d<B[number]["id"]> {
  const parsed = parseBody(
    bones.map(({ id, ...cells }) => ({ id, cells })),
    {},
  );
  if (!parsed.ok) throw new TypeError(`buildChain: ${parsed.errors.map(describe).join("; ")}.`);
  const given = new Set<string>(bones.map((bone) => bone.id));
  const isId = (id: string): id is B[number]["id"] => given.has(id);
  return {
    structure: parsed.value,
    bones: new Map(bones.map((bone) => [bone.id, bone])),
    order: parsed.value.ids.filter(isId),
  };
}

/** The world frame at each bone's tip, parent first, from each bone's link. */
export function composeChain(
  structure: Pick<BodyStructure, "ids" | "parentById">,
  base: WorldFrame,
  linkOf: (id: string, position: number) => Link2d,
): ReadonlyMap<string, WorldFrame> {
  const frames = new Map<string, WorldFrame>();
  structure.ids.forEach((id, position) => {
    const link = linkOf(id, position);
    const parent = structure.parentById.get(id);
    const parentFrame = parent === undefined ? base : frames.get(parent)!;
    const pivot = composeWorld(parentFrame, { ...link.pivot, rotation: link.rotation });
    frames.set(id, composeWorld(pivot, { x: segmentExtent(link.length), y: 0, rotation: 0 }));
  });
  return frames;
}

function boneOf(chain: Chain2d, id: string): Bone2d {
  const bone = chain.bones.get(id);
  if (bone === undefined) throw new TypeError(`Chain has no bone "${id}".`);
  return bone;
}

/** How a chain is posed: each bone's rotation against its parent, in degrees, and where its root sits. */
export type ChainPose = {
  readonly rotations?: Readonly<Record<string, number>>;
  readonly base?: WorldFrame;
};

/** Each bone's tip as a world frame `{ x, y, rotation }`; `rotations` (degrees, by bone id) replace
 * rest rotations, `base` is the root frame. */
export function fk<Id extends string>(
  chain: Chain2d<Id>,
  options: ChainPose = {},
): Readonly<Record<Id, WorldFrame>> {
  const frames = composeChain(chain.structure, options.base ?? ORIGIN, (id) => {
    const bone = boneOf(chain, id);
    return {
      length: bone.length,
      rotation: options.rotations?.[id] ?? bone.rotation ?? 0,
      pivot: readPivotOffset(bone),
    };
  });
  return byId(chain.order, Object.fromEntries(frames));
}

/** Poses for elements laid out at the base: each bone from its start joint, and each tip as an offset. */
export function chainPoses<Id extends string>(
  chain: Chain2d<Id>,
  options: ChainPose = {},
): {
  readonly bones: Readonly<Record<Id, BonePose>>;
  readonly tips: Readonly<Record<Id, TipPose>>;
} {
  const base = options.base ?? ORIGIN;
  const tips = fk(chain, options);
  const bones: Record<string, BonePose> = {};
  const offsets: Record<string, TipPose> = {};
  for (const id of chain.order) {
    const tip = tips[id];
    const extent = segmentExtent(boneOf(chain, id).length);
    const turn = (tip.rotation * Math.PI) / 180;
    bones[id] = {
      x: tip.x - extent * Math.cos(turn) - base.x,
      y: tip.y - extent * Math.sin(turn) - base.y,
      rotation: tip.rotation,
      anchor: "left",
    };
    offsets[id] = { x: tip.x - base.x, y: tip.y - base.y };
  }
  return { bones: byId(chain.order, bones), tips: byId(chain.order, offsets) };
}

function wrapDegrees(degrees: number): number {
  return degrees - 360 * Math.ceil(degrees / 360 - 0.5) + 0;
}

/** Each bone's pose against the chain at rest: `{ x, y, rotation }` moving its start joint and turning it, for a part drawn in place whose pivot is that joint. */
export function chainFromRest<Id extends string>(
  chain: Chain2d<Id>,
  rest: ChainPose,
  now: ChainPose,
): Readonly<Record<Id, { readonly x: number; readonly y: number; readonly rotation: number }>> {
  const before = chainPoses(chain, rest).bones;
  const after = chainPoses(chain, now).bones;
  const baseBefore = rest.base ?? ORIGIN;
  const baseAfter = now.base ?? ORIGIN;
  const poses: Record<string, { x: number; y: number; rotation: number }> = {};
  for (const id of chain.order) {
    poses[id] = {
      x: after[id].x + baseAfter.x - (before[id].x + baseBefore.x) + 0,
      y: after[id].y + baseAfter.y - (before[id].y + baseBefore.y) + 0,
      rotation: wrapDegrees(after[id].rotation - before[id].rotation),
    };
  }
  return byId(chain.order, poses);
}

/** A chain through drawn joints, in order: each bone from one joint to the next, its length and rest rotation measured, and the pose it rests in. */
export function chainThrough<const Id extends string>(
  joints: readonly { readonly id: Id; readonly x: number; readonly y: number }[],
): { readonly chain: Chain2d<Id>; readonly rest: ChainPose } {
  if (joints.length < 2) {
    throw new RangeError(`chainThrough: needs at least two joints, got ${joints.length}.`);
  }
  const bones: Bone2d[] = [];
  const rotations: Record<string, number> = {};
  let parentAngle = 0;
  joints.slice(0, -1).forEach((joint, index) => {
    const next = joints[index + 1]!;
    const dx = next.x - joint.x;
    const dy = next.y - joint.y;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const rotation = wrapDegrees(angle - parentAngle);
    parentAngle = angle;
    rotations[joint.id] = rotation;
    bones.push({
      id: joint.id,
      ...(index === 0 ? {} : { parentId: joints[index - 1]!.id }),
      length: Math.hypot(dx, dy),
      rotation,
    });
  });
  const given = new Set<string>(joints.map((joint) => joint.id));
  const isId = (id: string): id is Id => given.has(id);
  const built = buildChain(bones);
  const first = joints[0]!;
  return {
    chain: { ...built, order: built.order.filter(isId) },
    rest: { rotations, base: { x: first.x, y: first.y, rotation: 0 } },
  };
}

/** One solve member from a bone's cells and, when it has one, its goal's cells. */
export function solveMember(
  id: string,
  parentId: string | undefined,
  bone: Readonly<Record<string, unknown>>,
  goal?: Readonly<Record<string, unknown>>,
): SolveMember {
  const limit = readJointLimit(bone);
  const influence = goal === undefined ? undefined : readInfluence(goal);
  return {
    id,
    base: parentId ?? EXTERNAL_BASE,
    length: readNumber(bone.length),
    pivot: readPivotOffset(bone),
    ...(goal === undefined ? {} : { goal: readFrame(goal) }),
    ...(limit.kind === "range" ? { limit } : {}),
    ...(influence === undefined ? {} : { influence }),
  };
}

/** Rotations that bring each goal's bone tip to its `{ x, y }` goal within limits, with a
 * `quality.kind` (`"too-far"` past reach); `flip` bends the elbow the other way. */
export function ik<Id extends string>(
  chain: Chain2d<Id>,
  goals: Readonly<Partial<Record<Id, Goal2d>>>,
  options: { readonly base?: WorldFrame; readonly flip?: boolean } = {},
): SolveResult & { readonly rotations: Readonly<Record<Id, number>> } {
  const members = chain.order.map((id) =>
    solveMember(id, chain.structure.parentById.get(id), boneOf(chain, id), goals[id]),
  );
  const solved = solveChain(options.base ?? ORIGIN, members, options.flip === true);
  return { ...solved, rotations: byId(chain.order, solved.rotations) };
}
