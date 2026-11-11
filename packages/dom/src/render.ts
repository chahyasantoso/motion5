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
  setProperty?(name: string, value: string): void;
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

// A field the value leaves out is cleared, so the page's own style shows again and no old amount stays.
/** Writes a value, each custom number as `--<name>`; a custom name absent now keeps its last. */
export function applyValue(target: RenderTarget, value: Pose2d, length?: number): void {
  const style = target.style;
  style.transform = cssTransform(value);
  style.opacity = value.opacity === undefined ? "" : String(value.opacity);
  if ("ownerSVGElement" in target) style.transformBox = "fill-box";
  style.transformOrigin = cssOrigin(value.anchor ?? "center");
  const blur = value.blur ?? 0;
  style.filter = blur > 0 ? `blur(${blur}px)` : "";
  style.clipPath =
    value.clipRadius === undefined
      ? ""
      : cssClip(value.clipX ?? 0, value.clipY ?? 0, value.clipRadius);
  if (value.drawn !== undefined || value.drawnFrom !== undefined) {
    const dash = cssDash(
      value.drawnFrom ?? 0,
      value.drawn ?? 1,
      target.getTotalLength?.() ?? length ?? 0,
    );
    style.strokeDasharray = dash.strokeDasharray;
    style.strokeDashoffset = String(dash.strokeDashoffset);
  } else if ((style.strokeDasharray ?? "") !== "") {
    style.strokeDasharray = "";
    style.strokeDashoffset = "";
  }
  for (const [name, number] of Object.entries(value.custom ?? {}))
    style.setProperty?.(`--${name}`, String(number));
}
/** Sets a path element's `d` to the cubic segments. */
export function applyPath(target: RenderTarget, cubics: readonly Cubic2d[]): void {
  target.setAttribute?.("d", pathData(cubics));
}
