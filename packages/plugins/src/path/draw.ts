import type { CubicPath2dCells } from "./models";

/**
 * Converts a sequence of continuous CubicPath2d segment rows into an SVG path `d` attribute string.
 */
export function cubicPathToSvg(segments: readonly { readonly cells: CubicPath2dCells }[]): string {
  if (segments.length === 0) return "";
  const first = segments[0]!.cells;
  const parts: string[] = [
    `M ${first.x0} ${first.y0} C ${first.x1} ${first.y1}, ${first.x2} ${first.y2}, ${first.x3} ${first.y3}`,
  ];
  for (let i = 1; i < segments.length; i++) {
    const c = segments[i]!.cells;
    parts.push(`C ${c.x1} ${c.y1}, ${c.x2} ${c.y2}, ${c.x3} ${c.y3}`);
  }
  return parts.join(" ");
}
