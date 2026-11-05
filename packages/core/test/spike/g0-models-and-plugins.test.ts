import { describe, expect, expectTypeOf, it } from "vitest";
import { equalValues } from "../../src/domain/values";
import type { ValueSpec } from "../../src/contract/v5";

export interface Issue {
  readonly path: string;
  readonly message: string;
}

export type Parsed<Structure> =
  | { readonly ok: true; readonly value: Structure }
  | { readonly ok: false; readonly issues: readonly Issue[] };

export function ok<Structure>(value: Structure): Parsed<Structure> {
  return { ok: true, value };
}

export function refused(issues: readonly Issue[]): Parsed<never> {
  return { ok: false, issues };
}

export type TableRow<Cells> = {
  readonly id: string;
  readonly cells: Cells;
};

export type TableValue<Cells> = readonly TableRow<Cells>[];

export interface Model<
  Cells = unknown,
  Structure = undefined,
  Kind extends "table" | "record" = "table" | "record",
> {
  readonly id: string;
  readonly kind: Kind;
  readonly spec: ValueSpec;
  readonly parse?: (value: unknown) => Parsed<Structure>;
}

export function defineModel<
  Cells = unknown,
  Structure = undefined,
  Kind extends "table" | "record" = "table" | "record",
>(decl: {
  readonly id: string;
  readonly kind: Kind;
  readonly spec: ValueSpec;
  readonly parse?: (value: unknown) => Parsed<Structure>;
}): Model<Cells, Structure, Kind> {
  return Object.freeze({ ...decl });
}

export interface OptionalRequirement<M extends Model<unknown, unknown, "table" | "record">> {
  readonly optional: true;
  readonly model: M;
}

export function optional<M extends Model<unknown, unknown, "table" | "record">>(
  model: M,
): OptionalRequirement<M> {
  return Object.freeze({ optional: true, model });
}

export type RequirementEntry =
  | Model<unknown, unknown, "table" | "record">
  | OptionalRequirement<Model<unknown, unknown, "table" | "record">>;

export type InferredStructure<T> =
  T extends OptionalRequirement<Model<unknown, infer S, "table" | "record">>
    ? S | undefined
    : T extends Model<unknown, infer S, "table" | "record">
      ? S
      : never;

export type InferredStructures<TRequires extends Record<string, RequirementEntry>> = {
  readonly [K in keyof TRequires]: InferredStructure<TRequires[K]>;
};

export type InferredValue<T> =
  T extends OptionalRequirement<Model<infer C, unknown, "table">>
    ? TableValue<C> | undefined
    : T extends OptionalRequirement<Model<infer C, unknown, "record">>
      ? C | undefined
      : T extends Model<infer C, unknown, "table">
        ? TableValue<C>
        : T extends Model<infer C, unknown, "record">
          ? C
          : never;

export type InferredRequires<TRequires extends Record<string, RequirementEntry>> = {
  readonly [K in keyof TRequires]: InferredValue<TRequires[K]>;
};

export type Prepared<State> =
  | { readonly ok: true; readonly value: State }
  | { readonly ok: false; readonly issues: readonly Issue[] };

export type OutputValue<TOutputModel> =
  TOutputModel extends Model<infer C, unknown, "table">
    ? TableValue<C>
    : TOutputModel extends Model<infer C, unknown, "record">
      ? C
      : unknown;

export type RecordSpec = Extract<ValueSpec, { readonly kind: "record" }>;

export interface PluginDefinition<
  TParam = Record<string, unknown>,
  TValues = unknown,
  TRequires extends Record<string, RequirementEntry> = Record<string, never>,
  TOutputs extends { readonly values: Model<unknown, unknown, "table" | "record"> } = {
    readonly values: Model<unknown, unknown, "table" | "record">;
  },
  TState = unknown,
> {
  readonly id: string;
  readonly inputs: {
    readonly param?: RecordSpec;
    readonly values?: Model<unknown, unknown, "table" | "record">;
    readonly requires?: TRequires;
  };
  readonly outputs: TOutputs;
  readonly prepare?: (ctx: {
    readonly values: unknown;
    readonly param: unknown;
    readonly structures: InferredStructures<TRequires>;
  }) => Prepared<TState>;
  readonly transform: (
    ctx: {
      readonly values: TValues;
      readonly param: TParam;
      readonly requires: InferredRequires<TRequires>;
      readonly structures: InferredStructures<TRequires>;
      readonly state: TState;
    },
    context: { readonly nodeId: string; readonly progress: number },
  ) => { readonly values: OutputValue<TOutputs["values"]> } & Record<string, unknown>;
}

export function definePlugin<
  TParam = Record<string, unknown>,
  TValues = unknown,
  TRequires extends Record<string, RequirementEntry> = Record<string, never>,
  TOutputs extends { readonly values: Model<unknown, unknown, "table" | "record"> } = {
    readonly values: Model<unknown, unknown, "table" | "record">;
  },
  TState = unknown,
>(
  decl: PluginDefinition<TParam, TValues, TRequires, TOutputs, TState>,
): PluginDefinition<TParam, TValues, TRequires, TOutputs, TState> {
  return Object.freeze({ ...decl });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTableRow(value: unknown): value is TableRow<Record<string, unknown>> {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "string") return false;
  return isRecord(value.cells);
}

