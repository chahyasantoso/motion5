import {
  NO_EVENTS,
  isMotionEvent,
  mergeEvents,
  type Events,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import { compileBeats, type BeatsInput, type CompiledBeats } from "../beats/index";
import {
  compileCast,
  createCastBuilder,
  type CastBuilder,
  type CompiledMembers,
  type Member,
} from "../cast/index";
import {
  DEFAULT_FRAME,
  NO_REST,
  type Box,
  type CarryFn,
  type Frame,
  type LayoutSpec,
  type Layouts,
  type LayoutsInput,
  type Rest,
  type RestReader,
} from "../layout/index";
import {
  buildReviewSpec,
  type CompiledReviewSpec,
  type MotionExpectation,
  type TargetLimits,
} from "../review/index";
import { compileSkins, type CompiledSkins, type StageSkinsInput } from "../skins/index";
import type { CompileResult, StageError } from "./errors";

/** Supported pose coordinate modes for a stage definition. */
export type PoseMode = "2d" | "3d";

/** Pose type selected by `PoseMode`: `Pose2d` for `"2d"`, `Pose3d` for `"3d"`. */
export type PoseFor<P extends PoseMode = "2d"> = P extends "2d" ? Pose2d : Pose3d;

type ExpectationOf<M> = M extends { readonly meta: { readonly expectation?: infer E } }
  ? Exclude<E, undefined> extends MotionExpectation
    ? Exclude<E, undefined>
    : MotionExpectation
  : MotionExpectation;

type UnionToIntersection<U> = (U extends unknown ? (arg: U) => void : never) extends (
  arg: infer I,
) => void
  ? I
  : never;

type ChildTargets<M, P extends PoseMode> = M extends {
  readonly kind: "group";
  readonly members: infer Children;
}
  ? NestedTargets<Children, P>
  : Readonly<Record<never, never>>;

type NestedTargets<C, P extends PoseMode> = string extends keyof C
  ? Readonly<Record<string, PoseFor<P> | readonly PoseFor<P>[] | undefined>>
  : keyof C extends never
    ? Readonly<Record<never, never>>
    : { readonly [K in keyof C & string]?: MemberSelfValue<C[K], P> } & UnionToIntersection<
        { readonly [K in keyof C]: ChildTargets<C[K], P> }[keyof C]
      >;

type MemberSelfValue<M, P extends PoseMode> =
  ExpectationOf<M> extends "static"
    ? never
    : M extends { readonly kind: "list" }
      ? readonly PoseFor<P>[] | undefined
      : PoseFor<P> | undefined;

/** Flattened scene return object type enforcing static/list/actor shape per cast member. */
export type FlattenedTargets<C, P extends PoseMode = "2d"> = keyof C extends never
  ? Readonly<Record<string, never>>
  : NestedTargets<C, P>;

type ChildKeys<M> = M extends { readonly kind: "group"; readonly members: infer Children }
  ? CastKeys<Children>
  : never;

/** Recursive union of cast member keys extracted from a cast tree `C`. */
export type CastKeys<C> = string extends keyof C
  ? string
  : (keyof C & string) | { [K in keyof C]: ChildKeys<C[K]> }[keyof C];

/** Frame context passed to a stage `scene` callback. */
export interface SceneContext<
  P extends PoseMode = "2d",
  B extends string = string,
  L extends string = never,
> {
  readonly time: Time;
  readonly beats: CompiledBeats<B>;
  readonly events: Events;
  readonly rest: RestReader;
  readonly layouts: Readonly<Record<L, RestReader>>;
  readonly carry: CarryFn;
}

/** Input options accepted by `defineStage`. */
export interface StageOptions<
  P extends PoseMode = "2d",
  B extends string = string,
  C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
  L extends string = never,
> {
  readonly pose?: P | undefined;
  readonly durationMs?: number | undefined;
  readonly frame?: Frame | undefined;
  readonly beats: BeatsInput<B>;
  readonly cast: (m: CastBuilder<NoInfer<B>>) => C;
  readonly rest?: Rest | undefined;
  readonly layouts?: LayoutsInput<L> | undefined;
  readonly skins?:
    | StageSkinsInput<CastKeys<NoInfer<C>> extends never ? string : CastKeys<NoInfer<C>>>
    | undefined;
  readonly cues?: Events | undefined;
  readonly style?: string | undefined;
  readonly design?: unknown;
  readonly limits?: Readonly<Record<string, TargetLimits>> | undefined;
  readonly scene: (
    ctx: SceneContext<NoInfer<P>, NoInfer<B>, NoInfer<L>>,
  ) => FlattenedTargets<NoInfer<C>, NoInfer<P>>;
}

/** Frozen authored stage definition returned by `defineStage` before compilation. */
export interface StageDefinition<
  P extends PoseMode = "2d",
  B extends string = string,
  C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
  L extends string = never,
> extends StageOptions<P, B, C, L> {
  readonly kind: "stage-definition";
}

/** Validated runtime stage contract consumed by renderers and headless tools. */
export interface CompiledStage<P extends PoseMode = "2d"> {
  readonly pose: P;
  readonly beats: CompiledBeats<string>;
  readonly frame: Frame;
  readonly members: CompiledMembers;
  readonly layout: LayoutSpec<string>;
  readonly skins: CompiledSkins;
  readonly cues: Events;
  readonly review: CompiledReviewSpec;
}

type SceneRunner<P extends PoseMode = PoseMode> = (ctx: SceneContext<P, string, string>) => unknown;

const DEFINED_STAGES = new WeakSet<object>();
const SCENE_RUNNERS = new WeakMap<CompiledStage<PoseMode>, SceneRunner<PoseMode>>();

/** Marks a frozen definition object as created by `defineStage`. */
export function markStageDefinition(value: object): void {
  DEFINED_STAGES.add(value);
}

/** Whether `value` was created by `defineStage`. */
export function isStageDefinition(value: unknown): value is StageDefinition<PoseMode> {
  return typeof value === "object" && value !== null && DEFINED_STAGES.has(value);
}

/** Whether `value` is a compiled stage returned by `compileStage`. */
export function isCompiledStage(value: unknown): value is CompiledStage<PoseMode> {
  if (!isPlainRecord(value)) return false;
  const pose = value["pose"];
  return (
    (pose === "2d" || pose === "3d") && "members" in value && "beats" in value && !("kind" in value)
  );
}

/** Narrows a `CompiledStage` to `"2d"` pose stages when `stage.pose === "2d"`. */
export function isStage2d(stage: CompiledStage<PoseMode>): stage is CompiledStage<"2d"> {
  return stage.pose === "2d";
}

/** Internal lookup returning the validated scene callback bound to `stage`. */
export function sceneRunnerOf<P extends PoseMode>(
  stage: CompiledStage<P>,
): SceneRunner<P> | undefined {
  return SCENE_RUNNERS.get(stage);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBox(value: unknown): value is Box {
  return (
    isPlainRecord(value) &&
    isFiniteNumber(value["x"]) &&
    isFiniteNumber(value["y"]) &&
    isFiniteNumber(value["width"]) &&
    isFiniteNumber(value["height"])
  );
}

function isRest(value: unknown): value is Rest {
  return isPlainRecord(value) && Object.values(value).every(isBox);
}

function isLayouts(value: unknown): value is Layouts {
  return isPlainRecord(value) && Object.values(value).every(isRest);
}

function compileFrame(value: unknown, errors: StageError[]): Frame {
  if (value === undefined) return DEFAULT_FRAME;
  if (
    !isPlainRecord(value) ||
    !isFiniteNumber(value["width"]) ||
    !isFiniteNumber(value["height"]) ||
    value["width"] <= 0 ||
    value["height"] <= 0
  ) {
    errors.push({
      kind: "invalid_definition",
      field: "frame",
      reason: "`frame` must have positive finite `width` and `height`.",
    });
    return DEFAULT_FRAME;
  }
  return Object.freeze({ width: value["width"], height: value["height"] });
}

function compileLimits(
  value: unknown,
  errors: StageError[],
): Readonly<Record<string, TargetLimits>> {
  if (value === undefined) return Object.freeze({});
  if (!isPlainRecord(value)) {
    errors.push({
      kind: "invalid_definition",
      field: "limits",
      reason: "`limits` must be a record of target name to { jump?, turn?, ratio? }.",
    });
    return Object.freeze({});
  }
  const out: Record<string, TargetLimits> = {};
  for (const [target, entry] of Object.entries(value)) {
    if (!isPlainRecord(entry)) {
      errors.push({
        kind: "invalid_definition",
        field: "limits",
        reason: `\`limits.${target}\` must be { jump?, turn?, ratio? }.`,
      });
      continue;
    }
    const own: { jump?: number; turn?: number; ratio?: number } = {};
    for (const [field, limit] of Object.entries(entry)) {
      if (field !== "jump" && field !== "turn" && field !== "ratio") {
        errors.push({
          kind: "invalid_definition",
          field: "limits",
          reason: `\`limits.${target}.${field}\` must be jump, turn, or ratio.`,
        });
        continue;
      }
      if (!isFiniteNumber(limit) || limit < 0) {
        errors.push({
          kind: "invalid_definition",
          field: "limits",
          reason: `\`limits.${target}.${field}\` must be a finite number >= 0.`,
        });
        continue;
      }
      own[field] = limit;
    }
    out[target] = Object.freeze(own);
  }
  return Object.freeze(out);
}

function compileLayouts(
  rawLayouts: unknown,
  rawRest: unknown,
  errors: StageError[],
): LayoutSpec<string> {
  if (rawLayouts === undefined) {
    if (rawRest === undefined) return Object.freeze({ kind: "single" });
    if (!isRest(rawRest)) {
      errors.push({
        kind: "invalid_definition",
        field: "rest",
        reason: "`rest` must map member names to { x, y, width, height } boxes.",
      });
      return Object.freeze({ kind: "single" });
    }
    return Object.freeze({ kind: "single", rest: Object.freeze({ ...rawRest }) });
  }

  if (rawRest !== undefined)
    errors.push({
      kind: "invalid_definition",
      field: "rest",
      reason: "give `layouts.rests` on multi-layout stages rather than top-level `rest`.",
    });

  if (!isPlainRecord(rawLayouts)) {
    errors.push({
      kind: "invalid_definition",
      field: "layouts",
      reason: "`layouts` must be `{ names, pick?, rests? }`.",
    });
    return Object.freeze({ kind: "single" });
  }

  const rawNames = rawLayouts["names"];
  if (!Array.isArray(rawNames) || rawNames.length === 0) {
    errors.push({ kind: "empty_layouts" });
    return Object.freeze({ kind: "single" });
  }
  if (!rawNames.every((name): name is string => typeof name === "string" && name.length > 0)) {
    errors.push({
      kind: "invalid_definition",
      field: "layouts",
      reason: "`layouts.names` must hold non-empty strings.",
    });
    return Object.freeze({ kind: "single" });
  }
  const [first, ...restNames] = rawNames;
  if (first === undefined) {
    errors.push({ kind: "empty_layouts" });
    return Object.freeze({ kind: "single" });
  }
  const names: readonly [string, ...string[]] = Object.freeze([first, ...restNames]);
  if (new Set(names).size !== names.length) {
    errors.push({
      kind: "invalid_definition",
      field: "layouts",
      reason: "`layouts.names` names a layout twice.",
    });
    return Object.freeze({ kind: "single" });
  }

  const rawPick = rawLayouts["pick"];
  if (rawPick !== undefined && typeof rawPick !== "function") {
    errors.push({
      kind: "invalid_initial_layout",
      message: "`layouts.pick` must be a function of events.",
    });
    return Object.freeze({ kind: "single" });
  }

  const pick = (events: Events): string => {
    if (typeof rawPick !== "function") return first;
    const answer: unknown = Reflect.apply(rawPick, undefined, [events]);
    if (typeof answer === "string" && names.includes(answer)) return answer;
    throw new RangeError(
      `layout answered ${JSON.stringify(answer)}, which is not one of ${names.join(", ")}.`,
    );
  };

  if (typeof rawPick === "function") {
    try {
      pick(NO_EVENTS);
    } catch (thrown) {
      const why = thrown instanceof Error ? thrown.message : String(thrown);
      errors.push({
        kind: "invalid_initial_layout",
        message: `\`pick([])\` failed to pick an initial layout: ${why}`,
      });
    }
  }

  const rawRests = rawLayouts["rests"];
  let rests: Readonly<Record<string, Rest>> | undefined;
  if (rawRests !== undefined) {
    if (!isLayouts(rawRests)) {
      errors.push({
        kind: "invalid_definition",
        field: "layouts",
        reason: "`layouts.rests` must map layout names to rest records.",
      });
    } else {
      const missing = names.find((name) => !Object.hasOwn(rawRests, name));
      if (missing !== undefined)
        errors.push({
          kind: "invalid_initial_layout",
          message: `\`layouts.rests\` is missing a rest for layout "${missing}".`,
        });
      else rests = Object.freeze({ ...rawRests });
    }
  } else {
    rests = Object.freeze(Object.fromEntries(names.map((name) => [name, NO_REST] as const)));
  }

  return Object.freeze({
    kind: "multi",
    names,
    pick,
    ...(rests === undefined ? {} : { rests }),
  });
}

/** Validates and compiles a `StageDefinition` (or unknown input) into a `CompiledStage`. */
export function compileStage<
  P extends PoseMode = "2d",
  B extends string = string,
  C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
  L extends string = never,
>(definition: StageDefinition<P, B, C, L>): CompileResult<CompiledStage<P>>;
export function compileStage(definition: unknown): CompileResult<CompiledStage<PoseMode>>;
export function compileStage(definition: unknown): CompileResult<CompiledStage<PoseMode>> {
  if (!isPlainRecord(definition))
    return {
      ok: false,
      errors: [
        {
          kind: "invalid_definition",
          field: "stage",
          reason: "stage definition must be an object.",
        },
      ],
    };

  const errors: StageError[] = [];
  const rawPose = definition["pose"];
  const pose: PoseMode = rawPose === "3d" ? "3d" : "2d";
  if (rawPose !== undefined && rawPose !== "2d" && rawPose !== "3d")
    errors.push({
      kind: "invalid_definition",
      field: "pose",
      reason: `\`pose\` must be "2d" or "3d", got ${String(rawPose)}.`,
    });

  const scene = definition["scene"];
  if (typeof scene !== "function")
    errors.push({
      kind: "invalid_definition",
      field: "scene",
      reason: "`scene` must be a function.",
    });

  const beatsResult = compileBeats(definition["beats"], definition["durationMs"]);
  if (!beatsResult.ok)
    errors.push({
      kind: "invalid_definition",
      field: beatsResult.field,
      reason: beatsResult.reason,
    });

  const frame = compileFrame(definition["frame"], errors);
  const layout = compileLayouts(definition["layouts"], definition["rest"], errors);

  const skinsResult = compileSkins(definition["skins"]);
  if (!skinsResult.ok)
    errors.push({ kind: "invalid_definition", field: "skins", reason: skinsResult.reason });

  const rawCues = definition["cues"];
  let cues: Events = NO_EVENTS;
  if (rawCues !== undefined) {
    if (!Array.isArray(rawCues) || !rawCues.every(isMotionEvent))
      errors.push({
        kind: "invalid_definition",
        field: "cues",
        reason: "`cues` must be a list of `{ name, at, target? }` events.",
      });
    else cues = mergeEvents(rawCues);
  }

  const rawStyle = definition["style"];
  if (rawStyle !== undefined && typeof rawStyle !== "string")
    errors.push({
      kind: "invalid_definition",
      field: "style",
      reason: "`style` must be a style card name string.",
    });
  const limits = compileLimits(definition["limits"], errors);

  const rawCast = definition["cast"];
  let castResult: ReturnType<typeof compileCast> | undefined;
  if (typeof rawCast !== "function") {
    errors.push({
      kind: "invalid_definition",
      field: "cast",
      reason: "`cast` must be a `(m) => ({ ... })` builder callback.",
    });
  } else if (beatsResult.ok) {
    try {
      const built: unknown = Reflect.apply(rawCast, undefined, [createCastBuilder()]);
      castResult = compileCast(built, beatsResult.beats);
      if (!castResult.ok) errors.push(...castResult.errors);
    } catch (thrown) {
      errors.push({
        kind: "invalid_definition",
        field: "cast",
        reason: thrown instanceof Error ? thrown.message : String(thrown),
      });
    }
  }

  if (
    errors.length > 0 ||
    !beatsResult.ok ||
    !skinsResult.ok ||
    castResult === undefined ||
    !castResult.ok ||
    typeof scene !== "function"
  ) {
    return { ok: false, errors: Object.freeze(errors) };
  }

  const review = buildReviewSpec({
    members: castResult.reviewMembers,
    limits,
    ...(typeof rawStyle === "string" ? { style: rawStyle } : {}),
    ...(definition["design"] === undefined ? {} : { design: definition["design"] }),
  });

  const stage: CompiledStage<PoseMode> = Object.freeze({
    pose,
    beats: beatsResult.beats,
    frame,
    members: castResult.members,
    layout,
    skins: skinsResult.skins,
    cues,
    review,
  });

  SCENE_RUNNERS.set(stage, (ctx) => Reflect.apply(scene, undefined, [ctx]));
  return { ok: true, stage };
}
