import { unreachable } from "../filler/unreachable";
import type { Vec } from "../filler/vec";

/** A 3D point or direction in the synthetic scene, metres. */
export type Vec3 = readonly [number, number, number];

/** A 3x3 rotation, row-major. Only rotations are built here, so the inverse is the transpose. */
export type Mat3 = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export type Axis = "x" | "y" | "z";

export const IDENTITY: Mat3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]) as Mat3;

/** The right-handed rotation by `radians` about one axis. */
export function axisRotation(axis: Axis, radians: number): Mat3 {
  const c = Math.cos(radians);
  const s = Math.sin(radians);
  switch (axis) {
    case "x":
      return [1, 0, 0, 0, c, -s, 0, s, c];
    case "y":
      return [c, 0, s, 0, 1, 0, -s, 0, c];
    case "z":
      return [c, -s, 0, s, c, 0, 0, 0, 1];
    default:
      return unreachable(axis, "rotation axis");
  }
}

export function multiply(a: Mat3, b: Mat3): Mat3 {
  const m = (row: number, col: number) =>
    a[row * 3]! * b[col]! + a[row * 3 + 1]! * b[3 + col]! + a[row * 3 + 2]! * b[6 + col]!;
  return [m(0, 0), m(0, 1), m(0, 2), m(1, 0), m(1, 1), m(1, 2), m(2, 0), m(2, 1), m(2, 2)];
}

export function apply(m: Mat3, v: Vec): Vec3 {
  const [x, y, z] = [v[0]!, v[1]!, v[2]!];
  return [
    m[0] * x + m[1] * y + m[2] * z,
    m[3] * x + m[4] * y + m[5] * z,
    m[6] * x + m[7] * y + m[8] * z,
  ];
}

export function transpose(m: Mat3): Mat3 {
  return [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];
}

export function add3(a: Vec, b: Vec): Vec3 {
  return [a[0]! + b[0]!, a[1]! + b[1]!, a[2]! + b[2]!];
}

export function sub3(a: Vec, b: Vec): Vec3 {
  return [a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!];
}

export function scale3(a: Vec, factor: number): Vec3 {
  return [a[0]! * factor, a[1]! * factor, a[2]! * factor];
}

export function cross3(a: Vec, b: Vec): Vec3 {
  return [
    a[1]! * b[2]! - a[2]! * b[1]!,
    a[2]! * b[0]! - a[0]! * b[2]!,
    a[0]! * b[1]! - a[1]! * b[0]!,
  ];
}

export const DEG = Math.PI / 180;
