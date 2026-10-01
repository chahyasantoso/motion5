import type { TrustedFrame } from "../filler/frame";
import { JOINTS } from "../filler/landmarks";
import { cross, rotate } from "../filler/direction";
import { add, dot, norm, scale, sub, unit, type Vec } from "../filler/vec";

export interface WeakPerspectiveFit {
  readonly pairCount: number;
  readonly rmsPx: number;
  readonly scale: number;
  /** Unit orthogonal camera rows: one uniform scale, never an affine shear. */
  readonly rows: readonly [Vec, Vec];
  project(position: Vec): Vec;
}

/** Small pivoted normal-equation solve. Regularization is supplied by the optimizer. */
function solve(matrix: readonly number[][], rhs: readonly number[]): number[] | undefined {
  const a = matrix.map((row, index) => [...row, rhs[index]!]);
  const n = rhs.length;
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let row = col + 1; row < n; row += 1)
      if (Math.abs(a[row]![col]!) > Math.abs(a[pivot]![col]!)) pivot = row;
    if (Math.abs(a[pivot]![col]!) < 1e-14) return undefined;
    [a[col], a[pivot]] = [a[pivot]!, a[col]!];
    const divisor = a[col]![col]!;
    for (let key = col; key <= n; key += 1) a[col]![key]! /= divisor;
    for (let row = 0; row < n; row += 1) {
      if (row === col) continue;
      const factor = a[row]![col]!;
      for (let key = col; key <= n; key += 1) a[row]![key]! -= factor * a[col]![key]!;
    }
  }
  const result = a.map((row) => row[n]!);
  return result.every(Number.isFinite) ? result : undefined;
}

interface Camera {
  readonly rows: readonly [Vec, Vec];
  readonly scale: number;
  readonly cost: number;
}

/** Jacobi eigensystem of a symmetric 3x3 covariance. No dependency or generic matrix layer. */
function eigen3(matrix: readonly number[][]) {
  const a = matrix.map((row) => [...row]);
  const v = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  for (let iteration = 0; iteration < 40; iteration += 1) {
    let p = 0;
    let q = 1;
    for (const [i, j] of [
      [0, 1],
      [0, 2],
      [1, 2],
    ] as const)
      if (Math.abs(a[i]![j]!) > Math.abs(a[p]![q]!)) {
        p = i;
        q = j;
      }
    if (Math.abs(a[p]![q]!) < 1e-12) break;
    const angle = 0.5 * Math.atan2(2 * a[p]![q]!, a[q]![q]! - a[p]![p]!);
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    for (let k = 0; k < 3; k += 1) {
      const ap = a[k]![p]!;
      const aq = a[k]![q]!;
      a[k]![p] = c * ap - s * aq;
      a[k]![q] = s * ap + c * aq;
    }
    for (let k = 0; k < 3; k += 1) {
      const ap = a[p]![k]!;
      const aq = a[q]![k]!;
      a[p]![k] = c * ap - s * aq;
      a[q]![k] = s * ap + c * aq;
      const vp = v[k]![p]!;
      const vq = v[k]![q]!;
      v[k]![p] = c * vp - s * vq;
      v[k]![q] = s * vp + c * vq;
    }
  }
  return [0, 1, 2]
    .map((axis) => ({
      value: Math.max(0, a[axis]![axis]!),
      vector: v.map((row) => row[axis]!) as Vec,
    }))
    .sort((a, b) => b.value - a.value);
}

function eigen2(a: number, b: number, d: number) {
  const radius = Math.hypot(a - d, 2 * b);
  const angle = 0.5 * Math.atan2(2 * b, a - d);
  return {
    large: (a + d + radius) / 2,
    small: Math.max(0, (a + d - radius) / 2),
    c: Math.cos(angle),
    s: Math.sin(angle),
  };
}

/**
 * Fit scaled orthographic p = s [r0;r1] X + t by a tiny damped Gauss-Newton solve on SO(3).
 * Centering eliminates translation; rotating the camera rows preserves orthogonality exactly.
 * Unlike rectangular Procrustes with the full XYZ variance denominator, this minimizes the
 * actual projected residual, including planar subjects and foreshortened camera orientations.
 */
