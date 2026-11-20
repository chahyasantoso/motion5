import { unreachable, type Cubic2d, type Time } from "@gerak/core";
import type { ItemContent, NodeBinding, Path, Pivot } from "./cast";

/** Binds an element or section to an existing DOM node matched by CSS `selector`. */
export function el(selector: string): NodeBinding {
  if (typeof selector !== "string" || selector.trim() === "")
    throw new TypeError("el: selector must be a non-empty CSS selector string.");
  return Object.freeze({ kind: "node", selector });
}

function isNodeBinding(value: unknown): value is NodeBinding {
  return (
    typeof value === "object" &&
    value !== null &&
    Reflect.get(value, "kind") === "node" &&
    typeof Reflect.get(value, "selector") === "string"
  );
}

/** What stays true of an element in any scene: where it turns, whether pointer events reach it, and its page node. */
export interface ElementOptions {
  readonly pivot?: Pivot | undefined;
  readonly watch?: boolean | undefined;
  readonly node?: NodeBinding | undefined;
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

/** An element of a piece, made once with a name; `kind` says what it is. */
export type Element =
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

function optionsOf(options: ElementOptions | undefined): ElementOptions {
  const { pivot, watch, node } = options ?? {};
  if (node !== undefined && !isNodeBinding(node))
    throw new TypeError("element: `node` must be made by `el(selector)`.");
  return Object.freeze({
    ...(pivot === undefined ? {} : { pivot: Object.freeze({ x: pivot.x, y: pivot.y }) }),
    ...(watch === undefined ? {} : { watch }),
    ...(node === undefined ? {} : { node }),
  });
}

/** A page element styled by CSS. */
export function box(name: string, options?: ElementOptions): Element {
  return Object.freeze({ kind: "box", name: named("box", name), options: optionsOf(options) });
}

function isMorph(value: ShapeSource): value is MorphSource {
  return typeof value === "object" && !Array.isArray(value);
}

/** A drawn path, or a morph between outlines: 0 is `base`, 1 is `targets[0]`. */
export function shape(name: string, outline: ShapeSource, options?: ElementOptions): Element {
  const drawn: Outline = isMorph(outline)
    ? { kind: "morph", base: outline.base, targets: outline.targets }
    : { kind: "path", path: outline };
  return Object.freeze({
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
  return Object.freeze({
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
    return Object.freeze({
      kind: "many",
      name: own,
      items: Object.freeze(Array.from({ length: source }, (): ItemContent => ({ kind: "box" }))),
      options: optionsOf(options),
    });
  }
  if (typeof third !== "function")
    throw new TypeError(`many "${own}": a list of items needs a function making each.`);
  return Object.freeze({
    kind: "many",
    name: own,
    items: Object.freeze(source.map((item, index) => itemOf(own, index, third(item, index)))),
    options: optionsOf(fourth),
  });
}

/** A container: its pose moves its children, and each child keeps its own motions. */
export function group(
  name: string,
  children: readonly Element[],
  options?: ElementOptions,
): Element {
  return Object.freeze({
    kind: "group",
    name: named("group", name),
    children: Object.freeze([...children]),
    options: optionsOf(options),
  });
}
