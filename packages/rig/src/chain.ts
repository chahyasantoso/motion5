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

/** A checked bone tree, parent first, built once and reused every frame. */
export interface Chain2d {
  readonly structure: BodyStructure;
  readonly bones: ReadonlyMap<string, Bone2d>;
}

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

/** Checks a bone list and orders it parent first. */
export function buildChain(bones: readonly Bone2d[]): Chain2d {
  const parsed = parseBody(
    bones.map(({ id, ...cells }) => ({ id, cells })),
    {},
  );
  if (!parsed.ok) throw new TypeError(`buildChain: ${parsed.errors.map(describe).join("; ")}.`);
  return { structure: parsed.value, bones: new Map(bones.map((bone) => [bone.id, bone])) };
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

/** Each bone's tip in world space; `rotations` replace rest rotations by bone id. */
export function fk(
  chain: Chain2d,
  options: {
    readonly rotations?: Readonly<Record<string, number>>;
    readonly base?: WorldFrame;
  } = {},
): Readonly<Record<string, WorldFrame>> {
  const frames = composeChain(chain.structure, options.base ?? ORIGIN, (id) => {
    const bone = boneOf(chain, id);
    return {
      length: bone.length,
      rotation: options.rotations?.[id] ?? bone.rotation ?? 0,
      pivot: readPivotOffset(bone),
    };
  });
  return Object.fromEntries(frames);
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

/** The rotations that bring each goal's bone tip to its goal, within the bones' limits. */
export function ik(
  chain: Chain2d,
  goals: Readonly<Record<string, Goal2d>>,
  options: { readonly base?: WorldFrame; readonly flip?: boolean } = {},
): SolveResult {
  const members = chain.structure.ids.map((id) =>
    solveMember(id, chain.structure.parentById.get(id), boneOf(chain, id), goals[id]),
  );
  return solveChain(options.base ?? ORIGIN, members, options.flip === true);
}
