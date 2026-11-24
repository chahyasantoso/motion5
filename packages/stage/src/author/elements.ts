import {
  unreachable,
  type Cubic2d,
  type Ease,
  type Events,
  type InWindow,
  type Lens3d,
  type Motion,
  type Pose2d,
  type Pose3d,
  type Signal,
  type Span,
  type Time,
} from "@gerak/core";
import { placementOf } from "../render/placement";
import { makeScrollPoint, type Beat, type ScrollBeat, type ScrollPoint } from "./beat";
import type { Path } from "./cast";
import type { Carry, RestReader } from "./layout";
import type { Limits } from "./stage";

/** What stays true of an element in any scene: whether pointer events reach it. */
export interface ElementOptions {
  readonly watch?: boolean | undefined;
}

/** Options of `box`: whether it binds to a list of parts. */
export interface BoxOptions extends ElementOptions {
  readonly parts?: boolean | undefined;
}

/** Options of `text`: how to split it into parts. */
export interface TextOptions extends ElementOptions {
  readonly split?: "letters" | "words" | undefined;
}

/** What a shape draws: a path, or a base outline with the outlines it blends to. */
export type Outline =
  | { readonly kind: "path"; readonly path: Path }
  | {
      readonly kind: "morph";
      readonly base: readonly Cubic2d[];
      readonly targets: readonly (readonly Cubic2d[])[];
    };

/** An element's measured edges as scroll points: top, end, and sticky pin start/end. */
export interface Edges {
  readonly top: ScrollPoint;
  readonly end: ScrollPoint;
  readonly pinStart: ScrollPoint;
  readonly pinEnd: ScrollPoint;
}

/** What an element is, before its edges. */
export type ElementBody =
  | {
      readonly kind: "box";
      readonly name: string;
      readonly parts?: boolean | undefined;
      readonly options: ElementOptions;
    }
  | {
      readonly kind: "shape";
      readonly name: string;
      readonly outline: Outline;
      readonly options: ElementOptions;
    }
  | {
      readonly kind: "text";
      readonly name: string;
      readonly content?: ((time: Time) => string) | undefined;
      readonly split: "letters" | "words" | undefined;
      readonly options: ElementOptions;
    };

/** An element of a piece, made once with a name; `kind` says what it is. */
export type Element = ElementBody & Edges & ElementMethods;

/** Where an object is drawn: the element bound to the page's canvas, and the fixed lens the page draws through. */
export interface ObjectView {
  readonly canvas: Element;
  readonly lens: Lens3d;
}

/** Options of `object`: its view for slot travel, and whether `parts: true` binds a list of objects. */
export interface ObjectOptions {
  readonly view?: ObjectView | undefined;
  readonly parts?: boolean | undefined;
}

/** A Three.js object of a piece, posed in `Pose3d` world units and drawn by `threeBinder`, never by a DOM renderer. */
export interface ObjectElement extends ObjectMethods {
  readonly kind: "object";
  readonly name: string;
  readonly view: ObjectView | undefined;
  readonly parts?: boolean | undefined;
}

/** Any element of a piece: one a DOM renderer draws, or a Three.js object. */
export type SceneElement = Element | ObjectElement;

/** A base outline with the outlines it blends to. */
export interface MorphSource {
  readonly base: readonly Cubic2d[];
  readonly targets: readonly (readonly Cubic2d[])[];
}

/** What `shape` draws: a path, or a morph. */
export type ShapeSource = Path | MorphSource;

function named<N extends string>(maker: string, name: N): N {
  if (typeof name !== "string" || name === "")
    throw new TypeError(`${maker}: an element needs a name.`);
  return name;
}

/** `made` with `.top`, `.end`, `.pinStart`, and `.pinEnd` scroll points on its rest box. */
function edged(made: ElementBody): Element {
  const name = made.name;
  let element: Element | undefined;
  const self = (): Element => {
    if (element === undefined)
      throw new Error(`"${name}": its edges were read before it was made.`);
    return element;
  };
  const top = makeScrollPoint(
    (rest) => rest.get(name).y - rest.get(name).height / 2,
    undefined,
    self,
  );
  const end = makeScrollPoint(
    (rest) => rest.get(name).y + rest.get(name).height / 2,
    undefined,
    self,
  );
  const pickEdge = (edge: "start" | "end", start: number, finish: number): number => {
    switch (edge) {
      case "start":
        return start;
      case "end":
        return finish;
      default:
        return unreachable(edge);
    }
  };
  const pinEdge = (edge: "start" | "end"): ScrollPoint =>
    makeScrollPoint(
      (rest) => {
        const box = rest.get(name);
        const placement = placementOf(box);
        switch (placement.kind) {
          case "sticky":
            return pickEdge(edge, placement.minY, placement.maxY);
          case "flow":
          case "fixed":
            return pickEdge(edge, box.y - box.height / 2, box.y + box.height / 2);
          default:
            return unreachable(placement);
        }
      },
      undefined,
      self,
    );
  const pinStart = pinEdge("start");
  const pinEnd = pinEdge("end");
  const full: Element = {
    ...made,
    top,
    end,
    pinStart,
    pinEnd,
    ...elementMethods(self),
  };
  hideMethods(full);
  element = Object.freeze(full);
  return full;
}

