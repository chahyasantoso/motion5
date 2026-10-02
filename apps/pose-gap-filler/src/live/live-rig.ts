import type { GapPipeline } from "../filler/pipeline";
import type { RigSolver } from "../rig/solver";

/**
 * The live page's rig and the camera fit's image half, the one owner of when either is created and
 * disposed. Every setting change restarts both together, so no held bend side, pole direction or
 * stabilizer state crosses from one setting into the next. Disposal is final: an asynchronous
 * continuation (a calibration file read) that resolves after the page is torn down cannot build a
 * rig nobody disposes, because a restart after `dispose` does nothing.
 */
export interface LiveRig {
  readonly solver: RigSolver;
  readonly imageTrust: GapPipeline;
  restart(): void;
  dispose(): void;
}

/** The factories read the page's current settings, so a restart builds what is selected now. */
export function createLiveRig(
  createSolver: () => RigSolver,
  createImageTrust: () => GapPipeline,
): LiveRig {
  let solver = createSolver();
  let imageTrust = createImageTrust();
  let disposed = false;
  return {
    get solver() {
      return solver;
    },
    get imageTrust() {
      return imageTrust;
    },
    restart() {
      if (disposed) return;
      const fresh = createSolver();
      solver.dispose();
      solver = fresh;
      imageTrust = createImageTrust();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      solver.dispose();
    },
  };
}
