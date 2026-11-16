import {
  circlePath,
  ellipsePath,
  linePath,
  pathFrom,
  polygonPath,
  rectPath,
  type Cubic2d,
  type Matrix2d,
  unreachable,
} from "@gerak/core";

export const IDENTITY: Matrix2d = [1, 0, 0, 1, 0, 0];

/** `left` applied after `right`: the matrix of doing `right` first. */
export function multiply(left: Matrix2d, right: Matrix2d): Matrix2d {
  const [a, b, c, d, e, f] = left;
  const [g, h, i, j, k, l] = right;
  return [
    a * g + c * h,
    b * g + d * h,
    a * i + c * j,
    b * i + d * j,
    a * k + c * l + e,
    b * k + d * l + f,
  ];
}

/** Whether the matrix moves nothing by more than a thousandth. */
export function isIdentity(matrix: Matrix2d): boolean {
  return matrix.every((value, index) => Math.abs(value - (IDENTITY[index] ?? 0)) < 1e-3);
}

/** How a matrix scales lengths: the square root of its determinant's size. */
export function lengthScale(matrix: Matrix2d): number {
  const [a, b, c, d] = matrix;
  return Math.sqrt(Math.abs(a * d - b * c));
}

/** Whether the matrix scales its two axes alike (within 1%) and keeps them square, so a stroke keeps its shape. */
export function isEven(matrix: Matrix2d): boolean {
  const [a, b, c, d] = matrix;
  const across = Math.hypot(a, b);
  const down = Math.hypot(c, d);
  const widest = Math.max(across, down);
  if (widest === 0) return true;
  return Math.abs(across - down) / widest <= 0.01 && Math.abs(a * c + b * d) / widest ** 2 <= 0.01;
}

/** A basic shape's attributes in the shape's own units, resolved from the page. */
export type ShapeGeometry =
  | { readonly kind: "path"; readonly d: string }
  | {
      readonly kind: "rect";
      readonly x: number;
      readonly y: number;
      readonly width: number;
      readonly height: number;
      readonly rx: number | null;
      readonly ry: number | null;
    }
  | {
      readonly kind: "ellipse";
      readonly cx: number;
      readonly cy: number;
      readonly rx: number;
      readonly ry: number;
    }
  | { readonly kind: "poly"; readonly points: readonly number[]; readonly closed: boolean }
  | {
      readonly kind: "line";
      readonly x1: number;
      readonly y1: number;
      readonly x2: number;
      readonly y2: number;
    };

/** The outline of a shape in its own units, and why reading stopped early when path data is malformed. */
export function outlinesOf(shape: ShapeGeometry): {
  readonly outlines: readonly (readonly Cubic2d[])[];
  readonly error?: string;
} {
  switch (shape.kind) {
    case "path":
      return pathFrom(shape.d);
    case "line":
      return outlineOf(linePath(shape));
    case "poly":
      return outlineOf(polygonPath(shape));
    case "ellipse":
      return outlineOf(ellipsePath(shape));
    case "rect":
      return outlineOf(
        rectPath({
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
          ...(shape.rx === null ? {} : { rx: shape.rx }),
          ...(shape.ry === null ? {} : { ry: shape.ry }),
        }),
      );
    default:
      return unreachable(shape);
  }
}

function outlineOf(cubics: readonly Cubic2d[]): {
  readonly outlines: readonly (readonly Cubic2d[])[];
} {
  return { outlines: cubics.length === 0 ? [] : [cubics] };
}