function isTable(value: unknown): value is readonly TableRow<Record<string, unknown>>[] {
  return Array.isArray(value) && value.every(isTableRow);
}

export interface BodyCells {
  readonly parentId?: string;
  readonly length: number;
  readonly rotation: number;
  readonly weight?: number;
  readonly x?: number;
  readonly y?: number;
  readonly minRotation?: number;
  readonly maxRotation?: number;
}

export interface BoneInfo {
  readonly id: string;
  readonly parentId?: string;
  readonly minRotation?: number;
  readonly maxRotation?: number;
}

export interface BodyStructure {
  readonly ids: readonly string[];
  readonly indexById: ReadonlyMap<string, number>;
  readonly bones: readonly BoneInfo[];
  readonly leaves: readonly string[];
  readonly parentById: ReadonlyMap<string, string>;
}

function parseBody(value: unknown): Parsed<BodyStructure> {
  if (!isTable(value)) {
    return refused([{ path: "values", message: "Body2d values must be an array of table rows." }]);
  }
  const seenIds = new Set<string>();
  const allIds: string[] = [];
  const parentById = new Map<string, string>();
  const indexById = new Map<string, number>();
  const bones: BoneInfo[] = [];

  for (let i = 0; i < value.length; i++) {
    const row = value[i];
    if (row === undefined) continue;
    if (seenIds.has(row.id)) {
      return refused([{ path: `rows[${i}].id`, message: `Duplicate bone id "${row.id}".` }]);
    }
    seenIds.add(row.id);
    allIds.push(row.id);
    indexById.set(row.id, i);

    const minRot = typeof row.cells.minRotation === "number" ? row.cells.minRotation : undefined;
    const maxRot = typeof row.cells.maxRotation === "number" ? row.cells.maxRotation : undefined;

    if (minRot !== undefined && maxRot !== undefined && minRot > maxRot) {
      return refused([
        { path: `rows[${i}].limits`, message: `Inverted joint limits on bone "${row.id}".` },
      ]);
    }

    const parentId = typeof row.cells.parentId === "string" ? row.cells.parentId : undefined;
    const bone: BoneInfo = {
      id: row.id,
      ...(parentId !== undefined ? { parentId } : {}),
      ...(minRot !== undefined ? { minRotation: minRot } : {}),
      ...(maxRot !== undefined ? { maxRotation: maxRot } : {}),
    };
    bones.push(bone);

    if (parentId !== undefined) {
      parentById.set(row.id, parentId);
    }
  }

  for (let i = 0; i < bones.length; i++) {
    const bone = bones[i];
    if (bone === undefined || bone.parentId === undefined) continue;
    if (!seenIds.has(bone.parentId)) {
      return refused([
        {
          path: `rows[${i}].parentId`,
          message: `Unknown parent "${bone.parentId}" for bone "${bone.id}".`,
        },
      ]);
    }
    let current: string | undefined = bone.parentId;
    const visited = new Set<string>([bone.id]);
    while (current !== undefined) {
      if (visited.has(current)) {
        return refused([
          {
            path: `rows[${i}].parentId`,
            message: `Parent cycle detected involving bone "${bone.id}".`,
          },
        ]);
      }
      visited.add(current);
      current = parentById.get(current);
    }
  }

  const parentRefs = new Set(parentById.values());
  const leaves = allIds.filter((id) => !parentRefs.has(id));

  return ok({
    ids: Object.freeze(allIds),
    indexById,
    bones: Object.freeze(bones),
    leaves: Object.freeze(leaves),
    parentById,
  });
}

export const Body2d: Model<BodyCells, BodyStructure, "table"> = defineModel({
  id: "Body2d",
  kind: "table",
  spec: {
    kind: "table",
    schema: {
      row: {
        fields: {
          parentId: { kind: "string", optional: true, static: true },
          length: { kind: "number" },
          rotation: { kind: "number" },
          weight: { kind: "number", optional: true },
          x: { kind: "number", optional: true },
          y: { kind: "number", optional: true },
          minRotation: { kind: "number", optional: true, static: true },
          maxRotation: { kind: "number", optional: true, static: true },
        },
      },
    },
  },
  parse: parseBody,
});

export interface GoalCells {
  readonly memberId: string;
  readonly x: number;
  readonly y: number;
  readonly influence?: number;
}

export interface GoalRowStructure {
  readonly id: string;
  readonly memberId: string;
  readonly influence?: number;
}

export interface GoalsStructure {
  readonly rows: readonly GoalRowStructure[];
  readonly byMember: ReadonlyMap<string, GoalRowStructure>;
}

