import type { CubicPath2dCells } from "./models";
import type { Point2dCells } from "../models";

const GL5_NODES = [
  0.046910077030668, 0.23076534494715845, 0.5, 0.7692346550528415, 0.9530899229693319,
];

const GL5_WEIGHTS = [
  0.11846344252809454, 0.23931433524968323, 0.28444444444444444, 0.23931433524968323,
  0.11846344252809454,
];

function segmentSpeed(c: CubicPath2dCells, u: number): number {
  const ax = 3 * (c.x1 - c.x0);
  const ay = 3 * (c.y1 - c.y0);
  const bx = 3 * (c.x2 - c.x1);
  const by = 3 * (c.y2 - c.y1);
  const cx = 3 * (c.x3 - c.x2);
  const cy = 3 * (c.y3 - c.y2);

  const oneMinusU = 1 - u;
  const dx = oneMinusU * oneMinusU * ax + 2 * oneMinusU * u * bx + u * u * cx;
  const dy = oneMinusU * oneMinusU * ay + 2 * oneMinusU * u * by + u * u * cy;
  return Math.hypot(dx, dy);
}

function segmentArcLength(c: CubicPath2dCells, u0: number, u1: number): number {
  const span = u1 - u0;
  if (span <= 0) return 0;
  let sum = 0;
  for (let i = 0; i < 5; i++) {
    const node = u0 + span * GL5_NODES[i]!;
    sum += GL5_WEIGHTS[i]! * segmentSpeed(c, node);
  }
  return span * sum;
}

function evaluateSegment(c: CubicPath2dCells, u: number): Point2dCells {
  const oneMinusU = 1 - u;
  const oneMinusU2 = oneMinusU * oneMinusU;
  const oneMinusU3 = oneMinusU2 * oneMinusU;
  const u2 = u * u;
  const u3 = u2 * u;

  const x = oneMinusU3 * c.x0 + 3 * oneMinusU2 * u * c.x1 + 3 * oneMinusU * u2 * c.x2 + u3 * c.x3;
  const y = oneMinusU3 * c.y0 + 3 * oneMinusU2 * u * c.y1 + 3 * oneMinusU * u2 * c.y2 + u3 * c.y3;

  const ax = 3 * (c.x1 - c.x0);
  const ay = 3 * (c.y1 - c.y0);
  const bx = 3 * (c.x2 - c.x1);
  const by = 3 * (c.y2 - c.y1);
  const cx = 3 * (c.x3 - c.x2);
  const cy = 3 * (c.y3 - c.y2);

  let dx = oneMinusU2 * ax + 2 * oneMinusU * u * bx + u2 * cx;
  let dy = oneMinusU2 * ay + 2 * oneMinusU * u * by + u2 * cy;

  if (Math.hypot(dx, dy) < 1e-7) {
    // Tangent approaches zero at cusp; inspect second derivative
    const d2x = 6 * oneMinusU * (c.x2 - 2 * c.x1 + c.x0) + 6 * u * (c.x3 - 2 * c.x2 + c.x1);
    const d2y = 6 * oneMinusU * (c.y2 - 2 * c.y1 + c.y0) + 6 * u * (c.y3 - 2 * c.y2 + c.y1);
    dx = d2x;
    dy = d2y;
  }

  if (Math.hypot(dx, dy) < 1e-7) {
    // Fallback to chord direction
    dx = c.x3 - c.x0;
    dy = c.y3 - c.y0;
  }

  const rotation = Math.hypot(dx, dy) < 1e-7 ? 0 : Math.atan2(dy, dx) * (180 / Math.PI);
  return { x, y, rotation };
}

/**
 * Pure arc-length parameterization for a cubic Bézier path.
 * Evaluates the world position and tangent angle at arc-length fraction s in [0, 1].
 */
export function pointAtArcFraction(
  segments: readonly { readonly cells: CubicPath2dCells }[],
  s: number,
): Point2dCells {
  if (segments.length === 0) {
    return { x: 0, y: 0, rotation: 0 };
  }

  const segmentLengths: number[] = [];
  let totalLength = 0;
  for (const seg of segments) {
    const len = segmentArcLength(seg.cells, 0, 1);
    segmentLengths.push(len);
    totalLength += len;
  }

  if (totalLength < 1e-9) {
    const first = segments[0]!.cells;
    return { x: first.x0, y: first.y0, rotation: 0 };
  }

  const fraction = Math.min(1, Math.max(0, s));
  const targetDistance = fraction * totalLength;

  let currentDist = 0;
  let targetIndex = segments.length - 1;
  let distInSegment = 0;

  for (let i = 0; i < segments.length; i++) {
    const segLen = segmentLengths[i]!;
    if (currentDist + segLen >= targetDistance || i === segments.length - 1) {
      targetIndex = i;
      distInSegment = targetDistance - currentDist;
      break;
    }
    currentDist += segLen;
  }

  const targetSegment = segments[targetIndex]!.cells;
  const segLen = segmentLengths[targetIndex]!;

  if (segLen < 1e-9) {
    return evaluateSegment(targetSegment, 0);
  }

  let a = 0;
  let b = 1;
  let u = Math.min(1, Math.max(0, distInSegment / segLen));

  for (let iter = 0; iter < 24; iter++) {
    const len = segmentArcLength(targetSegment, 0, u);
    const f = len - distInSegment;
    if (Math.abs(f) <= 1e-6 * totalLength || b - a <= 1e-7) {
      break;
    }
    if (f < 0) {
      a = u;
    } else {
      b = u;
    }

    const speed = segmentSpeed(targetSegment, u);
    let nextU: number;
    if (speed > 1e-6) {
      nextU = u - f / speed;
      if (nextU <= a || nextU >= b) {
        nextU = 0.5 * (a + b);
      }
    } else {
      nextU = 0.5 * (a + b);
    }
    u = nextU;
  }

  return evaluateSegment(targetSegment, u);
}