function optionsOf(options: ElementOptions | undefined): ElementOptions {
  const { watch } = options ?? {};
  return Object.freeze({
    ...(watch === undefined ? {} : { watch }),
  });
}

/** A page element styled by CSS; `parts: true` binds it to a list of parts. */
export function box<N extends string = string>(
  name: N,
  options: BoxOptions & { readonly parts: true },
): Element & { readonly name: N; readonly parts: true };
export function box<N extends string = string>(
  name: N,
  options?: BoxOptions,
): Element & { readonly name: N };
export function box<N extends string = string>(name: N, options?: BoxOptions): Element {
  const own = named("box", name);
  const opts = optionsOf(options);
  return options?.parts === true
    ? edged({ kind: "box", name: own, parts: true, options: opts })
    : edged({ kind: "box", name: own, options: opts });
}

function isMorph(value: ShapeSource): value is MorphSource {
  return typeof value === "object" && !Array.isArray(value);
}

/** A drawn path, or a morph between outlines: 0 is `base`, 1 is `targets[0]`. */
export function shape<N extends string = string>(
  name: N,
  outline: ShapeSource,
  options?: ElementOptions,
): Element & { readonly name: N };
export function shape(name: string, outline: ShapeSource, options?: ElementOptions): Element {
  const drawn: Outline = isMorph(outline)
    ? { kind: "morph", base: outline.base, targets: outline.targets }
    : { kind: "path", path: outline };
  return edged({
    kind: "shape",
    name: named("shape", name),
    outline: Object.freeze(drawn),
    options: optionsOf(options),
  });
}

/** Text in the markup, or text a function of time writes; `split` gives one part per letter or word. */
export function text<N extends string = string>(
  name: N,
  options?: TextOptions,
): Element & { readonly name: N };
export function text<N extends string = string>(
  name: N,
  content: (time: Time) => string,
  options?: ElementOptions,
): Element & { readonly name: N };
export function text<N extends string = string>(
  name: N,
  second?: TextOptions | ((time: Time) => string),
  third?: ElementOptions,
): Element {
  const own = named("text", name);
  if (typeof second === "function") {
    if (third !== undefined && Reflect.get(third, "split") !== undefined)
      throw new TypeError(`text "${own}": a readout cannot be split into parts.`);
    return edged({
      kind: "text",
      name: own,
      content: second,
      split: undefined,
      options: optionsOf(third),
    });
  }
  if (second !== undefined && (typeof second !== "object" || second === null))
    throw new TypeError(`text "${own}": the markup holds a text element's string.`);
  return edged({
    kind: "text",
    name: own,
    split: second?.split,
    options: optionsOf(second),
  });
}

/** A Three.js object; `parts: true` binds it to an `Object3D[]` or `Group`'s children. */
export function object<N extends string = string>(
  name: N,
  options: ObjectOptions & { readonly parts: true },
): ObjectElement & { readonly name: N; readonly parts: true };
export function object<N extends string = string>(
  name: N,
  options?: ObjectOptions,
): ObjectElement & { readonly name: N };
export function object<N extends string = string>(
  name: N,
  options?: ObjectOptions,
): ObjectElement & { readonly name: N; readonly parts?: true } {
  const view = options?.view;
  if (view !== undefined && (typeof view.lens.fov !== "number" || view.canvas.kind !== "box"))
    throw new TypeError(
      `object "${name}": \`view\` needs a \`canvas\` box and a \`lens\` with a fov.`,
    );
  const own = named("object", name);
  const resolvedView =
    view === undefined ? undefined : Object.freeze({ canvas: view.canvas, lens: view.lens });
  let made: (ObjectElement & { readonly name: N; readonly parts?: true }) | undefined;
  const self = (): ObjectElement => {
    if (made === undefined) throw new Error(`"${own}": it was bound before it was made.`);
    return made;
  };
  const full: ObjectElement & { readonly name: N; readonly parts?: true } =
    options?.parts === true
      ? { kind: "object", name: own, view: resolvedView, parts: true, ...objectMethods(self) }
      : { kind: "object", name: own, view: resolvedView, ...objectMethods(self) };
  hideMethods(full);
  made = Object.freeze(full);
  return made;
}