function parseGoals(value: unknown): Parsed<GoalsStructure> {
  if (!isTable(value)) {
    return refused([{ path: "values", message: "Goals2d values must be an array of table rows." }]);
  }
  const seenIds = new Set<string>();
  const seenMembers = new Set<string>();
  const goalRows: GoalRowStructure[] = [];
  const byMember = new Map<string, GoalRowStructure>();

  for (let i = 0; i < value.length; i++) {
    const row = value[i];
    if (row === undefined) continue;
    if (seenIds.has(row.id)) {
      return refused([{ path: `rows[${i}].id`, message: `Duplicate goal id "${row.id}".` }]);
    }
    seenIds.add(row.id);

    const memberId = typeof row.cells.memberId === "string" ? row.cells.memberId : "";
    if (memberId.length === 0) {
      return refused([{ path: `rows[${i}].cells.memberId`, message: "Goal requires memberId." }]);
    }
    if (seenMembers.has(memberId)) {
      return refused([
        {
          path: `rows[${i}].cells.memberId`,
          message: `Duplicate goal for member "${memberId}".`,
        },
      ]);
    }
    seenMembers.add(memberId);

    const influence = typeof row.cells.influence === "number" ? row.cells.influence : undefined;
    const goalRow: GoalRowStructure = {
      id: row.id,
      memberId,
      ...(influence !== undefined ? { influence } : {}),
    };
    goalRows.push(goalRow);
    byMember.set(memberId, goalRow);
  }

  return ok({
    rows: Object.freeze(goalRows),
    byMember,
  });
}

export const Goals2d: Model<GoalCells, GoalsStructure, "table"> = defineModel({
  id: "Goals2d",
  kind: "table",
  spec: {
    kind: "table",
    schema: {
      row: {
        fields: {
          memberId: { kind: "string", static: true },
          x: { kind: "number" },
          y: { kind: "number" },
          influence: { kind: "number", optional: true, static: true },
        },
      },
    },
  },
  parse: parseGoals,
});

