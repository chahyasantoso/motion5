import type { Anchor, Cubic2d, Pose2d } from "@gerak/moves";
import { unreachable } from "./unreachable";

/** The style properties a renderer writes; a real element's `CSSStyleDeclaration` has them all. */
export interface RenderStyle {
  transform?: string;
  transformOrigin?: string;
  transformBox?: string;
  opacity?: string;
  filter?: string;
  clipPath?: string;
  strokeDasharray?: string;
  strokeDashoffset?: string;
  visibility?: string;
  setProperty?(name: string, value: string): void;
  removeProperty?(name: string): void;
}

/** An element a renderer writes: its style, and the attribute and measuring hooks an SVG element has. */
export interface RenderTarget {
  readonly style: RenderStyle;
  setAttribute?(name: string, value: string): void;
  getTotalLength?(): number;
  readonly ownerSVGElement?: unknown;
}

const TURNS_AND_SCALES = ["rotation", "rotationX", "rotationY", "scale", "scaleX", "scaleY"];

/** The value keys a CSS transform carries; every other key writes as its own property. */
export const TRANSFORM_KEYS: readonly string[] = ["x", "y", "z", ...TURNS_AND_SCALES];

function turnOrScale(key: string, value: unknown): string {
  switch (key) {
    case "rotation":
      return `rotate(${String(value)}deg)`;
    case "rotationX":
      return `rotateX(${String(value)}deg)`;
    case "rotationY":
      return `rotateY(${String(value)}deg)`;
    default:
      return `${key}(${String(value)})`;
  }
}

/** A CSS transform from pose-like values: translate first, then turns, then scales; empty when nothing moves. */
export function cssTransform(values: Readonly<Record<string, unknown>>): string {
  const parts: string[] = [];
  if ("x" in values || "y" in values || "z" in values)
    parts.push(
      `translate3d(${String(values.x ?? 0)}px, ${String(values.y ?? 0)}px, ${String(values.z ?? 0)}px)`,
    );
  for (const key of TURNS_AND_SCALES) if (key in values) parts.push(turnOrScale(key, values[key]));
  return parts.join(" ");
}

/** The CSS transform origin an anchor names. */
export function cssOrigin(anchor: Anchor): string {
  switch (anchor) {
    case "center":
      return "50% 50%";
    case "bottom":
      return "50% 100%";
    case "top":
      return "50% 0%";
    case "left":
      return "0% 50%";
    case "right":
      return "100% 50%";
    default:
      return unreachable(anchor);
  }
}

/** A CSS clip path showing what lies inside a circle `radius` px round, centred `x`, `y` px from the top left. */
export function cssClip(x: number, y: number, radius: number): string {
  return `circle(${radius}px at ${x}px ${y}px)`;
}

/** A CSS clip path showing a `width` by `height` px box centred `x`, `y` px from the top left, its
 * corners rounded by `radius` px. */
export function cssClipBox(
  x: number,
  y: number,
  width: number,
  height: number,
  radius = 0,
): string {
  const round = radius > 0 ? ` round ${radius}px` : "";
  return `xywh(${x - width / 2}px ${y - height / 2}px ${width}px ${height}px${round})`;
}

/** The stroke dash that shows the stretch from share `from` to share `to` of a path `length` long. */
export function cssDash(
  from: number,
  to: number,
  length: number,
): { readonly strokeDasharray: string; readonly strokeDashoffset: number } {
  const shown = Math.max(0, to - from) * length;
  return { strokeDasharray: `${shown} ${length}`, strokeDashoffset: -from * length };
}

/** SVG path data for joined cubic segments. */
export function pathData(cubics: readonly Cubic2d[]): string {
  const [first] = cubics;
  if (first === undefined) return "";
  return [
    `M ${first.x0} ${first.y0}`,
    ...cubics.map((c) => `C ${c.x1} ${c.y1}, ${c.x2} ${c.y2}, ${c.x3} ${c.y3}`),
  ].join(" ");
}

