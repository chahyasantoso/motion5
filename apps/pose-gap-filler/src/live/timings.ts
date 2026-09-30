/** The stages one live frame passes through, in order. */
export const STAGES = ["detect", "adapt", "fill", "write", "draw"] as const;
export type Stage = (typeof STAGES)[number];

/** The stages timed in the page; `detect` runs inside the source and arrives with its sample. */
type PageStage = Exclude<Stage, "detect">;

export interface FrameTimings {
  readonly tMs: number;
  readonly stages: Readonly<Record<Stage, number>>;
}

/**
 * Per-stage wall time for one live frame, starting where the source's detection ended. Live-only
 * instrumentation: the filler modules never read a clock, and this is not a latency claim about
 * anything but the browser it ran in.
 */
export function createStageTimer(now: () => number = () => performance.now()) {
  let last = now();
  const stages: Record<Stage, number> = { detect: 0, adapt: 0, fill: 0, write: 0, draw: 0 };
  return {
    mark(stage: PageStage) {
      const at = now();
      stages[stage] = at - last;
      last = at;
    },
    finish(tMs: number, detectMs: number): FrameTimings {
      return { tMs, stages: { ...stages, detect: detectMs } };
    },
  };
}

export function formatTimings(timings: FrameTimings): string {
  return STAGES.map((stage) => `${stage} ${timings.stages[stage].toFixed(1)}ms`).join(" · ");
}
