import { unreachable, type Cubic2d, type Lens3d, type Time } from "@gerak/core";
import { makeScrollPoint, type ScrollPoint } from "./beat";
import type { ItemContent, Path } from "./cast";

/** What stays true of an element in any scene: whether pointer events reach it. */
export interface ElementOptions {
  readonly watch?: boolean | undefined;
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

/** An element's measured edges as scroll points: the top and the bottom of its rest box. */
export interface Edges {
  readonly top: ScrollPoint;
  readonly end: ScrollPoint;
}

/** What an element is, before its edges. */
export type ElementBody =
  | { readonly kind: "box"; readonly name: string; readonly options: ElementOptions }
  | {
      readonly kind: "shape";
      readonly name: string;
      readonly outline: Outline;
      readonly options: ElementOptions;
    }
  | {
      readonly kind: "text";
      readonly name: string;
      readonly content: string | ((time: Time) => string);
      readonly split: "letters" | "words" | undefined;
      readonly options: ElementOptions;
    }
  | {
      readonly kind: "many";
      readonly name: string;
      readonly items: readonly ItemContent[];
      readonly options: ElementOptions;
    }
  | {
      readonly kind: "group";
      readonly name: string;
      readonly children: readonly Element[];
      readonly options: ElementOptions;
    };

/** An element of a piece, made once with a name; `kind` says what it is. */
export type Element = ElementBody & Edges;

/** Where an object is drawn: the element bound to the page's canvas, and the fixed lens the page draws through. */
export interface ObjectView {
  readonly canvas: Element;
  readonly lens: Lens3d;
}

/** Options of `object`: its view, which `travel` onto a page slot needs. */
export interface ObjectOptions {
  readonly view?: ObjectView | undefined;
}

/** A Three.js object of a piece, posed in `Pose3d` world units and drawn by `bindScene3d`, never by a DOM renderer. */
export interface ObjectElement {
  readonly kind: "object";
  readonly name: string;
  readonly view: ObjectView | undefined;
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

function named(maker: string, name: string): string {
  if (typeof name !== "string" || name === "")
    throw new TypeError(`${maker}: an element needs a name.`);
  return name;
}

/** `made` with `.top` and `.end`, each a scroll point on its measured rest box that names it. */
function edged<T extends ElementBody>(made: T): T & Edges {
  const name = made.name;
  let element: (T & Edges) | undefined;
  const self = (): object => {
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
  const full: T & Edges = { ...made, top, end };
  element = Object.freeze(full);
  return full;
}

function optionsOf(options: ElementOptions | undefined): ElementOptions {
  const { watch } = options ?? {};
  return Object.freeze({
    ...(watch === undefined ? {} : { watch }),
  });
}

/** A page element styled by CSS. */
export function box(name: string, options?: ElementOptions): Element {
  return edged({ kind: "box", name: named("box", name), options: optionsOf(options) });
}

function isMorph(value: ShapeSource): value is MorphSource {
  return typeof value === "object" && !Array.isArray(value);
}

/** A drawn path, or a morph between outlines: 0 is `base`, 1 is `targets[0]`. */
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

/** Text, or text a function of time writes; `split` gives a string a part per letter or word. */
export function text(
  name: string,
  content: string | ((time: Time) => string),
  options?: TextOptions,
): Element {
  const split = options?.split;
  if (split !== undefined && typeof content !== "string")
    throw new TypeError(`text "${name}": only a string can be split into parts.`);
  return edged({
    kind: "text",
    name: named("text", name),
    content,
    split,
    options: optionsOf(options),
  });
}

function itemOf(owner: string, index: number, made: Element): ItemContent {
  if (Object.keys(made.options).length > 0)
    throw new TypeError(`many "${owner}": an item takes no options; put them on the list.`);
  switch (made.kind) {
    case "box":
      return { kind: "box" };
    case "shape":
      return made.outline.kind === "path"
        ? { kind: "stroke", path: made.outline.path }
        : { kind: "morph", shapes: Object.freeze([made.outline.base, ...made.outline.targets]) };
    case "text":
      if (typeof made.content !== "string" || made.split !== undefined)
        throw new TypeError(`many "${owner}": item ${index} must be a plain string text.`);
      return { kind: "text", value: made.content };
    case "many":
    case "group":
      throw new TypeError(
        `many "${owner}": item ${index} is a ${made.kind}; use a box, shape or text.`,
      );
    default:
      return unreachable(made);
  }
}

/** A row of numbered parts: `count` boxes, or one part per item, each made by `make`. */
export function many(name: string, count: number, options?: ElementOptions): Element;
export function many<T>(
  name: string,
  items: readonly T[],
  make: (item: T, index: number) => Element,
  options?: ElementOptions,
): Element;
export function many<T>(
  name: string,
  source: number | readonly T[],
  third?: ElementOptions | ((item: T, index: number) => Element),
  fourth?: ElementOptions,
): Element {
  const own = named("many", name);
  if (typeof source === "number") {
    if (!(Number.isInteger(source) && source >= 0))
      throw new RangeError(`many "${own}": count must be a whole number >= 0, not ${source}.`);
    const options = typeof third === "function" ? undefined : third;
    return edged({
      kind: "many",
      name: own,
      items: Object.freeze(Array.from({ length: source }, (): ItemContent => ({ kind: "box" }))),
      options: optionsOf(options),
    });
  }
  if (typeof third !== "function")
    throw new TypeError(`many "${own}": a list of items needs a function making each.`);
  return edged({
    kind: "many",
    name: own,
    items: Object.freeze(source.map((item, index) => itemOf(own, index, third(item, index)))),
    options: optionsOf(fourth),
  });
}

/** A Three.js object; its origin is the `Object3D`'s, and it has no DOM node, content or pointer events. */
export function object(name: string, options?: ObjectOptions): ObjectElement {
  const view = options?.view;
  if (view !== undefined && (typeof view.lens.fov !== "number" || view.canvas.kind !== "box"))
    throw new TypeError(
      `object "${name}": \`view\` needs a \`canvas\` box and a \`lens\` with a fov.`,
    );
  return Object.freeze({
    kind: "object",
    name: named("object", name),
    view: view === undefined ? undefined : Object.freeze({ canvas: view.canvas, lens: view.lens }),
  });
}

/** A container: its pose moves its children, and each child keeps its own motions. */
export function group(
  name: string,
  children: readonly Element[],
  options?: ElementOptions,
): Element {
  return edged({
    kind: "group",
    name: named("group", name),
    children: Object.freeze([...children]),
    options: optionsOf(options),
  });
}