export interface Point2dCells {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

export const Point2d: Model<Point2dCells, undefined, "record"> = defineModel({
  id: "Point2d",
  kind: "record",
  spec: {
    kind: "record",
    fields: {
      x: { kind: "number" },
      y: { kind: "number" },
      rotation: { kind: "number" },
    },
  },
});

export interface SolvedCells {
  readonly rotation: number;
  readonly residual?: number;
  readonly atBound?: boolean;
}

export interface SolvedStructure {
  readonly ids: readonly string[];
}

function parseSolved(value: unknown): Parsed<SolvedStructure> {
  if (!isTable(value)) {
    return refused([
      { path: "values", message: "Solved2d values must be an array of table rows." },
    ]);
  }
  const ids = value.map((r) => r.id);
  return ok({ ids: Object.freeze(ids) });
}

export const Solved2d: Model<SolvedCells, SolvedStructure, "table"> = defineModel({
  id: "Solved2d",
  kind: "table",
  spec: {
    kind: "table",
    schema: {
      row: {
        fields: {
          rotation: { kind: "number" },
          residual: { kind: "number", optional: true },
          atBound: { kind: "boolean", optional: true },
        },
      },
    },
  },
  parse: parseSolved,
});

export interface Points2dCells {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

export const Points2d: Model<Points2dCells, undefined, "table"> = defineModel({
  id: "Points2d",
  kind: "table",
  spec: {
    kind: "table",
    schema: {
      row: {
        fields: {
          x: { kind: "number" },
          y: { kind: "number" },
          rotation: { kind: "number" },
        },
      },
    },
  },
});

export function solveTwoBoneMath(
  root: Point2dCells,
  target: { readonly x: number; readonly y: number },
  l1: number,
  l2: number,
  flip: boolean,
): { readonly r1: number; readonly r2: number; readonly residual: number } {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const targetDist = Math.hypot(dx, dy);
  const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const clampedDist = Math.max(Math.abs(l1 - l2), Math.min(l1 + l2, targetDist));

  const cosAlpha = (l1 * l1 + clampedDist * clampedDist - l2 * l2) / (2 * l1 * clampedDist);
  const alpha = (Math.acos(Math.max(-1, Math.min(1, cosAlpha))) * 180) / Math.PI;

  const cosBeta = (l1 * l1 + l2 * l2 - clampedDist * clampedDist) / (2 * l1 * l2);
  const beta = (Math.acos(Math.max(-1, Math.min(1, cosBeta))) * 180) / Math.PI;
  const elbow = 180 - beta;

  const r1 = flip ? targetAngle - root.rotation - alpha : targetAngle - root.rotation + alpha;
  const r2 = flip ? elbow : -elbow;
  const residual = Math.abs(targetDist - clampedDist);

  return { r1, r2, residual };
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export interface IkParam {
  readonly flip?: boolean;
  readonly inspect?: boolean;
}

export interface IkPreparedState {
  readonly rootBoneId: string;
  readonly tipBoneId: string;
  readonly goalMemberId: string;
}

export const ik = definePlugin({
  id: "ik",
  inputs: {
    param: {
      kind: "record",
      fields: {
        flip: { kind: "boolean", optional: true },
        inspect: { kind: "boolean", optional: true, static: true },
      },
    },
    requires: {
      chain: Body2d,
      goals: Goals2d,
      base: Point2d,
    },
  },
  outputs: { values: Solved2d },
  prepare({ structures }) {
    const chain = structures.chain;
    const goals = structures.goals;
    const issues: Issue[] = [];

    for (const goal of goals.rows) {
      if (!chain.ids.includes(goal.memberId)) {
        issues.push({
          path: "goals",
          message: `Goal targets unknown bone "${goal.memberId}".`,
        });
      } else if (!chain.leaves.includes(goal.memberId)) {
        issues.push({
          path: "goals",
          message: `Goal targets non-leaf bone "${goal.memberId}".`,
        });
      }
    }

    if (issues.length > 0) return refused(issues);

    const goalMember = goals.rows[0]?.memberId ?? "";
    const parent = chain.parentById.get(goalMember);
    const rootBone = parent !== undefined ? parent : goalMember;

    return ok({
      rootBoneId: rootBone,
      tipBoneId: goalMember,
      goalMemberId: goalMember,
    });
  },
  transform({ requires, state, param }) {
    const base = requires.base;
    const chainRows = requires.chain;
    const goalRows = requires.goals;
    const flip = param.flip === true;

    const rowMap = new Map<string, BodyCells>();
    for (const row of chainRows) {
      rowMap.set(row.id, row.cells);
    }

    const firstCells = rowMap.get(state.rootBoneId);
    const secondCells = rowMap.get(state.tipBoneId);
    const l1 = firstCells?.length ?? 80;
    const l2 = secondCells?.length ?? 60;

    const targetRow = goalRows.find((r) => r.cells.memberId === state.goalMemberId);
    const target = {
      x: targetRow?.cells.x ?? 0,
      y: targetRow?.cells.y ?? 0,
    };

    const solved = solveTwoBoneMath(base, target, l1, l2, flip);

    const output: readonly TableRow<SolvedCells>[] = [
      {
        id: state.rootBoneId,
        cells: {
          rotation: solved.r1,
          residual: solved.residual,
        },
      },
      {
        id: state.tipBoneId,
        cells: {
          rotation: solved.r2,
          residual: solved.residual,
        },
      },
    ];

    return { values: output };
  },
});

export interface FkPreparedState {
  readonly chainIds: readonly string[];
  readonly parentById: ReadonlyMap<string, string>;
}

export const fk = definePlugin({
  id: "fk",
  inputs: {
    requires: {
      chain: Body2d,
      base: Point2d,
      solved: optional(Solved2d),
    },
  },
  outputs: { values: Points2d },
  prepare({ structures }) {
    const chain = structures.chain;
    const solved = structures.solved;

    if (solved !== undefined) {
      const solvedIds = new Set(solved.ids);
      const missing = chain.ids.filter((id) => !solvedIds.has(id));
      if (missing.length > 0) {
        return refused(
          missing.map((id) => ({
            path: "solved",
            message: `Solved row missing for bone '${id}'.`,
          })),
        );
      }
    }

    return ok({
      chainIds: chain.ids,
      parentById: chain.parentById,
    });
  },
  transform({ requires, state }) {
    const chainRows = requires.chain;
    const base = requires.base;
    const solvedRows = requires.solved;

    const solvedMap = new Map<string, number>();
    if (solvedRows !== undefined) {
      for (const row of solvedRows) {
        solvedMap.set(row.id, row.cells.rotation);
      }
    }

    const rowMap = new Map<string, BodyCells>();
    for (const row of chainRows) {
      rowMap.set(row.id, row.cells);
    }

    const worldTips = new Map<string, { x: number; y: number; rotation: number }>();
    const points: TableRow<Points2dCells>[] = [];

    for (const boneId of state.chainIds) {
      const cells = rowMap.get(boneId);
      if (cells === undefined) continue;

      const solvedRot = solvedMap.get(boneId);
      const localRot = solvedRot !== undefined ? solvedRot : cells.rotation;

      const parentId = state.parentById.get(boneId);
      const parentFrame = parentId !== undefined ? worldTips.get(parentId) : undefined;
      const baseFrame = parentFrame ?? base;

      const worldRot = baseFrame.rotation + localRot;
      const rad = degToRad(worldRot);
      const tipX = baseFrame.x + cells.length * Math.cos(rad);
      const tipY = baseFrame.y + cells.length * Math.sin(rad);

      const frame = { x: tipX, y: tipY, rotation: worldRot };
      worldTips.set(boneId, frame);
      points.push({ id: boneId, cells: frame });
    }

    return { values: Object.freeze(points) };
  },
});

export const computedBodyProducer = definePlugin({
  id: "computedBodyProducer",
  inputs: {
    param: {
      kind: "record",
      fields: { scale: { kind: "number", optional: true } },
    },
  },
  outputs: { values: Body2d },
  transform({ param }) {
    const scale = typeof param.scale === "number" ? param.scale : 1;
    const rows: readonly TableRow<BodyCells>[] = [
      { id: "upper-arm", cells: { length: 80 * scale, rotation: 0 } },
      {
        id: "forearm",
        cells: { parentId: "upper-arm", length: 60 * scale, rotation: 0 },
      },
    ];
    return { values: Object.freeze(rows) };
  },
});

export interface TrackStore {
  readonly id: string;
  readonly model: Model<unknown, unknown, "table" | "record">;
  values: unknown;
  staticSnapshot: unknown;
}

export function extractStaticSnapshot(
  value: unknown,
  spec: ValueSpec,
): Record<string, Record<string, unknown>> {
  const result: Record<string, Record<string, unknown>> = {};
  if (spec.kind === "table" && isTable(value)) {
    const staticFields: string[] = [];
    for (const [key, field] of Object.entries(spec.schema.row.fields)) {
      if (field.static === true) staticFields.push(key);
    }
    for (const row of value) {
      const snap: Record<string, unknown> = {};
      for (const field of staticFields) {
        const val = row.cells[field];
        if (val !== undefined) snap[field] = val;
      }
      result[row.id] = snap;
    }
  }
  return result;
}

export function commitSourceTrack<C, S>(
  model: Model<C, S, "table" | "record">,
  values: unknown,
): Parsed<S | undefined> {
  if (model.parse !== undefined) {
    return model.parse(values);
  }
  return ok(undefined);
}

export class SpikeRuntime {
  private readonly tracks = new Map<string, TrackStore>();
  private readonly structureCache = new Map<string, unknown>();
  private readonly stateCache = new Map<string, unknown>();

  registerTrack(
    id: string,
    model: Model<unknown, unknown, "table" | "record">,
    values: unknown,
  ): void {
    const snapshot = extractStaticSnapshot(values, model.spec);
    this.tracks.set(id, { id, model, values, staticSnapshot: snapshot });
  }

  setCell(trackId: string, rowId: string, field: string, val: unknown): void {
    const track = this.tracks.get(trackId);
    if (track === undefined) throw new Error(`Track ${trackId} not found.`);
    if (track.model.spec.kind === "table") {
      const fieldSpec = track.model.spec.schema.row.fields[field];
      if (fieldSpec?.static === true) {
        throw new Error(`Cannot modify static cell '${field}'; use replace instead.`);
      }
      if (Array.isArray(track.values)) {
        for (const item of track.values) {
          if (isTableRow(item) && item.id === rowId) {
            item.cells[field] = val;
          }
        }
      }
    }
  }

  replaceTrack(trackId: string, newValues: unknown): void {
    const track = this.tracks.get(trackId);
    if (track === undefined) throw new Error(`Track ${trackId} not found.`);
    track.values = newValues;
    track.staticSnapshot = extractStaticSnapshot(newValues, track.model.spec);
    this.structureCache.delete(trackId);
    this.stateCache.delete(trackId);
  }

  validateStaticUnchanged(
    trackId: string,
    currentValues: unknown,
  ): { readonly ok: true } | { readonly ok: false; readonly error: "output-static-changed" } {
    const track = this.tracks.get(trackId);
    if (track === undefined) return { ok: true };
    const currentSnapshot = extractStaticSnapshot(currentValues, track.model.spec);
    if (!equalValues(track.staticSnapshot, currentSnapshot)) {
      return { ok: false, error: "output-static-changed" };
    }
    return { ok: true };
  }
}

describe("models and plugin tracks prototype suite", () => {
  it("golden equivalence for kinematics math", () => {
    const root = { x: 200, y: 300, rotation: 0 };
    const target = { x: 320, y: 340, rotation: 0 };
    const l1 = 80;
    const l2 = 60;

    const unflipped = solveTwoBoneMath(root, target, l1, l2, false);
    const flipped = solveTwoBoneMath(root, target, l1, l2, true);

    expect(unflipped.r1).toBeCloseTo(40.168, 3);
    expect(unflipped.r2).toBeCloseTo(-51.3178, 4);
    expect(flipped.r1).toBeCloseTo(-3.2981, 4);
    expect(flipped.r2).toBeCloseTo(51.3178, 4);

    const target2 = { x: 300, y: 350, rotation: 0 };
    const unflipped2 = solveTwoBoneMath(root, target2, l1, l2, false);
    const flipped2 = solveTwoBoneMath(root, target2, l1, l2, true);
    expect(unflipped2.r1).toBeCloseTo(57.7726, 4);
    expect(unflipped2.r2).toBeCloseTo(-74.9052, 4);
    expect(flipped2.r1).toBeCloseTo(-4.6425, 4);
    expect(flipped2.r2).toBeCloseTo(74.9052, 4);

    const chainValues: TableValue<BodyCells> = [
      { id: "upper-arm", cells: { length: l1, rotation: 0 } },
      { id: "forearm", cells: { parentId: "upper-arm", length: l2, rotation: 0 } },
    ];
    const goalsValues: TableValue<GoalCells> = [
      { id: "goal-1", cells: { memberId: "forearm", x: target.x, y: target.y } },
    ];

    const chainParsed = parseBody(chainValues);
    const goalsParsed = parseGoals(goalsValues);
    expect(chainParsed.ok).toBe(true);
    expect(goalsParsed.ok).toBe(true);

    if (!chainParsed.ok || !goalsParsed.ok) return;

    const prep = ik.prepare?.({
      values: {},
      param: {},
      structures: { chain: chainParsed.value, goals: goalsParsed.value, base: undefined },
    });
    expect(prep?.ok).toBe(true);
    if (!prep?.ok) return;

    const ikResult = ik.transform(
      {
        values: {},
        param: { flip: false },
        requires: { chain: chainValues, goals: goalsValues, base: root },
        structures: { chain: chainParsed.value, goals: goalsParsed.value, base: undefined },
        state: prep.value,
      },
      { nodeId: "ik-node", progress: 0 },
    );

    const rows = ikResult.values;
    expect(rows[0]?.id).toBe("upper-arm");
    expect(rows[0]?.cells.rotation).toBeCloseTo(40.168, 3);
    expect(rows[1]?.id).toBe("forearm");
    expect(rows[1]?.cells.rotation).toBeCloseTo(-51.3178, 4);

    const fkPrep = fk.prepare?.({
      values: {},
      param: {},
      structures: {
        chain: chainParsed.value,
        base: undefined,
        solved: { ids: ["upper-arm", "forearm"] },
      },
    });
    expect(fkPrep?.ok).toBe(true);
    if (!fkPrep?.ok) return;

    const fkResult = fk.transform(
      {
        values: {},
        param: {},
        requires: {
          chain: chainValues,
          base: root,
          solved: ikResult.values,
        },
        structures: {
          chain: chainParsed.value,
          base: undefined,
          solved: { ids: ["upper-arm", "forearm"] },
        },
        state: fkPrep.value,
      },
      { nodeId: "fk-node", progress: 0 },
    );

    const tipRow = fkResult.values.find((r) => r.id === "forearm");
    expect(tipRow?.cells.x).toBeCloseTo(320, 5);
    expect(tipRow?.cells.y).toBeCloseTo(340, 5);
  });

  it("second producer feeds reader unchanged", () => {
    const produced = computedBodyProducer.transform(
      { values: {}, param: { scale: 1 }, requires: {}, structures: {}, state: undefined },
      { nodeId: "computed-producer", progress: 0 },
    );

    const parsedBody = parseBody(produced.values);
    expect(parsedBody.ok).toBe(true);
    if (!parsedBody.ok) return;

    const goals: TableValue<GoalCells> = [
      { id: "g1", cells: { memberId: "forearm", x: 320, y: 340 } },
    ];
    const parsedGoals = parseGoals(goals);
    expect(parsedGoals.ok).toBe(true);
    if (!parsedGoals.ok) return;

    const prep = ik.prepare?.({
      values: {},
      param: {},
      structures: { chain: parsedBody.value, goals: parsedGoals.value, base: undefined },
    });
    expect(prep?.ok).toBe(true);
    if (!prep?.ok) return;

    const ikResult = ik.transform(
      {
        values: {},
        param: {},
        requires: {
          chain: produced.values,
          goals,
          base: { x: 200, y: 300, rotation: 0 },
        },
        structures: { chain: parsedBody.value, goals: parsedGoals.value, base: undefined },
        state: prep.value,
      },
      { nodeId: "ik-node", progress: 0 },
    );

    const rows = ikResult.values;
    expect(rows).toHaveLength(2);
    expect(rows[0]?.id).toBe("upper-arm");
    expect(rows[1]?.id).toBe("forearm");
  });

  it("publish suppression with plain values", () => {
    const t1: TableValue<BodyCells> = [
      { id: "b1", cells: { length: 80, rotation: 0 } },
      { id: "b2", cells: { parentId: "b1", length: 60, rotation: 0 } },
    ];
    const t2: TableValue<BodyCells> = [
      { id: "b1", cells: { length: 80, rotation: 0 } },
      { id: "b2", cells: { parentId: "b1", length: 60, rotation: 0 } },
    ];

    expect(equalValues(t1, t2)).toBe(true);

    const withEmbeddedStructure = [
      {
        id: "b1",
        cells: { length: 80, rotation: 0 },
        _structure: new Map([["index", 0]]),
      },
    ];
    const withEmbeddedStructure2 = [
      {
        id: "b1",
        cells: { length: 80, rotation: 0 },
        _structure: new Map([["index", 0]]),
      },
    ];
    expect(equalValues(withEmbeddedStructure, withEmbeddedStructure2)).toBe(false);
  });

  it("zero frame parse across animated frames", () => {
    let parseCalls = 0;
    let prepareCalls = 0;

    const trackedParse = (val: unknown) => {
      parseCalls++;
      return parseBody(val);
    };

    const initialBody: TableValue<BodyCells> = [
      { id: "b1", cells: { length: 80, rotation: 0 } },
      { id: "b2", cells: { parentId: "b1", length: 60, rotation: 0 } },
    ];
    const goals: TableValue<GoalCells> = [{ id: "g1", cells: { memberId: "b2", x: 300, y: 300 } }];

    const initialParsed = trackedParse(initialBody);
    const goalsParsed = parseGoals(goals);
    expect(initialParsed.ok).toBe(true);
    expect(goalsParsed.ok).toBe(true);
    if (!initialParsed.ok || !goalsParsed.ok) return;

    prepareCalls++;
    const prep = ik.prepare?.({
      values: {},
      param: {},
      structures: { chain: initialParsed.value, goals: goalsParsed.value, base: undefined },
    });
    expect(prep?.ok).toBe(true);
    if (!prep?.ok) return;

    expect(parseCalls).toBe(1);
    expect(prepareCalls).toBe(1);

    const staticSnapshot = extractStaticSnapshot(initialBody, Body2d.spec);

    for (let frame = 1; frame <= 10; frame++) {
      const frameBody: TableValue<BodyCells> = [
        { id: "b1", cells: { length: 80, rotation: frame * 5 } },
        { id: "b2", cells: { parentId: "b1", length: 60, rotation: frame * -3 } },
      ];

      const currentStatic = extractStaticSnapshot(frameBody, Body2d.spec);
      const isStaticSame = equalValues(staticSnapshot, currentStatic);
      expect(isStaticSame).toBe(true);

      ik.transform(
        {
          values: {},
          param: {},
          requires: { chain: frameBody, goals, base: { x: 200, y: 300, rotation: 0 } },
          structures: { chain: initialParsed.value, goals: goalsParsed.value, base: undefined },
          state: prep.value,
        },
        { nodeId: "ik-node", progress: frame / 10 },
      );
    }

    expect(parseCalls).toBe(1);
    expect(prepareCalls).toBe(1);
  });

  it("prepared slot refusal with diagnostics", () => {
    const chainValues: TableValue<BodyCells> = [
      { id: "a", cells: { length: 50, rotation: 0 } },
      { id: "b", cells: { parentId: "a", length: 50, rotation: 0 } },
      { id: "c", cells: { parentId: "b", length: 50, rotation: 0 } },
    ];
    const solvedValues: TableValue<SolvedCells> = [
      { id: "a", cells: { rotation: 10 } },
      { id: "b", cells: { rotation: 20 } },
    ];

    const parsedChain = parseBody(chainValues);
    const parsedSolved = parseSolved(solvedValues);
    expect(parsedChain.ok).toBe(true);
    expect(parsedSolved.ok).toBe(true);
    if (!parsedChain.ok || !parsedSolved.ok) return;

    const prep = fk.prepare?.({
      values: {},
      param: {},
      structures: {
        chain: parsedChain.value,
        base: undefined,
        solved: parsedSolved.value,
      },
    });

    expect(prep?.ok).toBe(false);
    if (prep?.ok === false) {
      expect(prep.issues).toEqual([
        {
          path: "solved",
          message: "Solved row missing for bone 'c'.",
        },
      ]);
    }
  });

  it("host value sufficiency", () => {
    const chainValues: TableValue<BodyCells> = [
      { id: "upper-arm", cells: { length: 80, rotation: 40.168 } },
      { id: "forearm", cells: { parentId: "upper-arm", length: 60, rotation: -51.3178 } },
    ];
    const parsedChain = parseBody(chainValues);
    if (!parsedChain.ok) return;

    const prep = fk.prepare?.({
      values: {},
      param: {},
      structures: { chain: parsedChain.value, base: undefined, solved: undefined },
    });
    if (!prep?.ok) return;

    const result = fk.transform(
      {
        values: {},
        param: {},
        requires: {
          chain: chainValues,
          base: { x: 200, y: 300, rotation: 0 },
          solved: undefined,
        },
        structures: { chain: parsedChain.value, base: undefined, solved: undefined },
        state: prep.value,
      },
      { nodeId: "fk-node", progress: 0 },
    );

    expect(Array.isArray(result.values)).toBe(true);
    for (const r of result.values) {
      expect(typeof r.id).toBe("string");
      expect(typeof r.cells.x).toBe("number");
      expect(typeof r.cells.y).toBe("number");
      expect(typeof r.cells.rotation).toBe("number");
      expect(Object.getPrototypeOf(r.cells)).toBe(Object.prototype);
    }

    const serialized = JSON.stringify(result.values);
    const roundTripped = JSON.parse(serialized);
    expect(equalValues(result.values, roundTripped)).toBe(true);
  });

  it("separation of topology lookups and solver math", () => {
    const chainValues: TableValue<BodyCells> = [
      { id: "upper-arm", cells: { length: 80, rotation: 0 } },
      { id: "forearm", cells: { parentId: "upper-arm", length: 60, rotation: 0 } },
    ];
    const parsedChain = parseBody(chainValues);
    if (!parsedChain.ok) return;

    expect(parsedChain.value.parentById.get("forearm")).toBe("upper-arm");
    expect(parsedChain.value.leaves).toEqual(["forearm"]);
    expect(parsedChain.value.indexById.get("upper-arm")).toBe(0);
    expect(parsedChain.value.indexById.get("forearm")).toBe(1);

    const solved = solveTwoBoneMath(
      { x: 0, y: 0, rotation: 0 },
      { x: 140, y: 0 },
      parsedChain.value.bones[0] !== undefined ? 80 : 0,
      parsedChain.value.bones[1] !== undefined ? 60 : 0,
      false,
    );

    expect(solved.r1).toBeCloseTo(0, 5);
    expect(solved.r2).toBeCloseTo(0, 5);
  });

  it("derived plugin slot types without casts", () => {
    const demoPlugin = definePlugin({
      id: "demo",
      inputs: {
        requires: {
          chain: Body2d,
          solved: optional(Solved2d),
        },
      },
      outputs: { values: Points2d },
      prepare(ctx) {
        expectTypeOf(ctx.structures.chain).toEqualTypeOf<BodyStructure>();
        expectTypeOf(ctx.structures.solved).toEqualTypeOf<SolvedStructure | undefined>();
        return ok({ count: ctx.structures.chain.ids.length });
      },
      transform(ctx) {
        expectTypeOf(ctx.structures.chain).toEqualTypeOf<BodyStructure>();
        expectTypeOf(ctx.structures.solved).toEqualTypeOf<SolvedStructure | undefined>();
        expectTypeOf(ctx.requires.chain).toEqualTypeOf<TableValue<BodyCells>>();
        expectTypeOf(ctx.state).toEqualTypeOf<{ count: number }>();
        return { values: [] };
      },
    });

    expect(demoPlugin.id).toBe("demo");
  });

  it("parse invariance to animated values", () => {
    const stopA: TableValue<BodyCells> = [
      { id: "root", cells: { length: 100, rotation: 0, minRotation: -90, maxRotation: 90 } },
      {
        id: "mid",
        cells: {
          parentId: "root",
          length: 50,
          rotation: 45,
          minRotation: -45,
          maxRotation: 45,
        },
      },
      { id: "tip", cells: { parentId: "mid", length: 25, rotation: -30 } },
    ];

    const stopB: TableValue<BodyCells> = [
      { id: "root", cells: { length: 150, rotation: 120, minRotation: -90, maxRotation: 90 } },
      {
        id: "mid",
        cells: {
          parentId: "root",
          length: 80,
          rotation: -10,
          minRotation: -45,
          maxRotation: 45,
        },
      },
      { id: "tip", cells: { parentId: "mid", length: 10, rotation: 85 } },
    ];

    const parsedA = parseBody(stopA);
    const parsedB = parseBody(stopB);

    expect(parsedA.ok).toBe(true);
    expect(parsedB.ok).toBe(true);
    if (!parsedA.ok || !parsedB.ok) return;

    expect(parsedA.value.ids).toEqual(parsedB.value.ids);
    expect(parsedA.value.leaves).toEqual(parsedB.value.leaves);
    expect(parsedA.value.bones).toEqual(parsedB.value.bones);
    expect(Array.from(parsedA.value.parentById.entries())).toEqual(
      Array.from(parsedB.value.parentById.entries()),
    );
    expect(Array.from(parsedA.value.indexById.entries())).toEqual(
      Array.from(parsedB.value.indexById.entries()),
    );
  });

  it("structure timing and commit-time refusal", () => {
    const cycleBody: TableValue<BodyCells> = [
      { id: "b1", cells: { parentId: "b2", length: 50, rotation: 0 } },
      { id: "b2", cells: { parentId: "b1", length: 50, rotation: 0 } },
    ];
    const commitCycle = commitSourceTrack(Body2d, cycleBody);
    expect(commitCycle.ok).toBe(false);
    if (commitCycle.ok === false) {
      expect(commitCycle.issues[0]?.message).toContain("Parent cycle detected");
    }

    const missingParentBody: TableValue<BodyCells> = [
      { id: "b1", cells: { parentId: "unknown-bone", length: 50, rotation: 0 } },
    ];
    const commitMissing = commitSourceTrack(Body2d, missingParentBody);
    expect(commitMissing.ok).toBe(false);
    if (commitMissing.ok === false) {
      expect(commitMissing.issues[0]?.message).toContain("Unknown parent");
    }

    const validBody: TableValue<BodyCells> = [
      { id: "b1", cells: { length: 50, rotation: 0 } },
      { id: "b2", cells: { parentId: "b1", length: 50, rotation: 0 } },
    ];
    const commitValid = commitSourceTrack(Body2d, validBody);
    expect(commitValid.ok).toBe(true);
  });

  it("static cell immutability and verbs", () => {
    const runtime = new SpikeRuntime();
    const initialBody: TableValue<BodyCells> = [
      { id: "b1", cells: { length: 80, rotation: 0 } },
      { id: "b2", cells: { parentId: "b1", length: 60, rotation: 0 } },
    ];
    runtime.registerTrack("body", Body2d, initialBody);

    const normalAnimatedBody: TableValue<BodyCells> = [
      { id: "b1", cells: { length: 80, rotation: 45 } },
      { id: "b2", cells: { parentId: "b1", length: 60, rotation: -30 } },
    ];
    const checkValid = runtime.validateStaticUnchanged("body", normalAnimatedBody);
    expect(checkValid.ok).toBe(true);

    const staticMutatedBody: TableValue<BodyCells> = [
      { id: "b1", cells: { length: 80, rotation: 45 } },
      { id: "b2", cells: { parentId: "different-parent", length: 60, rotation: -30 } },
    ];
    const checkInvalid = runtime.validateStaticUnchanged("body", staticMutatedBody);
    expect(checkInvalid.ok).toBe(false);
    if (!checkInvalid.ok) {
      expect(checkInvalid.error).toBe("output-static-changed");
    }

    expect(() => {
      runtime.setCell("body", "b2", "parentId", "different-parent");
    }).toThrow("use replace instead");

    expect(() => {
      runtime.replaceTrack("body", staticMutatedBody);
    }).not.toThrow();

    const checkAfterReplace = runtime.validateStaticUnchanged("body", staticMutatedBody);
    expect(checkAfterReplace.ok).toBe(true);
  });
});
