import { unreachable, type Cubic2d, type Lens3d, type Time } from "@gerak/core";
import { placementOf } from "../render/placement";
import { makeScrollPoint, type ScrollPoint } from "./beat";
import type { Path } from "./cast";

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
export type Element = ElementBody & Edges;

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
export interface ObjectElement {
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

function named(maker: string, name: string): string {
  if (typeof name !== "string" || name === "")
    throw new TypeError(`${maker}: an element needs a name.`);
  return name;
}

/** `made` with `.top`, `.end`, `.pinStart`, and `.pinEnd` scroll points on its rest box. */
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
  const full: T & Edges = { ...made, top, end, pinStart, pinEnd };
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
export function box<N extends string = string>(name: N, options?: BoxOptions): Element {
  return edged({
    kind: "box",
    name: named("box", name),
    ...(options?.parts === true ? { parts: true } : {}),
    options: optionsOf(options),
  });
}

function isMorph(value: ShapeSource): value is MorphSource {
  return typeof value === "object" && !Array.isArray(value);
}

/** A drawn path, or a morph between outlines: 0 is `base`, 1 is `targets[0]`. */
export function shape<N extends string = string>(
  name: N,
  outline: ShapeSource,
  options?: ElementOptions,
): Element {
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
export function text<N extends string = string>(name: N, options?: TextOptions): Element;
export function text<N extends string = string>(
  name: N,
  content: (time: Time) => string,
  options?: ElementOptions,
): Element;
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
export function object<N extends string = string>(name: N, options?: ObjectOptions): ObjectElement {
  const view = options?.view;
  if (view !== undefined && (typeof view.lens.fov !== "number" || view.canvas.kind !== "box"))
    throw new TypeError(
      `object "${name}": \`view\` needs a \`canvas\` box and a \`lens\` with a fov.`,
    );
  return Object.freeze({
    kind: "object",
    name: named("object", name),
    view: view === undefined ? undefined : Object.freeze({ canvas: view.canvas, lens: view.lens }),
    ...(options?.parts === true ? { parts: true } : {}),
  });
}