/** What a motion reads each frame, beside the time it plays in. */
export interface MotionContext {
  /** The scene's time, before the motion's `in` and `loop` remap it. */
  readonly time: Time;
  readonly events: Events;
  /** Which part of a list element this call poses, and how many parts there are. */
  readonly index?: number;
  readonly count?: number;
  /** Which wrapped visual line this part sits on; measured from layout on a page mount, 0 headless. */
  readonly line?: number;
  readonly rest: RestReader;
  readonly carry: Carry;
  /** The name of the element being posed. */
  readonly element: string;
  /** The span the motion plays over, when it has one. */
  readonly span: Span | undefined;
  /** The pose the motions on `element` give at this scene time; `at` reads another time or part. */
  read(element: ObjectElement, at?: ReadAt): Pose3d;
  read(element: Element | string, at?: ReadAt): Pose2d;
}

/** Where `read` looks: another time, or another part of a list. */
export interface ReadAt {
  readonly time?: Time;
  readonly index?: number;
  readonly count?: number;
}

/** A core `Motion`, or a plain function from time and context to a pose. */
export type SceneMotion = (time: Time, context: MotionContext) => Pose2d;

/** Wraps the signal of every motion above it in a `.modify` call. */
export type Principle = (signal: Signal<Pose2d>) => Signal<Pose2d>;

/** A motion on an object: a core `Motion` over `Pose3d`, or a plain function from time and context to one. */
export type SceneMotion3d = (time: Time, context: MotionContext) => Pose3d;

/** Wraps the 3D signal of every motion above it on an object in a `.modify` call. */
export type Principle3d = (signal: Signal<Pose3d>) => Signal<Pose3d>;

/** A clock beat or scroll beat; `[from, to]` of either; `{ from }`; or `{ until }`. */
export type ShowWindow =
  | Beat
  | ScrollBeat
  | readonly [from: Beat, to: Beat]
  | readonly [from: ScrollPoint, to: ScrollPoint]
  | { readonly from: Beat }
  | { readonly until: Beat }
  | { readonly from: ScrollPoint }
  | { readonly until: ScrollPoint };

/** Options of `travel`: target slot element, optional perpendicular arc bend in px, and how it fits the slot. */
export interface TravelOptions {
  readonly to: Element;
  /** Perpendicular bow at mid-travel in px, 0 at both ends (default 0). */
  readonly arc?: number | undefined;
  /** How it fits: `"contain"` (2D default, 3D opt-in), `"fill"` (2D only), or `"none"` (3D default). */
  readonly fit?: "contain" | "fill" | "none" | undefined;
}

/** What `travel` returns: a motion on an element, which an object with a view also takes. */
export interface TravelMotion extends Motion<Pose2d, MotionContext> {
  readonly travel: TravelOptions;
  in(window: InWindow, ease?: Ease): TravelMotion;
  loop(ms: number): TravelMotion;
  take(): TravelMotion;
  ambient(): TravelMotion;
}

/** One call on an element's binding, kept in the order written. */
export type BindingStep =
  | { readonly kind: "moves"; readonly motions: readonly SceneMotion[] }
  | { readonly kind: "modifies"; readonly principle: Principle }
  | { readonly kind: "shows"; readonly windows: readonly ShowWindow[] }
  | { readonly kind: "limits"; readonly limits: Limits };

/** One call on an object's binding, kept in the order written. */
export type ObjectBindingStep =
  | { readonly kind: "moves"; readonly motions: readonly (SceneMotion3d | TravelMotion)[] }
  | { readonly kind: "modifies"; readonly principle: Principle3d }
  | { readonly kind: "shows"; readonly windows: readonly ShowWindow[] }
  | { readonly kind: "limits"; readonly limits: Limits };