/** A value split into the fields `applyValue` writes as a stroke's dash and the rest, for a
 * renderer that draws a stroke inside its member. */
export function splitStroke(value: Pose2d): { readonly stroke: Pose2d; readonly body: Pose2d } {
  const { drawn, drawnFrom, ...body } = value;
  return {
    stroke: {
      ...(drawn === undefined ? {} : { drawn }),
      ...(drawnFrom === undefined ? {} : { drawnFrom }),
    },
    body,
  };
}

const CUSTOM_NAME = /^[A-Za-z_][\w-]*$/;
const WRITTEN = new WeakMap<RenderStyle, ReadonlySet<string>>();
const EMPTIED = new WeakSet<RenderStyle>();

// A field or custom name the value leaves out is cleared, so the page's own style shows again.
/** Writes a value, each custom number as `--<name>`; a stroke with no length to measure is left undashed. */
export function applyValue(target: RenderTarget, value: Pose2d, length?: number): void {
  const style = target.style;
  style.transform = cssTransform(value);
  style.opacity = value.opacity === undefined ? "" : String(value.opacity);
  // With no anchor, an HTML element keeps the page's origin, centre by default or a skin's own;
  // an SVG element's default is its top-left, so it keeps the centre.
  const svg = "ownerSVGElement" in target;
  if (svg) style.transformBox = "fill-box";
  style.transformOrigin =
    value.anchor !== undefined ? cssOrigin(value.anchor) : svg ? cssOrigin("center") : "";
  const blur = value.blur ?? 0;
  style.filter = blur > 0 ? `blur(${blur}px)` : "";
  // A clip with a width and a height is a box, its radius rounding the corners; with a radius alone, a circle.
  style.clipPath =
    value.clipWidth !== undefined && value.clipHeight !== undefined
      ? cssClipBox(
          value.clipX ?? 0,
          value.clipY ?? 0,
          value.clipWidth,
          value.clipHeight,
          value.clipRadius,
        )
      : value.clipRadius === undefined
        ? ""
        : cssClip(value.clipX ?? 0, value.clipY ?? 0, value.clipRadius);
  const measured = target.getTotalLength?.() ?? length ?? 0;
  const stroked = value.drawn !== undefined || value.drawnFrom !== undefined;
  if (stroked && measured > 0) {
    const dash = cssDash(value.drawnFrom ?? 0, value.drawn ?? 1, measured);
    style.strokeDasharray = dash.strokeDasharray;
    style.strokeDashoffset = String(dash.strokeDashoffset);
  } else if ((style.strokeDasharray ?? "") !== "") {
    style.strokeDasharray = "";
    style.strokeDashoffset = "";
  }
  // An empty stroke would still paint its caps; it is hidden, and otherwise left to its parent, never `visible`.
  const empty = stroked && (value.drawn ?? 1) <= (value.drawnFrom ?? 0);
  if (empty) style.visibility = "hidden";
  else if (style.visibility === "hidden" && EMPTIED.has(style)) style.visibility = "";
  if (empty) EMPTIED.add(style);
  else EMPTIED.delete(style);
  const custom = value.custom ?? {};
  for (const name of WRITTEN.get(style) ?? [])
    if (!Object.hasOwn(custom, name)) style.removeProperty?.(`--${name}`);
  for (const [name, number] of Object.entries(custom)) {
    if (!CUSTOM_NAME.test(name))
      throw new RangeError(
        `applyValue: custom name "${name}" must be letters, digits, "-" or "_".`,
      );
    style.setProperty?.(`--${name}`, String(number));
  }
  WRITTEN.set(style, new Set(Object.keys(custom)));
}

/** Sets a path element's `d` to the cubic segments. */
export function applyPath(target: RenderTarget, cubics: readonly Cubic2d[]): void {
  target.setAttribute?.("d", pathData(cubics));
}
