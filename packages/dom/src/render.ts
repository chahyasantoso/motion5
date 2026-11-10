import type { Anchor, Cubic2d, Drawn, Pose2d, Reveal } from "@gerak/moves";
import { unreachable } from "./unreachable";

/** The style properties a renderer writes; a real element's `CSSStyleDeclaration` has them all. */
export interface RenderStyle {
  transform?: string;
  transformOrigin?: string;
  transformBox?: string;
  opacity?: string;
  clipPath?: string;
  strokeDasharray?: string;
  strokeDashoffset?: string;
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

/** A CSS clip path showing what lies inside a reveal's circle. */
export function cssClip(reveal: Reveal): string {
  return `circle(${reveal.radius}px at ${reveal.x}px ${reveal.y}px)`;
}

/** The stroke dash that shows the drawn share of a path `length` long. */
export function cssDash(
  drawn: Drawn,
  length: number,
): { readonly strokeDasharray: string; readonly strokeDashoffset: number } {
  return { strokeDasharray: `${length} ${length}`, strokeDashoffset: length * (1 - drawn.drawn) };
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

/** Writes a pose; an absent anchor is the centre, measured on the element's own box for SVG as for HTML. */
export function applyPose(target: RenderTarget, pose: Pose2d): void {
  const transform = cssTransform(pose);
  target.style.transform = transform;
  if (pose.opacity !== undefined) target.style.opacity = String(pose.opacity);
  if ("ownerSVGElement" in target) target.style.transformBox = "fill-box";
  target.style.transformOrigin = cssOrigin(pose.anchor ?? "center");
}

/** Clips the target to a reveal's circle. */
export function applyReveal(target: RenderTarget, reveal: Reveal): void {
  target.style.clipPath = cssClip(reveal);
}

/** Dashes a stroke to its drawn share, measuring the path itself when it can. */
export function applyDrawn(target: RenderTarget, drawn: Drawn, length?: number): void {
  const dash = cssDash(drawn, target.getTotalLength?.() ?? length ?? 0);
  target.style.strokeDasharray = dash.strokeDasharray;
  target.style.strokeDashoffset = String(dash.strokeDashoffset);
}

/** Sets a path element's `d` to the cubic segments. */
export function applyPath(target: RenderTarget, cubics: readonly Cubic2d[]): void {
  target.setAttribute?.("d", pathData(cubics));
}