/** What an element does in a scene: each call returns a new binding, and the element never changes. */
export interface ElementBinding {
  readonly kind: "binding";
  readonly element: Element;
  readonly steps: readonly BindingStep[];
  /** Appends motions: layer motions add by each field's rule, a `take` motion replaces its fields. */
  moves(...motions: readonly SceneMotion[]): ElementBinding;
  /** Wraps every motion before it in `principle`. */
  modifies(principle: Principle): ElementBinding;
  /** Shows the element only during these windows: a beat, or `[from, to]` for one stretch across beats. */
  shows(...windows: readonly ShowWindow[]): ElementBinding;
  /** Sets review limits of this element; each field once. */
  limits(limits: Limits): ElementBinding;
}

/** What an object does in a scene, in 3D: each call returns a new binding, and the object never changes. */
export interface ObjectBinding {
  readonly kind: "object-binding";
  readonly element: ObjectElement;
  readonly steps: readonly ObjectBindingStep[];
  /** Appends motions, a `travel` onto a page slot among them. */
  moves(...motions: readonly (SceneMotion3d | TravelMotion)[]): ObjectBinding;
  /** Wraps every motion before it in `principle`. */
  modifies(principle: Principle3d): ObjectBinding;
  /** Shows the object only during these windows: a beat, or `[from, to]` for one stretch across beats. */
  shows(...windows: readonly ShowWindow[]): ObjectBinding;
  /** Sets review limits of this object, in world units; each field once. */
  limits(limits: Limits): ObjectBinding;
}

/** The binding methods every element carries. */
export interface ElementMethods {
  moves(...motions: readonly SceneMotion[]): ElementBinding;
  modifies(principle: Principle): ElementBinding;
  shows(...windows: readonly ShowWindow[]): ElementBinding;
  limits(limits: Limits): ElementBinding;
}

/** The binding methods every object carries. */
export interface ObjectMethods {
  moves(...motions: readonly (SceneMotion3d | TravelMotion)[]): ObjectBinding;
  modifies(principle: Principle3d): ObjectBinding;
  shows(...windows: readonly ShowWindow[]): ObjectBinding;
  limits(limits: Limits): ObjectBinding;
}

function elementBinding(element: Element, steps: readonly BindingStep[]): ElementBinding {
  const next = (added: BindingStep): ElementBinding => elementBinding(element, [...steps, added]);
  return Object.freeze({
    kind: "binding",
    element,
    steps: Object.freeze(steps),
    moves: (...motions: readonly SceneMotion[]) => next({ kind: "moves", motions }),
    modifies: (principle: Principle) => next({ kind: "modifies", principle }),
    shows: (...windows: readonly ShowWindow[]) => next({ kind: "shows", windows }),
    limits: (limits: Limits) => next({ kind: "limits", limits }),
  });
}

function objectBinding(element: ObjectElement, steps: readonly ObjectBindingStep[]): ObjectBinding {
  const next = (added: ObjectBindingStep): ObjectBinding =>
    objectBinding(element, [...steps, added]);
  return Object.freeze({
    kind: "object-binding",
    element,
    steps: Object.freeze(steps),
    moves: (...motions: readonly (SceneMotion3d | TravelMotion)[]) =>
      next({ kind: "moves", motions }),
    modifies: (principle: Principle3d) => next({ kind: "modifies", principle }),
    shows: (...windows: readonly ShowWindow[]) => next({ kind: "shows", windows }),
    limits: (limits: Limits) => next({ kind: "limits", limits }),
  });
}

const METHOD_KEYS = ["moves", "modifies", "shows", "limits"] as const;

/** Makes the binding methods of `target` non-enumerable, so equality checks and copies skip them. */
export function hideMethods(target: ElementMethods | ObjectMethods): void {
  for (const key of METHOD_KEYS)
    Object.defineProperty(target, key, { value: target[key], enumerable: false });
}

/** The binding methods of the element `self` answers once it is made. */
export function elementMethods(self: () => Element): ElementMethods {
  return {
    moves: (...motions) => elementBinding(self(), [{ kind: "moves", motions }]),
    modifies: (principle) => elementBinding(self(), [{ kind: "modifies", principle }]),
    shows: (...windows) => elementBinding(self(), [{ kind: "shows", windows }]),
    limits: (limits) => elementBinding(self(), [{ kind: "limits", limits }]),
  };
}

/** The binding methods of the object `self` answers once it is made. */
export function objectMethods(self: () => ObjectElement): ObjectMethods {
  return {
    moves: (...motions) => objectBinding(self(), [{ kind: "moves", motions }]),
    modifies: (principle) => objectBinding(self(), [{ kind: "modifies", principle }]),
    shows: (...windows) => objectBinding(self(), [{ kind: "shows", windows }]),
    limits: (limits) => objectBinding(self(), [{ kind: "limits", limits }]),
  };
}