export function fitWeakPerspective(
  world: TrustedFrame,
  image: TrustedFrame,
): WeakPerspectiveFit | undefined {
  if (world.space.kind !== "world" || image.space.kind !== "image" || world.tMs !== image.tMs)
    throw new Error("Projection needs synchronized world and image trust frames.");
  const pairs: Array<readonly [Vec, Vec]> = [];
  for (const joint of JOINTS) {
    const w = world.trust[joint];
    const i = image.trust[joint];
    if (
      w.kind === "trusted" &&
      i.kind === "trusted" &&
      w.position.length === 3 &&
      i.position.length === 2 &&
      [...w.position, ...i.position].every(Number.isFinite)
    )
      pairs.push([w.position, i.position]);
  }
  if (pairs.length < 3) return undefined;
  const mean = (axis: 0 | 1, dim: number): Vec =>
    Array.from(
      { length: dim },
      (_, key) => pairs.reduce((sum, pair) => sum + pair[axis][key]!, 0) / pairs.length,
    );
  const wm = mean(0, 3);
  const im = mean(1, 2);
  // Normalize world size to make damping independent of mm versus stage pixels.
  const radius = Math.sqrt(
    pairs.reduce((sum, [w]) => sum + norm(sub(w, wm)) ** 2, 0) / pairs.length,
  );
  if (!Number.isFinite(radius) || radius < 1e-9) return undefined;
  const centered = pairs.map(([w, i]) => [scale(sub(w, wm), 1 / radius), sub(i, im)] as const);
  const correlations = [0, 1].map((axis) =>
    centered.reduce((sum, [w, i]) => add(sum, scale(w, i[axis]!)), [0, 0, 0] as Vec),
  );
  const covariance = Array.from({ length: 3 }, (_, row) =>
    Array.from({ length: 3 }, (_, col) =>
      centered.reduce((sum, [w]) => sum + w[row]! * w[col]!, 0),
    ),
  );
  const spectrum = eigen3(covariance);
  if (spectrum[1]!.value <= spectrum[0]!.value * 1e-10) return undefined;
  const planar = spectrum[2]!.value <= spectrum[0]!.value * 1e-10;
  const affine = correlations.map((correlation) =>
    spectrum.reduce(
      (sum, eigen) =>
        eigen.value <= spectrum[0]!.value * 1e-10
          ? sum
          : add(sum, scale(eigen.vector, dot(correlation, eigen.vector) / eigen.value)),
      [0, 0, 0] as Vec,
    ),
  );
  const gram = eigen2(
    dot(affine[0]!, affine[0]!),
    dot(affine[0]!, affine[1]!),
    dot(affine[1]!, affine[1]!),
  );
  if (gram.large <= 1e-12 || gram.small <= gram.large * 1e-12) return undefined;
  let analyticRows: readonly [Vec, Vec];
  let analyticScale: number;
  if (planar) {
    // Any full-rank planar affine fit is a scaled orthographic camera. The largest singular
    // value is the uniform scale; the missing normal components complete equal orthogonal rows.
    analyticScale = Math.sqrt(gram.large);
    const missing = Math.sqrt(Math.max(0, gram.large - gram.small));
    const normal = spectrum[2]!.vector;
    analyticRows = [
      scale(add(affine[0]!, scale(normal, -gram.s * missing)), 1 / analyticScale),
      scale(add(affine[1]!, scale(normal, gram.c * missing)), 1 / analyticScale),
    ];
  } else {
    // Polar factor of the unconstrained affine camera: exact initializer for noiseless 3D.
    const large = 1 / Math.sqrt(gram.large);
    const small = 1 / Math.sqrt(gram.small);
    const m00 = gram.c ** 2 * large + gram.s ** 2 * small;
    const m01 = gram.c * gram.s * (large - small);
    const m11 = gram.s ** 2 * large + gram.c ** 2 * small;
    analyticRows = [
      add(scale(affine[0]!, m00), scale(affine[1]!, m01)),
      add(scale(affine[0]!, m01), scale(affine[1]!, m11)),
    ];
    analyticScale = Math.sqrt((gram.large + gram.small) / 2);
  }
  const evaluate = (rows: readonly [Vec, Vec], size?: number): Camera => {
    let numerator = 0;
    let denominator = 0;
    for (const [w, i] of centered)
      for (const axis of [0, 1] as const) {
        const projected = dot(rows[axis], w);
        numerator += projected * i[axis]!;
        denominator += projected * projected;
      }
    const s = size ?? Math.max(1e-9, numerator / Math.max(1e-12, denominator));
    let cost = 0;
    for (const [w, i] of centered)
      for (const axis of [0, 1] as const) cost += (s * dot(rows[axis], w) - i[axis]!) ** 2;
    return { rows, scale: s, cost };
  };
  const optimize = (rows: readonly [Vec, Vec]): Camera => {
    let camera = evaluate(rows);
    let damping = 1e-4;
    for (let iteration = 0; iteration < 60; iteration += 1) {
      const normal = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
      const rhs = [0, 0, 0, 0];
      for (const [w, i] of centered)
        for (const axis of [0, 1] as const) {
          const prediction = camera.scale * dot(camera.rows[axis], w);
          const jacobian = [...scale(cross(camera.rows[axis], w), camera.scale), prediction];
          const residual = i[axis]! - prediction;
          for (let row = 0; row < 4; row += 1) {
            rhs[row]! += jacobian[row]! * residual;
            for (let col = 0; col < 4; col += 1)
              normal[row]![col]! += jacobian[row]! * jacobian[col]!;
          }
        }
      for (let axis = 0; axis < 4; axis += 1) normal[axis]![axis]! += damping;
      const delta = solve(normal, rhs);
      if (delta === undefined) break;
      const angle = delta.slice(0, 3);
      const nextRows = camera.rows.map((row) => unit(rotate(row, angle))!) as unknown as readonly [
        Vec,
        Vec,
      ];
      const next = evaluate(
        nextRows,
        camera.scale * Math.exp(Math.min(1, Math.max(-1, delta[3]!))),
      );
      if (Number.isFinite(next.cost) && next.cost < camera.cost) {
        const improvement = camera.cost - next.cost;
        camera = next;
        damping = Math.max(1e-10, damping / 3);
        if (improvement < 1e-10) break;
      } else damping *= 10;
      if (damping > 1e12) break;
    }
    return camera;
  };
  const best = planar ? evaluate(analyticRows, analyticScale) : optimize(analyticRows);
  const size = best.scale / radius;
  if (!Number.isFinite(size) || size <= 1e-12 || !Number.isFinite(best.cost)) return undefined;
  return {
    pairCount: pairs.length,
    rmsPx: Math.sqrt(best.cost / pairs.length),
    scale: size,
    rows: best.rows,
    project: (position) => {
      if (position.length !== 3 || !position.every(Number.isFinite))
        throw new Error("Projection requires a finite world point.");
      const centered = sub(position, wm);
      return [
        im[0]! + size * dot(best.rows[0], centered),
        im[1]! + size * dot(best.rows[1], centered),
      ];
    },
  };
}
