import { unreachable } from "@motion5/core/plugin-api";
import type { SolveQuality } from "../../src/ik-result";

/**
 * The iterations a solve's quality states, or `undefined` for a closed-form kind, read by an
 * exhaustive switch over the union.
 *
 * `solveChain` and `solveChain3d` return the whole `SolveQuality`, and only the iterative kinds
 * carry `iterations`, so a case that reads the count off a dispatcher result has to narrow first.
 * `inspectSolve` is not that narrowing: it projects a closed form to 0 iterations, which would let
 * a case asserting "fewer than the free cap" pass on an answer that never iterated. `undefined`
 * fails every numeric matcher instead. The envelope and #514 suites each carried or needed this
 * reading, so it has one owner here rather than a copy per suite.
 */
export function iterationsOf(quality: SolveQuality): number | undefined {
  switch (quality.kind) {
    case "reached":
    case "too-far":
    case "too-near":
    case "coincident":
      return undefined;
    case "converged":
    case "stalled":
    case "iteration-cap":
    case "conflicted":
    case "limited":
      return quality.iterations;
    default:
      return unreachable(quality);
  }
}
