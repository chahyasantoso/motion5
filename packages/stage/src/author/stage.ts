import type { Events, Pose2d, Span, Time } from "@gerak/core";
import type { CastBuilder, Members } from "./cast";
import type { ScrollBeat, TriggerBeat } from "./beat";
import type { Carry, Frame, Rest, RestReader } from "./layout";

/** A list's pose in the scene: the pose of item `index` of `count`. */
export type ListPose = (index: number, count: number) => Pose2d;

/** Every member name of a cast, group children included. */
export type MemberName<M> = {
  [K in keyof M & string]:
    | K
    | (M[K] extends { readonly kind: "group"; readonly members: infer G } ? MemberName<G> : never);
}[keyof M & string];

/** The member named `K` in a cast, looked up inside groups too. */
export type MemberOf<M, K> = K extends keyof M
  ? M[K]
  : {
      [G in keyof M]: M[G] extends { readonly kind: "group"; readonly members: infer H }
        ? MemberOf<H, K>
        : never;
    }[keyof M];

/** What the scene returns: a pose per actor or group, a `ListPose` per list, all named flat. */
export type Targets<M> = string extends keyof M
  ? Readonly<Record<string, Pose2d | ListPose | undefined>>
  : {
      readonly [K in MemberName<M>]?: MemberOf<M, K> extends { readonly kind: "list" }
        ? ListPose
        : Pose2d;
    };

/** A list pose from per-item data: item `index` takes `pose(items[index], index)`, one past the data none. */
export function each<T>(items: readonly T[], pose: (item: T, index: number) => Pose2d): ListPose {
  return (index) => {
    const item = items[index];
    return item === undefined ? {} : pose(item, index);
  };
}

/** Beats by name, each a `Span`: `beats.enter.of(time)` is time inside it. */
export type Beats<B extends string = string> = Readonly<Record<B, Span>>;

/** What the scene reads each frame. */
export interface SceneContext<B extends string = string, L extends string = string> {
  readonly time: Time;
  readonly beats: Beats<B>;
  readonly events: Events;
  /** Rest boxes of the layout showing now. */
  readonly rest: RestReader;
  readonly layouts: Readonly<Record<L, RestReader>>;
  readonly carry: Carry;
  /** Visual line index per list item, measured from layout on a page mount. */
  readonly lines?: Readonly<Record<string, readonly number[]>> | undefined;
  /** Only these elements run; the rest are left out of the answer. */
  readonly only?: ReadonlySet<string> | undefined;
  /** Filled as elements run: which can change with the clock alone, with no new input. */
  readonly moves?: Map<string, Moves> | undefined;
  /** Filled as elements run: what drives each, besides its windows' time and the measured boxes. */
  readonly drives?: Map<string, Drive> | undefined;
}

/** What drives an element: only scroll, through scroll beats without `smooth`; only one trigger
 * beat's progress; or more, such as the clock, a spring, events or another element. */
export type Drive =
  | { readonly kind: "scroll"; readonly beats: readonly ScrollBeat[] }
  | { readonly kind: "trigger"; readonly beat: TriggerBeat }
  | { readonly kind: "more" };

/** How an element can change with no new input: `time` while a beat, trigger or spring is still running;
 * `maybe` when a motion read the clock or another element, or has no window. */
export type Moves = "time" | "maybe";

/** Named layouts: `pick` answers which shows after the given events, and `rests` measures each headless. */
export interface LayoutsInput<L extends string = string> {
  readonly names: readonly [L, ...L[]];
  readonly pick?: ((events: Events) => L) | undefined;
  readonly rests?: Readonly<Record<L, Rest>> | undefined;
}

/** The DOM skin: CSS and SVG defs as strings, or as URLs of files beside the piece. */
export type DomSkinInput =
  | { readonly css: string; readonly defs?: string | undefined }
  | { readonly css: URL; readonly defs?: URL | undefined };

/** Whether `value` is a DOM skin: `{ css }` with an optional `defs`, both strings or both URLs. */
export function isDomSkin(value: unknown): value is DomSkinInput {
  if (typeof value !== "object" || value === null) return false;
  const css: unknown = Reflect.get(value, "css");
  const defs: unknown = Reflect.get(value, "defs");
  if (typeof css === "string") return defs === undefined || typeof defs === "string";
  if (css instanceof URL) return defs === undefined || defs instanceof URL;
  return false;
}

/** Review limits of one target, overriding the command's defaults. */
export interface Limits {
  readonly jump?: number | undefined;
  readonly turn?: number | undefined;
  readonly ratio?: number | undefined;
}

/** A compiled page section selector measured into rest by `mountPage`. */
export interface CompiledSection {
  readonly name: string;
  readonly node: string;
}

/** A piece as written: beats in ms, a cast, and a scene from time to poses. */
export interface StageOptions<B extends string, M extends Members<B>, L extends string> {
  readonly beats: Readonly<Record<B, readonly [number, number]>>;
  /** Defaults to the last beat's end; longer holds the end. */
  readonly durationMs?: number | undefined;
  readonly frame?: Frame | undefined;
  readonly cast: (m: CastBuilder<NoInfer<B>>) => M;
  readonly rest?: Rest | undefined;
  readonly layouts?: LayoutsInput<L> | undefined;
  readonly skins?: { readonly dom?: DomSkinInput | undefined } | undefined;
  readonly cues?: Events | undefined;
  readonly limits?: Readonly<Record<string, Limits>> | undefined;
  /** True when the scene binds existing page nodes and takes no skin. */
  readonly isPage?: boolean | undefined;
  /** Minimum ms a page clock stays alive after an input event for triggers and springs to settle. */
  readonly settleMs?: number | undefined;
  /** Named sections referenced by scroll points in this scene. */
  readonly sections?: readonly CompiledSection[] | undefined;
  readonly scene: (context: SceneContext<NoInfer<B>, NoInfer<L>>) => Targets<NoInfer<M>>;
}

/** A piece as `defineStage` returns it, before `compileStage` checks it. */
export interface StageDefinition<
  B extends string = string,
  M extends Members<B> = Members<B>,
  L extends string = string,
> extends StageOptions<B, M, L> {
  readonly kind: "stage-definition";
}

/** Declares a piece; its beat and layout names type the cast's `on` and the scene's context. */
export function defineStage<
  const B extends string,
  M extends Members<B>,
  const L extends string = never,
>(options: StageOptions<B, M, L>): StageDefinition<B, M, L> {
  return Object.freeze({ ...options, kind: "stage-definition" });
}

/** Whether `value` reads as what `defineStage` returns: `kind` only, so a second copy of the package passes. */
export function isStageDefinition(value: unknown): value is StageDefinition {
  return (
    typeof value === "object" && value !== null && Reflect.get(value, "kind") === "stage-definition"
  );
}
